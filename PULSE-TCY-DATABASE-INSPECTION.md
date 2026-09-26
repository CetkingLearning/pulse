# Pulse — TCY and Supabase inspection
Date: 26 September 2026
Status: inspection completed; schema proposal only. No database tables or records changed.

## Decisions supported by inspection

- Use the existing **Cetking Learn** Supabase project for Pulse: it contains Arena students and the shared Person registry.
- Reuse `ck_leads.people.id` as the Person reference. Do not create another student master.
- Keep external Pulse attempts separate from `public.test_attempts`. That table has Arena coin-credit, duplicate, normalisation and weekly-summary triggers.
- TCY standard results support overall score/history/count metrics. They do not supply the evidence required for most advanced Pulse analytics.
- All 84 explicitly named dashboard locations remain in scope. Unsupported locations hide; an AI model must not manufacture missing details.

## Sources inspected

1. Live Supabase schema metadata, constraints, triggers and aggregate identity counts in both connected projects.
2. `CetkingLearning/cetking-platform`, branch `feature/tcy-integration`:
   - `docs/tcy-integration.md`
   - `docs/sql/tcy-integration.sql`
   - `plugins/cetking-tcy-integration/includes/class-ck-tcy-client.php`
   - `plugins/cetking-tcy-integration/includes/class-ck-tcy-identity-resolver.php`
3. TCY's 17 September 2026 reply in “Inquiry regarding custom API Integration / B2B Webhook support for student test results”.
4. TCY's “Result API.docx” attachment to its 9 September reply. It includes an existing student's four example test attempts. Only field names and structural conclusions are retained here.

No credentials, student names, emails, external account IDs or real attempt IDs are included in this document.

## Fresh API verification limit

The endpoint was reachable via an unauthenticated HEAD request. A read-only `get_student_scores` POST using the supplied sample identity and available partner credentials failed; the diagnostic retry returned HTTP 403 (Cloudflare, plain text), not a TCY JSON result. The cause is not established. Do not claim invalid credentials, an India-only API restriction, or a successful fresh score fetch from this evidence.

No TCY registration, login, course assignment or other mutation was invoked. Private temporary request material was deleted. Next live test should use the authorised server integration environment and current server-held credentials; do not change network restrictions or place secrets in the page.

## Supabase findings

| Item | Observed |
|---|---|
| Cetking Learn project | `suqcijtpfeaystltekfn` |
| Shared Person table | `ck_leads.people`: 572 records at inspection |
| Source identity links | `ck_leads.person_links` |
| Arena students | `public.students`: 251 records |
| Arena students linked to a Person | 209 |
| Arena students not yet linked | 42 |
| Students with auth_user_id populated | 0 |
| Existing TCY/Pulse tables | None found across the two inspected projects |
| Cetking One AI project | No matching Person/student/TCY/Pulse tables found |

Counts are point-in-time observations, not dashboard fixtures.

Both `ck_leads.people` and `ck_leads.person_links` have RLS enabled. No direct anon/authenticated/service_role table grants appeared for those tables in the inspected role_table_grants result. This is not a complete effective-role privilege audit; inspect the application's existing server access path before implementing.

`person_links` is keyed by `(source_namespace, external_id)` and references `people.id`. The observed Arena namespace is `arena:suqcijtpfeaystltekfn:students`. External IDs map to the Arena student's UUID.

`people.phone` is currently required and unique, with an India-mobile-format constraint. This matters for future non-CETking/email-only imports: do not invent a phone number to create a Person. Resolve onboarding requirements before supporting that path.

The shared Person table's existing lifecycle field is not being redesigned as part of Pulse. Keep lead-management lifecycle work separate.

### Why Arena attempts must not be reused for TCY imports

Observed triggers on `public.test_attempts`:
- `trg_ck_credit_attempt_coins`
- `trg_ck_flag_duplicate_attempt`
- `trg_ck_normalize_test_attempt`
- `trg_ck_refresh_week_summary_after_attempt`

The table also requires an internal `public.tests.id` reference. Importing external mocks there would couple provider data to Arena scoring/reward logic. Reuse identity; isolate results.

### Existing TCY draft is not deployed

The feature branch defines proposed `tcy_students`, `tcy_test_attempts`, course mappings and provisioning jobs, but none of those tables were found in the live projects. Its student UUID columns do not yet enforce a FK to the shared Person registry.

Reconcile the earlier draft before implementation. Do not deploy that SQL unchanged and then create a second independent set of TCY records for Pulse. Purchase/course provisioning remains the existing TCY plugin's responsibility.

## What TCY actually supplies

Endpoint: `POST https://www.tcyonline.com/api/erp_request.php`.
The existing verified integration notes require form fields, not raw JSON.
Action: `get_student_scores`; request includes partner credentials, encoded user ID and page number.
Response envelope: `success`, `error`, `data.student_detail`, `data.total_pages`, and numerically keyed attempt records such as `data["0"]`.

| TCY field | Proposed meaning | Handling |
|---|---|---|
| testtaken_id | Provider attempt ID | Text; TCY confirmed unique per attempt |
| test_id | Provider test ID | Text; not the Arena test UUID |
| category_id, test_category | Provider category | Preserve verbatim; “MBA Entrance” does not identify CAT/CET/etc. |
| test_name | Provider test title | Display data, not a trusted exam/section classification |
| total_score | Reported score | Numeric; preserve valid zero and possible negative values |
| score_percentage | Reported score percentage | Strip percent sign carefully; **not percentile and not accuracy** |
| total_questions | Available questions | Nullable nonnegative integer |
| total_correct | Correct answers | Nullable nonnegative integer |
| total_incorrect | Wrong answers | Nullable nonnegative integer |
| total_attempts | Attempted questions | Nullable integer; this is not the number of mock attempts |
| total_unattempts | Unattempted questions | Nullable nonnegative integer |
| attempt_date | Provider date/time string | Preserve original; timezone must be established before UTC conversion |

The sample mixes strings and numbers. One example has 32 correct and 8 wrong but a reported score of 30: preserve the provider's score rather than assuming a universal marking formula.

The four sample records include short topic tests, not just full mocks. Store test type as unknown until a reviewed catalog mapping classifies full mock / sectional / topic. Do not automatically label every TCY attempt “Mock taken” or put unlike tests into one score trend.

TCY explicitly confirmed:
- `students_list` can find existing students using email where present.
- Multiple accounts can share an email (also documented by existing integration testing).
- `testtaken_id` uniquely identifies an attempt.
- No question/section-wise Result API was available in its reply.
- No webhook was available in its earlier reply.

Use reviewed identity matching and paginated polling, not silent first-email-match selection.

## Dashboard coverage from this API

| Category | Supported now / conditional / unsupported |
|---|---|
| Score history and result log | Supported from provider results |
| Correct/wrong/unattempted funnel | Supported when counts reconcile |
| Accuracy and attempt rate | Derived from counts with zero-denominator guards |
| Tests taken | Supported; mocks taken only after test-type classification |
| Score trends / last-four comparison | Conditional on comparable exam/test-type/provider grouping |
| Basic score dispersion | Conditional on enough comparable attempts; no arbitrary A/B grade |
| Student target | Our own input, not supplied by TCY |
| Predicted standing / percentile / marks-to-target | Not established by this API |
| Section cards / section radar / cockpit | Section result data unavailable |
| Minutes/correct / timing scatter / leaks | Elapsed/item timing not in inspected contract |
| Difficulty charts / adjusted score | Difficulty/calibration data not supplied |
| Mistake types / repeat patterns | Question evidence or confirmed student tags required |
| Five-bar score attribution | Requires a defined non-overlapping method and additional evidence |
| Detailed next-action plan | Only evidence-supported advice; never fabricate time/topic findings |

## Proposed database structure (not applied)

Use a private `pulse` schema in Cetking Learn. Private schema placement is not sufficient by itself: explicitly control grants, apply RLS and use the existing authenticated server identity flow. Because current Arena students have no auth_user_id mapping, do not blindly use `auth.uid() = student_id`.

### Phase 1: five tables

| Table | Core fields and constraints |
|---|---|
| pulse.provider_accounts | id, person_id FK to ck_leads.people, provider, provider_namespace, external_user_id text, verification method/status/time; unique(provider_namespace, external_user_id); reviewed association only |
| pulse.test_catalog | id, provider_namespace, external_test_id text, title, provider category, exam nullable, test_type default unknown, maximum score/scoring metadata nullable, mapping provenance; unique(provider_namespace, external_test_id) |
| pulse.attempts | id, provider_account_id FK, catalog_id FK, external_attempt_id text, reported_score, reported_score_percentage, question counts, provider date string, attempted_at nullable, timezone provenance, raw attempt object, synced_at; unique(provider_account_id, external_attempt_id) |
| pulse.targets | id, person_id FK, exam, cycle, exam_date, desired standing/score and scale; unique person/exam/cycle where appropriate |
| pulse.sync_runs | id, provider account, started/finished time, status, pagination progress, fetched/inserted/updated/rejected counts, sanitised error code, retry information; no credentials |

Store Person ownership through the provider-account FK; avoid independently editable duplicate owner IDs in child rows. Validate any catalog link belongs to the same provider namespace. Store external IDs as opaque text.

Provider accounts need a reviewed link to the master Person; optionally mirror the external identity into existing person_links using the same authoritative transaction. Do not maintain two conflicting identity maps. Resolve the existing TCY draft’s mapping ownership before creating either.

### Phase 2: reserve three extensions

| Table | Purpose |
|---|---|
| pulse.section_results | Attempt FK, provider-native section, reviewed display-section mapping, counts, score and optional timing |
| pulse.question_results | Attempt FK, stable question identifier, topic/difficulty, outcome, time, evidence-backed or student-confirmed mistake tags |
| pulse.analyses | Person/attempt scope, source snapshot or input hash, calculation/model version, generated_at, supported findings and plan |

These are future input paths for detailed student-pasted reports or a richer provider API. Do not populate them with inferred TCY question details.

### Import rules

- Unknowns remain null; zero is not missing.
- Correct + wrong should equal attempted, and attempted + unattempted should equal total where those fields are all present. Quarantine inconsistencies with the raw source rather than silently rewriting counts.
- Percentage is not percentile. Do not backsolve a maximum score from a rounded score percentage.
- Dates lacking a confirmed timezone retain their source string until the parser policy is verified.
- Upsert by scoped provider attempt ID. Repeated polling must not duplicate attempts.
- Preserve only the attempt object needed for provenance, not the response's student-detail PII or request credentials.
- Fetch all pages and detect repeated pages; update successful-sync status only after the complete run succeeds.
- First build a server-side authorised read path; the Pulse HTML receives only that student's presentation model.
- No coins or Arena weekly summaries should be affected by import.
- Do not auto-merge the 42 unlinked Arena identities based only on a name/email.

## Next implementation gate

The inspection is sufficient to design the isolated Phase-1 structure. Before wiring live sync:
1. Reconcile the TCY feature-branch draft with shared Person ownership.
2. Create/version the isolated tables and validate grants/RLS using the current server identity model.
3. Run one authorised successful TCY score read from the intended hosting environment.
4. Confirm date timezone and reviewed test-type/exam catalog mappings.
5. Import one selected, verified account idempotently; then populate only supported Pulse fields.

No schema migration, account mapping, backfill, sync schedule or production switch was applied during this inspection.
