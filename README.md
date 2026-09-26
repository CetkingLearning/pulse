# Pulse 0.2 — dashboard interface

Student mock analytics in one page: `pulse.html`. No runtime build step.

Dark blue `#0b1f3a`, orange `#e25b12`, six tabs: Summary, Progress, Benchmark, Strategy, Mistakes and Change.

## Preview

Open `pulse.html` in a browser. It starts with an empty student dashboard. Select **View demo** to explore all six tabs and ten charts, or open `pulse.html?demo=1`. **Exit demo** restores the supplied student view, or the empty dashboard if no results were supplied.

Demo values and recommendations are fictional examples, not a prediction service. Chart.js and fonts load from external CDNs; chart data remains readable if Chart.js cannot load.

## What is finished

- Complete six-tab interface, all named cards and tables, ten chart designs and required nested fields.
- Explicit demo mode and honest empty states in every tab.
- Missing values hide; valid zero stays visible; no demo fallback in student mode.
- Fresh chart instances per render, safe text/link rendering and complete table headers.
- All table columns accessible through horizontal scrolling on phones.
- Keyboard-accessible tabs, focus styles, chart labels and a skip link.
- One view-model rendering boundary for the later data adapter.

The requested checklist states 85 top-level slots but explicitly names 84 (Summary lists 25 instead of 26). All named locations are retained; no extra feature was invented to make the count match.

## Next: TCY data

TCY has **not** been connected in this version. Connection tools are intentionally disabled; the old guessed endpoints, `sb_base` override and automatic `?sb=` fetching have been removed. `Open SB` appears only for a supplied valid profile URL.

Read `PULSE-LIVE-MEMORY.md` for the current renderer contract and integration requirements. Authentication, validated raw-result mapping, metric definitions, entitlements and server-side TCY credentials belong to the next step.

## Verification

Run `npm ci` then `npm test` (Node.js 20 or later). Six regression checks cover empty/demo/student transitions, missing values and valid zero, table structure, keyboard navigation, chart cleanup, text/URL safety and chart-library failure.

Chromium checks at 1440px desktop and 390px mobile verified all six views, ten Chart.js instances, no horizontal page overflow and no JavaScript errors. For this check, the pinned Chart.js 4.4.3 package was supplied locally in place of the blocked CDN request. The no-CDN fallback was checked separately. Screenshots were visually inspected for the desktop Summary and mobile Strategy views.

This is a dashboard-interface update, not a hosted deployment or a live-data release. The original v0.1 tag remains unchanged.
