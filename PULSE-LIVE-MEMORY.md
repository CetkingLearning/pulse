# Pulse — memory for making it live

Give this whole file to ChatGPT (or any builder) as the source of truth. Do not invent a new product. Wire this one to real student data.

## What Pulse is

Pulse is a student-facing mock analytics page for any MBA entrance exam. It is not a scorecard. It is a decision system: one bottleneck, time-costed marks, and a change the student can do before the next test.

File to ship: `pulse.html` (single HTML page, Chart.js 4 from jsDelivr, no build step).

Brand: **Pulse**. Do not say CAT in the UI. Sections stay **Quant, Verbal, Logic** so the same page works for any exam.

## Look

- Background `#f3f1ec`, cards `#fffcf7`, ink `#1a2332`.
- **Dark blue** `#0b1f3a` — header, Quant, net score. Not the old lighter blue `#2a6f97` / `#1c3d5a`.
- **Orange** `#e25b12` — buttons, positive deltas, Logic, adjusted-score line. Not the old green `#0f7a6c`.
- Amber `#c47b17` only for warnings. Coral `#c44536` for down / wrong. Verbal `#6b4c9a`.
- Fonts: IBM Plex Sans + IBM Plex Serif.
- Mobile first. Charts about 132px tall under 640px. Tables 10px, extra columns hidden until 900px.

## Six tabs (do not rename)

| Tab | Question it answers |
|---|---|
| Summary | Where do I stand, right now? One bottleneck. |
| Progress | Am I actually improving? |
| Benchmark | How far am I from the target? A standard, not a peer rank. |
| Strategy | Attempt more, or protect accuracy? |
| Mistakes | Careless, or a concept gap? |
| Change | What do I do differently in the next test? |

## JSON the page already accepts

`GET {sb_base}/api/students/{id}/pulse.json`

Open with `pulse.html?sb=STUDENT_ID` or `?sb_base=https://sb.cetking.in`.

Student fields: id, name, exam, days_out, target_standing, profile_url.
Each mock: id, date, diff (E/M/H), mins, q, att, c, w, net, pct, acc, mpc, sb_url, sections.quant/verbal/logic {q, att, c, w, mins}.
Optional questions[]: mock_id, section, item, topic, diff, seconds, outcome, tag (slip/concept/time/selection).

Aliases: tests, mock_id, taken_on, difficulty, time_min, questions_total, attempted, correct, wrong, score, standing, report_url.

## Formulas

- Accuracy = correct / attempted. Never correct / total.
- Attempt rate = attempted / total. Healthy band 70–80% with accuracy ≥ 75%.
- Net = exam marking if sent, else 3*correct − 1*wrong.
- Minutes per correct = minutes / correct.
- Difficulty-adjusted net: easy ×0.92, medium ×1, hard ×1.08.
- If a field is missing, hide the card. Do not invent a number.

## Still demo (must be computed from JSON)

Only the mock log and student name refill today. Summary, Progress, Benchmark, Strategy, Mistakes, and Change copy and charts are still sample numbers.

## Do not

- Do not add a seventh tab.
- Do not rank the student against classmates.
- Do not tell them to attempt more if accuracy is under 70%.
- WordPress: iframe `pulse.html`. Do not paste it into a Custom HTML block.
