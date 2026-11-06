Review this UI as an independent senior product designer. Be honest and base
everything on evidence. Read only the files below: don't open other folders,
don't edit or run anything, no browser.

Inputs:

- {SHOTS}/index.md: every screenshot with viewport, state and pixel scale, plus
  the measurement files.
- {SHOTS}/*.png: screenshots. Detail crops show text at its real size.
- {SHOTS}/axe-_.json (accessibility checks), fonts-_.json (font sizes),
  a11y-*.txt (accessibility tree).
- {SCRATCH}/standards.md: design standards.
- {SCRATCH}/decisions.md: intended design and declined suggestions.
- {SCRATCH}/criteria.md: scoring criteria and severity.
- (Not in the first review.) {SCRATCH}/previous-review.md: previous issues and
  pattern inventory.
- (Not in the first review.) {COMPARE}/index.md and its PNGs: before/after
  pairs.

Steps:

1. (Not in the first review.) Mark each previous issue Fixed, Partly fixed or
   Open, with the files you checked.
2. Pattern inventory: list the variants of each pattern and where they appear.
   Flag any job done by two patterns.
3. Score Hierarchy, Spacing, Typography, Consistency, Accessibility and
   Responsiveness from 1 to 10 using criteria.md.
4. For each score below 9, list the missing 9 items, each linked to an issue ID.
5. List new issues. Skip anything in decisions.md.

Output:

1. Previous issues: | ID | Status | Files checked | Note |
2. Pattern inventory: one line per pattern.
3. Scores: | Category | Score | Observation (files) |
4. Missing for 9: | Category | Missing item | Issue ID |
5. New issues: | ID (N1, N2…) | Severity | Category | Files | Element |
   Problem | Why it matters | Fix |
6. Could not judge: what, and which view or state would show it.
