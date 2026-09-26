# Pulse — dashboard readiness audit and implementation checklist

Date: 26 September 2026
Repository: CetkingLearning/pulse
Inspected: pulse.html (blob f6792cd311f9001264a55e6a09c80f1f35e152f0) and PULSE-LIVE-MEMORY.md on main.
Scope: source-code audit; no real student endpoint, authentication, TCY sync, or browser rendering verified. This document does not claim production readiness.

## Outcome

Pulse has the six-tab visual template and all ten chart definitions. applyStudent updates identity, profile link and mock log only. Every chart retains startup demo data. Summary/Benchmark/Strategy/Mistakes/Change remain hardcoded. Real-data mode therefore mixes a real student with another student's sample analysis and must not ship as-is.

No implementation or new release is included in this audit. Existing v0.1 page is preserved.

## Checklist accounting

User totals: Chrome 15; Summary 26; Progress 5; Benchmark 11; Strategy 11; Mistakes 10; Change 7 = 85.
The explicit Summary enumeration contains 25 top-level slots. The checklist below preserves all 84 named slots plus one unresolved accounting entry. Do not claim 85 implemented or invent the missing feature. Nested fields and all sample-sentence locations remain in scope.

Statuses: Ready = static UI/control exists (not end-to-end verified); Needs wiring = binding/state correction; Needs calculation = documented deterministic computation; Needs more data = current aggregate scores alone cannot substantiate it. Statuses indicate primary blocker, not the absence of other work.

## Chrome (15)

| ID | Slot | Status | Evidence / required work |
|---|---|---|---|
| CHR-01 | Brand | Ready | Static Pulse brand. |
| CHR-02 | Initials | Needs wiring | Updates, but derived from fallback source when name missing. |
| CHR-03 | Name | Needs wiring | Updates; hide when missing rather than using source/id as name. |
| CHR-04 | Exam + days out | Needs wiring | Updates; remove Target exam fallback; explicit exam/date context. |
| CHR-05 | Summary tab | Ready | Tab switching implemented. |
| CHR-06 | Progress tab | Ready | Tab switching implemented. |
| CHR-07 | Benchmark tab | Ready | Tab switching implemented. |
| CHR-08 | Strategy tab | Ready | Tab switching implemented. |
| CHR-09 | Mistakes tab | Ready | Tab switching implemented. |
| CHR-10 | Change tab | Ready | Tab switching implemented. |
| CHR-11 | Student ID box | Ready | Present; retain for authorised staff/testing. |
| CHR-12 | Load | Needs wiring | Fetch scaffold exists; live endpoint/auth not verified. |
| CHR-13 | Demo | Needs wiring | Resets log/identity only; needs complete isolated demo state. |
| CHR-14 | Status line | Needs wiring | Connected currently implies success while most content remains demo. |
| CHR-15 | Open SB | Needs wiring | Validate supplied URL; hide if absent; no fabricated report/profile URLs. |

## Summary (26)

| ID | Slot | Status | Evidence / required work |
|---|---|---|---|
| SUM-01 | Question line | Ready | Static question present. |
| SUM-02 | Bottleneck label | Needs calculation | Select evidence-backed bottleneck and actual analysis window. |
| SUM-03 | Headline | Needs calculation | Replace static Verbal diagnosis. |
| SUM-04 | Paragraph | Needs calculation | Every numeric claim must come from current data. |
| SUM-05 | Change button | Ready | Tab jump implemented. |
| SUM-06 | Strategy button | Ready | Tab jump implemented. |
| SUM-07 | Predicted standing | Needs more data | Requires calibrated prediction or explicitly sourced estimate. |
| SUM-08 | Latest mock standing | Needs wiring | Use latest dated mock with reported standing. |
| SUM-09 | Best standing | Needs calculation | Maximum reported standing within comparable exam/provider. |
| SUM-10 | Target | Needs wiring | student.target_standing is documented but ignored. |
| SUM-11 | Gap line | Needs more data | Marks/standing mapping plus evidence for recommendation. |
| SUM-12 | Mocks taken | Needs calculation | Validated deduplicated count. |
| SUM-13 | Net | Needs calculation | Use supplied score or explicit marking rules. |
| SUM-14 | Accuracy | Needs calculation | sum(correct)/sum(attempted), declared window. |
| SUM-15 | Attempt rate | Needs calculation | sum(attempted)/sum(total), declared window. |
| SUM-16 | Minutes per correct | Needs calculation | sum(minutes)/sum(correct), denominator guard. |
| SUM-17 | Consistency | Needs calculation | Declare window, dispersion definition and grade thresholds. |
| SUM-18 | Quant section card | Needs wiring | All six nested fields required: accuracy; attempted/total; minutes/correct; trend; one-word status; one-line hint. sections is currently discarded. |
| SUM-19 | Verbal section card | Needs wiring | All six nested fields required: accuracy; attempted/total; minutes/correct; trend; one-word status; one-line hint. sections is currently discarded. |
| SUM-20 | Logic section card | Needs wiring | All six nested fields required: accuracy; attempted/total; minutes/correct; trend; one-word status; one-line hint. sections is currently discarded. |
| SUM-21 | Funnel | Needs calculation | funnelChart: available, attempted, correct, wrong, left; actual declared window. |
| SUM-22 | Hold read | Needs more data | Requires supporting section/topic/question evidence; hide unsupported claims. |
| SUM-23 | Fix read | Needs more data | Requires supporting section/topic/question evidence; hide unsupported claims. |
| SUM-24 | Take read | Needs more data | Requires supporting section/topic/question evidence; hide unsupported claims. |
| SUM-25 | Stop read | Needs more data | Requires supporting section/topic/question evidence; hide unsupported claims. |
| SUM-26 | Unspecified slot 26 | Unresolved specification | User states 26 Summary slots but explicitly lists 25. Reserved accounting entry only; do not invent a UI feature. |

## Progress (5)

| ID | Slot | Status | Evidence / required work |
|---|---|---|---|
| PRO-01 | Question line | Ready | Present. |
| PRO-02 | Score trajectory | Needs wiring | trajChart: net, adjusted, standing; hide unsupported series. |
| PRO-03 | Accuracy vs attempt | Needs calculation | accAttChart: validated chronological mock metrics. |
| PRO-04 | Score movers | Needs more data | decompChart: five bars (attempts, accuracy, negatives, selection, time); attribution method required to avoid double counting. |
| PRO-05 | Mock log | Needs wiring | vaultTable: all 12 columns exist; missing values currently become zero/NaN, HTML not escaped, mobile hides five columns. |

## Benchmark (11)

| ID | Slot | Status | Evidence / required work |
|---|---|---|---|
| BEN-01 | Question line | Ready | Present. |
| BEN-02 | Target standing | Needs wiring | Bind explicit target. |
| BEN-03 | Predicted | Needs more data | Same sourced estimate as Summary. |
| BEN-04 | Marks to close | Needs more data | Calibrated score-to-standing mapping required. |
| BEN-05 | Section floors | Needs more data | Exam/provider-specific configured thresholds. |
| BEN-06 | Vs last 4 | Needs calculation | Latest minus previous four comparable mocks; exclude latest from baseline. |
| BEN-07 | Ready signal | Needs calculation | Document threshold/window; insufficient evidence must not mean Not yet. |
| BEN-08 | Radar | Needs more data | benchChart: six normalised dimensions and justified target band. |
| BEN-09 | Cockpit table | Needs calculation | Six rows × Quant/Verbal/Logic + healthy band; no generic invented band. |
| BEN-10 | Callout | Needs calculation | Evidence-backed comparison. |
| BEN-11 | Minutes per correct chart | Needs more data | mpcChart: section times/correct and configured band. |

## Strategy (11)

| ID | Slot | Status | Evidence / required work |
|---|---|---|---|
| STR-01 | Question line | Ready | Present. |
| STR-02 | Time per question | Needs calculation | Define denominator: available vs attempted; label explicitly. |
| STR-03 | Time per correct | Needs calculation | Distinguish total test minutes/correct from time spent on correct items. |
| STR-04 | Time per wrong | Needs more data | Question timing and outcomes required. |
| STR-05 | Sunk on skips | Needs more data | Time spent on unattempted/abandoned items required. |
| STR-06 | Pacing | Needs calculation | Define 0–100 metric and required timing data. |
| STR-07 | Marks per minute | Needs calculation | Net / actual elapsed minutes; positive denominator. |
| STR-08 | Time–accuracy scatter | Needs wiring | scatterChart remains demo; fixed axes can clip real data; scatter r field does not implement stated bubble sizing. |
| STR-09 | Section radar | Needs more data | balanceChart: six spokes, one shape per section; documented normalisation. |
| STR-10 | Leak table | Needs more data | leakTable: seven required columns; header missing (orphan closing thead). Needs item timing/outcomes and supported rules. |
| STR-11 | Callout | Needs calculation | Exam-aware recommendation from evidence. |

## Mistakes (10)

| ID | Slot | Status | Evidence / required work |
|---|---|---|---|
| MIS-01 | Question line | Ready | Present. |
| MIS-02 | Wrongs per mock | Needs calculation | Validated wrong total / relevant mock count. |
| MIS-03 | Slips | Needs more data | Confirmed tags; cannot infer from easy wrong alone. |
| MIS-04 | Concept | Needs more data | Confirmed tags. |
| MIS-05 | Time pressure | Needs more data | Confirmed tags or documented evidence-based classifier. |
| MIS-06 | Bad selection | Needs more data | Confirmed tags/selection evidence. |
| MIS-07 | Repeat streak | Needs more data | Stable pattern IDs and declared streak definition. |
| MIS-08 | Mix chart | Needs more data | mistakeChart: four types; define denominator and unknown-tag handling. |
| MIS-09 | Difficulty accuracy | Needs more data | diffChart: Easy/Medium/Hard for each section; question counts, not overall mock difficulty. |
| MIS-10 | Repeat log | Needs more data | repeatTable: Pattern, Section, Type, Times, Last seen, Fix. Header missing (orphan closing thead). |

## Change (7)

| ID | Slot | Status | Evidence / required work |
|---|---|---|---|
| CHA-01 | Question line | Ready | Present. |
| CHA-02 | Headline + paragraph | Needs more data | Evidence-backed plan; generated date must be current. |
| CHA-03 | 14-day load | Needs more data | Five rows, based on weaknesses and available study time. |
| CHA-04 | New rules | Needs more data | Five supported lines; do not pad missing evidence. |
| CHA-05 | Success criteria | Needs more data | Five measurable rows with real baseline. |
| CHA-06 | Do-not list | Needs more data | Four supported lines. |
| CHA-07 | Marks you can buy | Needs more data | Five rows: move, expected change, effort; assumptions/ranges, no additive double counting. |

## All ten charts

| Chart | DOM ID | Current live refresh |
|---|---|---|
| Funnel | funnelChart | Missing |
| Score trajectory | trajChart | Missing |
| Accuracy vs attempt | accAttChart | Missing |
| Score movers | decompChart | Missing |
| Benchmark radar | benchChart | Missing |
| Minutes per correct | mpcChart | Missing |
| Time–accuracy scatter | scatterChart | Missing |
| Section radar | balanceChart | Missing |
| Mistake mix | mistakeChart | Missing |
| Difficulty bars | diffChart | Missing |

## Blocking defects and acceptance requirements

1. Clear every previous student/demo value before loading, on empty data, and on failure. Real mode must never fall back to demo. Demo must be explicit and reset every chart, table, sentence and identity field.
2. Preserve unknown as null; preserve valid zero. Current truthy fallbacks conflate zero and missing, default difficulty to Medium and fabricate timings/URLs. Validate numeric ranges and relationships (correct + wrong = attempted where applicable; attempted <= total).
3. Render imported text with textContent/safe DOM APIs. fillVault currently interpolates untrusted IDs/dates/URLs into insertAdjacentHTML. Permit only validated http(s) report/profile URLs.
4. Retain and validate sections/questions. Current adapter drops them. Treat API responses and AI extraction as untrusted data.
5. Manage chart instances and update/destroy on every student change. Show only supported series; hide unsupported charts and attached narrative/legends. No sample hints, deltas, thresholds or generated dates in real mode.
6. Restore seven leak-table headers and six repeat-table headers. Make all required columns reachable on mobile (scroll or row expansion), rather than hiding them permanently.
7. Authenticate before loading student data; server must enforce ownership/roles. Student ID is not authorisation. Existing fetch scaffold with credentials is not evidence of backend access control.
8. Do not use configurable arbitrary origins as an authenticated production backend. Restrict endpoints to approved configuration. No partner/API secrets in the page.
9. Missing data hides the specific field/slot and unsupported sentence; valid zero remains visible. Entirely unsupported cards/charts hide. An empty dashboard can display a neutral import prompt outside analytical slots.
10. Distinguish missing-data states from entitlement locks. Staff/test controls remain specified; the student-facing placement proposal is not an implemented access-control design.

## Metrics decisions before wiring

The legacy memory file proposes default +3/-1, Easy ×0.92 / Hard ×1.08, a 70–80% attempt band and 75% accuracy band. These are existing prototype assumptions, not validated universal exam rules. Do not silently carry them into all-exam live analytics.

- Store exam, year/rules version, provider, mock ID, attempt ID, date/time and data provenance. Separate exam/provider series; deduplicate by provider + attempt ID.
- Prefer reported score. Calculate only with explicit marking rules including question type where required. CET/NMAT must not inherit a negative-marking default. Preserve scaled score vs raw score distinction.
- Accuracy: sum correct / sum attempted ×100. Attempt rate: sum attempted / sum available ×100. Zero denominators mean unavailable.
- Minutes/correct: sum elapsed minutes / sum correct. Marks/minute: sum net / sum elapsed minutes. Item-level time-on-wrong is a distinct measure requiring item timings.
- Define windows once and use them consistently in labels, charts and copy. Sort valid dates before latest/baseline comparisons.
- Predicted standing and marks-to-target require a sourced/calibrated method. Never relabel mean mock percentile as an exam prediction.
- Define consistency and grades; section trend; efficiency; pacing; section floors; readiness; difficulty-adjusted accuracy; selection and radar normalisation before showing them.
- Score-mover bars need a decomposition method: attempts, accuracy and negatives overlap. Time saved/selection are not independently additive marks.
- Mistake classifications require evidence or confirmed student tags; an easy wrong does not automatically mean a slip. Untagged results must not be silently assigned to a type.
- Healthy bands and recommended strategy must be exam-specific. Label hypothetical improvements as scenarios with assumptions, never guaranteed marks.

## Shared input plan (after dashboard wiring)

One canonical result format feeds Pulse from TCY, manual entry and AI-extracted pasted results. Use null for unknowns and retain provenance per field where practical. AI proposes extraction; student reviews uncertain values before save. Deterministic code computes metrics; AI may explain supported findings. Opening an unchanged dashboard should not invoke the model.

Later entry points: Add Mock Result (paste/manual/eligible TCY connection); Copy my results for AI (student-owned export). TCY partner credentials remain server-side. A future student API must be read-only, scoped and revocable.

Six tabs remain unchanged. Eligible CETking features may be locked for external students; enforce entitlements server-side. Do not confuse a paid lock with a field hidden because data is missing. No seventh AI tab is needed.

## Implementation sequence

1. Real/demo isolation, null-safe validation, safe rendering, table headers and mobile column access.
2. Canonical result adapter and deterministic core metrics; complete all directly supported bindings.
3. Definition/data-gated advanced metrics, all ten chart refresh paths and evidence-backed narrative.
4. Student authentication/entitlements and verified TCY adapter.
5. Paste → extraction → review → save; use same rendering path as TCY.
6. Release only after acceptance scenarios pass; do not mark this audit as a live-data release.

## Acceptance scenarios

- Full fixture: every named slot and all nested structures populate; all ten charts use current data.
- Partial/empty fixture: no fake zeros, sample values, unsupported claims, NaN or Infinity.
- Demo → student A → student B → empty/error → Demo: no stale identity, data or charts.
- Zero correct, zero attempts, zero score, missing times, unsorted dates and duplicate attempts.
- No-negative marking and question-type-specific marking fixtures; provider-reported scaled score preserved.
- Imported HTML/unsafe URLs displayed safely or rejected.
- Mobile access to 12 mock-log, seven leak-log and six repeat-log columns.
- Unauthorised student ID cannot retrieve another student's records.
- Every recommendation traceable to current source fields/rules; unknown tags remain unknown.
