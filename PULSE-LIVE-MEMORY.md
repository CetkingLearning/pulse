# Pulse — current dashboard and next data step

Updated 26 September 2026. Interface version 0.2.

## Product and scope

One student mock dashboard, with six fixed tabs: Summary, Progress, Benchmark, Strategy, Mistakes, Change. Keep the warm background, dark blue and orange design and Quant / Verbal / Logic section labels. Preserve provider-native section names in the future raw-data layer; exam-specific mapping still needs review.

The user asked to finish the dashboard first, then investigate TCY data. This version finalises the interface and safe rendering boundary only. No TCY, Supabase, AI import, authentication or entitlement integration is included.

The original `PULSE-DASHBOARD-AUDIT.md` is a historical v0.1 audit; its update note describes fixes delivered by 0.2. The explicit feature list contains 84 named top-level slots, not 85. Summary slot 26 remains unspecified. Preserve every named location and nested requirement; do not invent a new tab or metric.

## Opening the page

- `pulse.html`: empty state; no account implied and no sample values visible.
- `pulse.html?demo=1` or **View demo**: complete illustrative dashboard.
- **Exit demo**: restores previously supplied student data, otherwise empty.
- No network data requests are made. The old `?sb=`, `?sid=` and `?sb_base=` loader is removed.
- Student ID and Load remain in Connection tools, disabled until a real authorised integration exists.
- Chart.js 4.4.3 and fonts remain CDN dependencies. A readable data fallback replaces a chart if the chart library fails.

## Rendering boundary

The next adapter calls `window.Pulse.setDashboard(viewModel)` after fetching, validating and calculating student data. Call `window.Pulse.clear()` on logout, failed load or student change before an asynchronous request. Do not retain the preceding student's results while loading another student.

The renderer accepts a presentation view model, **not raw TCY JSON**. No raw-score calculations are implemented here. Do not connect arbitrary raw payloads directly or pass unreviewed AI prose as established facts.

```js
window.Pulse.setDashboard({
  student: {
    id: 'internal-student-id',
    name: 'Student name',
    exam: 'Exam name',
    days_out: 71,
    profile_url: 'https://approved.example/student/profile'
  },
  slots: {
    'summary.net': { value: 0, note: 'Latest mock' },
    'summary.accuracy': { value: '75%', note: '30 correct / 40 attempted' },
    'summary.headline': 'A supported observation',
    'summary.quant': {
      accuracy: '75%', attempted: '12 / 20', minutes: '2.4 min',
      trend: '+2.0', status: 'Hold', hint: 'A supported section-specific suggestion.'
    },
    'progress.log': [
      ['M1', '2026-09-26', null, '120m', '40/66', '30 / 10', '75%', 80, null, 4, '0.67', null]
    ]
  },
  charts: {
    // Use the ten fixed canvas IDs below with trusted Chart.js configuration.
    // Only provide datasets supported by the validated source data.
  }
});
```

All supplied values are presentation values. `null`, undefined and empty strings hide their locations; numeric zero is valid. Omitted cards/charts and unsupported narrative hide. Missing table cells remain blank so the schema and column alignment are preserved. Table links use `{label, url}` objects and permit HTTP(S) only. The integration must additionally restrict report/profile hosts to approved providers.

Each render rebuilds the view from the template and clears all chart instances. Dynamic text uses safe DOM text assignment. The `student` object controls initials, name, exam/days and optional Open SB link. `Pulse.demo()` displays fixtures; `Pulse.mode` is `empty`, `demo` or `student`.

## Slot keys and shapes

`SLOT_DEFINITIONS` in `pulse.html` is the executable list of 61 dynamic binding groups. Static question lines, labels, navigation, two Summary jumps and connection chrome account for the remaining named locations. One grouped binding may contain several required nested fields.

| Shape | Keys | Value |
|---|---|---|
| Text | summary.bottleneck, headline, explanation, predicted, latest, best, target, gap, hold, fix, take, stop | String or number; each key prefixed `summary.` |
| KPI | summary.mocks, net, accuracy, attemptRate, minutesCorrect, consistency | `{value, note?}`; each key prefixed `summary.` |
| Section card | summary.quant, summary.verbal, summary.logic | `{accuracy, attempted, minutes, trend, status, hint}` |
| KPI | benchmark.target, predicted, marksGap, floors, lastFour, ready | `{value, note?}`; each key prefixed `benchmark.` |
| KPI | strategy.timeQuestion, timeCorrect, timeWrong, skipTime, pacing, marksMinute | `{value, note?}`; each key prefixed `strategy.` |
| KPI | mistakes.wrongs, slips, concept, timePressure, selection, streak | `{value, note?}`; each key prefixed `mistakes.` |
| Text | benchmark.callout, strategy.callout | String |
| Table | progress.log | 12 cells: Mock, Date, Diff, Time, Att, C/W, Acc, Net, Standing, Min/C, Eff, SB |
| Table | benchmark.cockpit | Six metric rows, five cells: Metric, Quant, Verbal, Logic, Healthy |
| Table | strategy.leaks | Seven cells: Mock, Section, Item, Time, Outcome, Leak, Rule |
| Table | mistakes.repeats | Six cells: Pattern, Section, Type, Times, Last seen, Fix |
| Copy | change.copy | `{headline, paragraph}` |
| Table | change.load | Five rows, two cells: activity and load |
| Table | change.criteria | Five rows, two cells: measure and change |
| Table | change.marks | Five rows, three cells: move, expected change, effort |
| List | change.rules, change.avoid | Five and four strings respectively |

Do not pad unsupported plans or rows to match the fixture count. The full-data view supports every required row; the partial-data view must hide unsupported content.

## Chart IDs

| Canvas ID | Content |
|---|---|
| funnelChart | Available, attempted, correct, wrong, left |
| trajChart | Net, adjusted score, standing |
| accAttChart | Accuracy vs attempt rate |
| decompChart | Five score movers |
| benchChart | Six-spoke benchmark radar |
| mpcChart | Three section minutes/correct vs band |
| scatterChart | Time/accuracy bubble scatter |
| balanceChart | Six spokes, three section shapes |
| mistakeChart | Four mistake types |
| diffChart | Easy/Medium/Hard accuracy for each section |

Chart configurations belong under `viewModel.charts[canvasId]`. The ten chart-type slots do not use `slots`. Normalisation, source windows, labels and applicable bands must be established by the adapter/metric layer. Chart configs must be plain cloneable data, not executable callbacks. Avoid fixed demo axis ranges for real data. Omit unsupported series and use a legend for multi-series charts.

## TCY investigation next

1. Inspect an authorised real TCY result response server-side; document available fields, pagination and attempt identifiers. Do not assume question timing, difficulty or section detail exists.
2. Establish an authenticated student-to-TCY identity mapping; enforce ownership on the server. Keep all TCY partner credentials server-side.
3. Store canonical raw results with source, exam, marking rules, provider and date. Deduplicate attempts, preserve unknowns and valid zero.
4. Compute supported fields, then map into the view model. TCY and future pasted-result imports must share the same canonical layer.
5. Populate scores/history first. Add advanced analysis only when evidence supports it. Define entitlements before adding CETking-exclusive locks.

## Metric guardrails

- Accuracy = sum(correct)/sum(attempted); attempt rate = sum(attempted)/sum(available). Label the window and guard zero denominators.
- Total minutes/correct differs from time spent on correct questions. Time/wrong and sunk-on-skips require item outcomes/timing.
- Use reported score where available. Never default every exam to +3/−1. Use explicit rules and preserve raw vs scaled scores.
- The previous Easy ×0.92 / Hard ×1.08 adjustment and generic healthy bands were prototype assumptions, not validated production formulas.
- Standing predictions, marks-to-target, radar scaling, consistency grades, pacing, section floors and readiness need explicit methods before display.
- Avoid counting attempts, accuracy, negatives and time savings as independent additive improvements.
- Mistake tags need evidence or student confirmation; an easy wrong is not automatically a slip.
- Demo recommendations and grades are illustrative only. Never reuse them as fallback student analysis.

## Validation delivered

Six automated DOM regressions pass. Chromium desktop (1440px) and mobile (390px) checks passed across all six tabs with the pinned Chart.js package: ten chart instances, no page overflow, no JavaScript errors, clean exit to empty. CDN failure fallback also checked. No real TCY/student integration was tested.


## Recovered TCY integration history — 26 September 2026

The user requested that the earlier TCY Integration Memory conversation guide this work, supplying https://chatgpt.com/share/6ab7984f-11ac-83ee-946c-78c7b4fea5d1 . Direct retrieval of that link was unavailable. The following comes from retrieved prior conversation history (17 September), corroborated where noted by the existing feature-branch documentation inspected on 26 September; it is not a claim to have read the full shared page.

- Earlier work reported successful live tests of get_courses, students_list, register, login/autologin, add_course and get_student_scores. Preserve that prior success; the latest HTTP 403 is a separate failed request, not evidence that TCY has no working API.
- get_student_scores uses POST form fields and provides a paginated history of individual test-attempt summaries: scores, score percentages, correct/wrong/attempted/unattempted counts, test/category identifiers and dates. “Overall” means per-test aggregate data, not one combined score for the student.
- The existing implementation is in CetkingLearning/cetking-platform on feature/tcy-integration. Prior history refers to draft PR #21; current PR status was not rechecked for this note. Reuse/reconcile the dedicated TCY client and identity resolver rather than starting them again.
- Provisioning was staged with production OFF; the earlier tests do not mean the production purchase flow or score-sync worker was deployed. The latest database inspection found no TCY/Pulse tables in either connected project.
- Resolve identity using an established mapping or reviewed students_list results. Duplicate email matches require review. Prior testing also reported that a tested encoded ID resolved to a different historical student than the supplied sample: verify returned identity before attaching any scores to a Person.
- testtaken_id is the provider attempt identifier. Deduplicate within the provider/account scope.
- No question/section result API was available in TCY's 17 September written reply, separately inspected during the database review. Do not infer timings, percentile, rank or question-level detail from summary counts.
- Purchase provisioning, course mapping and autologin remain the dedicated TCY plugin's responsibilities. Pulse consumes authorised results.
- Keep all credentials and actual student identifiers outside this repository and client-side code.

See PULSE-TCY-DATABASE-INSPECTION.md for the newer live schema findings and the exact limitations of the 26 September API check.


## Verified CAT import — 26 September 2026

Added a read-only local TCY JSON importer in Connection tools. It accepts a successful single-page get_student_scores response, recognises CAT Mock numbered titles, excludes sectionals/topics, deduplicates testtaken_id, validates counts and uses reported scores. Multi-page responses are rejected until an authenticated server-side pagination adapter exists. Import does not upload files or persist browser data.

A real student's two full CAT mocks were checked privately, including exact attempt/test identifiers against the owner-supplied report. Six sectional attempts were excluded. Verified snapshot was delivered privately; no student identity, result payload, email, partner credentials or private snapshot is committed here. Available metrics: reported net, best, mock count, latest accuracy and attempt rate, average wrongs, full-mock log, funnel and score/accuracy/attempt trends. Percentile, section breakdown, timing, consistency grades, benchmarks and mistake classifications remain hidden. The website report contains richer fields that the API response did not supply.

Eight DOM/adapter tests pass. No authenticated sync, database import, entitlement or hosted deployment was completed in this step. Earlier statements above that no raw adapter exists are superseded by this local importer only.
