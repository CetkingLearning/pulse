# Pulse — complete developer memory (0.1)

Source of truth for a coder making Pulse live. Do not redesign. Do not add a tab. Fill every slot from real data, or hide the slot. Never leave a demo number on a live student.

Repo: https://github.com/CetkingLearning/pulse
Release: v0.1
Page: pulse.html (single file, Chart.js 4 from jsDelivr, no build step)
Brand: Pulse. Do not write CAT in the UI. Sections stay Quant, Verbal, Logic so any exam can use it.

## What it is

A decision page, not a scorecard. One bottleneck, time-costed marks, and a change the student can do before the next test.

## Six student questions (locked)

| Tab | Student question |
|---|---|
| Summary | Where do I stand, right now? |
| Progress | Am I actually improving? |
| Benchmark | How far am I from the target? |
| Strategy | Attempt more, or protect accuracy? |
| Mistakes | Careless, or a concept gap? |
| Change | What do I do differently in the next test? |

Benchmark is a standard to reach, not a rank against classmates. Do not add “what are others doing?”

## Look

- Page `#f3f1ec`, cards `#fffcf7`, ink `#1a2332`, soft ink `#5b6577`, line `#e4ddd0`.
- Dark blue `#0b1f3a` — header, Quant, net score, Demo button. Not `#2a6f97` or `#1c3d5a`.
- Orange `#e25b12` — buttons, positive deltas, Logic, adjusted-score line. Not green `#0f7a6c`.
- Amber `#c47b17` warnings only. Coral `#c44536` down / wrong. Verbal `#6b4c9a`.
- Fonts: IBM Plex Sans, IBM Plex Serif.
- Mobile first. Charts 132px under 640px (110px if `.sm`). Tables 10px. Hide extra columns until 900px.
- Hidden on phone, shown at 900px: mock-log Date, Time, Standing, Min/C, Eff; leak Mock and Outcome; repeat Last seen.

## Open and data

`pulse.html?sb=STUDENT_ID`
`pulse.html?sb_base=https://sb.cetking.in`

Fetch, in order, until one returns JSON:

1. `{sb_base}/api/students/{id}/pulse.json`
2. `{sb_base}/api/students/{id}`
3. the pasted URL, if it is already JSON

Default `sb_base`: `https://sb.cetking.in`.
If fetch fails: keep demo data and show the error. Do not blank the page.
CORS must allow the WordPress origin, or serve the page on the same host as the API.

### JSON

```json
{
  "student": {
    "id": "STU123",
    "name": "Student Name",
    "exam": "Target exam",
    "days_out": 71,
    "target_standing": 99,
    "profile_url": "https://sb.cetking.in/student/STU123"
  },
  "mocks": [
    {
      "id": "P12",
      "date": "2026-09-10",
      "diff": "M",
      "mins": 120,
      "q": 66,
      "att": 49,
      "c": 36,
      "w": 13,
      "net": 95,
      "pct": 91.8,
      "acc": 73.5,
      "mpc": 3.33,
      "sb_url": "https://sb.cetking.in/report/P12",
      "sections": {
        "quant":  { "q": 22, "att": 16, "c": 12, "w": 4, "mins": 40 },
        "verbal": { "q": 24, "att": 16, "c": 10, "w": 6, "mins": 48 },
        "logic":  { "q": 20, "att": 14, "c": 11, "w": 3, "mins": 32 }
      }
    }
  ],
  "questions": [
    {
      "mock_id": "P12",
      "section": "verbal",
      "item": "Passage 3",
      "topic": "Inference",
      "diff": "M",
      "seconds": 468,
      "outcome": "wrong",
      "tag": "concept"
    }
  ]
}
```

Aliases already accepted in `applyStudent`: `tests` for mocks; `mock_id`, `taken_on`, `difficulty`, `time_min`, `questions_total`, `attempted`, `correct`, `wrong`, `score`, `standing`, `report_url`.

`tag` is one of: `slip`, `concept`, `time`, `selection`.
`outcome` is one of: `correct`, `wrong`, `left`.
`diff` is `E`, `M`, or `H`.

## Formulas

- Accuracy = correct / attempted. Never correct / total.
- Attempt rate = attempted / total. Healthy band 70–80% with accuracy at least 75%.
- Net = exam marking if sent, else `3*correct - 1*wrong`.
- Minutes per correct = minutes / correct. Main efficiency number.
- Efficiency = net / minutes.
- Unattempted = total − attempted. Not a failure.
- Difficulty-adjusted net: easy × 0.92, medium × 1, hard × 1.08.
- Predicted standing = trend of the last 6 adjusted scores, shown as a band.
- Marks to target = gap from latest net (or standing) to `student.target_standing`, shown as a range.
- Mistake mix = share of slip / concept / time / selection on the last 8 mocks.
- Time leak = minutes on wrong or abandoned items.
- Consistency = standard deviation of the last 6 nets. Flag if over 10.
- Do not tell the student to attempt more if accuracy is under 70%.

Summary headline, first matching rule wins:

1. Easy items wrong.
2. High time on wrong answers.
3. A section under 70% accuracy and over 75% attempt (over-attempting).
4. A section over 80% accuracy and under 70% attempt (under-attempting).
5. Abandoned Logic sets over 6 minutes.
6. Adjusted score flat for 4 or more mocks.
7. Last-6 net standard deviation over 10.

Headline shape: “You are accurate enough to clear a high target. {Section} selection — not {other section} — is the ceiling.” If accuracy is the real problem, say that instead of selection.

Change tab must be doable this week: mock count, drills, 3 to 5 rules, and do-not lines. No generic study plan.

Default rules already in the UI, keep unless data says otherwise:

- 6-minute cap per Verbal passage.
- Short Verbal only if two options die in 90 seconds.
- Logic: 90-second take-or-leave. Never a third open set.
- Leave any unsolved item at 3 minutes.

## What is live today vs still demo

Live after SB load: student name, initials, exam line, Open SB link, mock-log rows.

Still hardcoded demo, and must be computed from `mocks` + `sections` + `questions`: every other number, sentence, chart, and table on all six tabs.

## 85 slots the coder must fill

If the field is missing, hide the slot. Do not keep the sample text.

### Chrome — 15

1. Brand “Pulse”
2. Initials
3. Student name
4. Exam + days out
5–10. Tabs: Summary, Progress, Benchmark, Strategy, Mistakes, Change
11. Student id / SB link box
12. Load
13. Demo
14. Status line
15. Open SB link

### Summary — 26

16. Question: Where do I stand, right now?
17. Bottleneck label
18. Headline
19. Supporting paragraph
20. Button: What to change next test
21. Button: Open strategy
22. Predicted standing
23. Latest mock
24. Best
25. Target
26. Gap callout
27. Mocks taken
28. Net (latest)
29. Accuracy
30. Attempt rate
31. Minutes per correct
32. Consistency
33. Quant card
34. Verbal card
35. Logic card
36. Funnel chart: available, attempted, correct, wrong, left
37. Hold
38. Fix
39. Take
40. Stop

Each section card has six fields: accuracy, attempted/total, minutes per correct, trend, one-word status, one-line hint.

### Progress — 5

41. Question: Am I actually improving?
42. Score chart: net, difficulty-adjusted net, standing
43. Accuracy vs attempt chart
44. What moved the score: more attempts, higher accuracy, fewer negatives, better selection, time saved
45. Mock log, 12 columns: Mock, Date, Diff, Time, Att, C/W, Acc, Net, Standing, Min/C, Eff, SB

### Benchmark — 11

46. Question: How far am I from the target?
47. Target standing
48. Predicted
49. Marks to close
50. Section floors
51. Vs last 4 average
52. Ready signal
53. Radar, six spokes: accuracy, attempt rate, time efficiency, consistency, difficulty-adjusted accuracy, selection. Two series: student and target band.
54. Cockpit table, six rows × Quant, Verbal, Logic, Healthy: attempt rate, accuracy, net, min/correct, negatives, difficulty-adjusted accuracy
55. Cockpit callout
56. Minutes-per-correct chart: Quant, Verbal, Logic vs band

### Strategy — 11

57. Question: Attempt more, or protect accuracy?
58. Time per question
59. Time per correct
60. Time per wrong
61. Sunk time on skips
62. Pacing score 0–100
63. Marks per minute
64. Time–accuracy scatter (one point per mock, size = difficulty)
65. Section radar, same six spokes, one shape per section
66. Leak table, 7 columns: Mock, Section, Item, Time, Outcome, Leak, Rule
67. Callout: do not raise attempts if accuracy falls under 70%

### Mistakes — 10

68. Question: Careless, or a concept gap?
69. Wrongs per mock
70. Slips %
71. Concept %
72. Time pressure %
73. Bad selection %
74. Repeat streak
75. Mix chart: slip, concept, time pressure, bad selection
76. Accuracy by difficulty: Easy, Medium, Hard × Quant, Verbal, Logic
77. Repeat log, 6 columns: Pattern, Section, Type, Times, Last seen, Fix

### Change — 7

78. Question: What do I do differently in the next test?
79. Headline + paragraph (one bottleneck, one time box)
80. 14-day load (5 rows in the demo: full mocks, verbal sets, logic drills, quant sprints, mistake review)
81. New rules (5)
82. Success criteria (5 before → after)
83. Do not (4)
84. Marks you can buy (5 rows: move, expected change, effort)

Row counts on 80–84 follow the data. The demo counts are the minimum shape, not a fixed list.

### Charts — 10 (already inside the slots above)

funnelChart, trajChart, accAttChart, decompChart, benchChart, mpcChart, scatterChart, balanceChart, mistakeChart, diffChart.

Today `draw()` runs once on demo arrays. After SB load, destroy and redraw every chart from the new payload. `fillVault()` already refreshes. Nothing else does.

## WordPress

Do not paste the page into a Custom HTML block. WordPress strips scripts.

```html
<iframe
  src="https://YOUR-SITE/wp-content/uploads/pulse/pulse.html?sb=STUDENT_ID"
  title="Pulse"
  style="width:100%;height:100dvh;min-height:720px;border:0;display:block;background:#f3f1ec;">
</iframe>
```

## Do not

- Do not add a seventh tab.
- Do not rank the student against other students.
- Do not say “attempt more” when accuracy is under 70%.
- Do not call demo copy live.
- Do not invent a number when a field is missing. Hide that slot.
