---
name: ui-polish
description: Improve an existing UI through browser screenshots, live-page measurements and iterative independent review. Use when polishing or critiquing a frontend page, a section, or a whole product.
---

# UI Polish

## Rules

- Follow the project's design standards (`AGENTS.md`, `docs/`, specs), or
  existing conventions if there are none.
- Keep intended behavior, except accessibility fixes.
- Use shadcn components with existing variants and props; add missing components
  with the shadcn MCP or CLI. Never edit `components/ui` or create wrappers.
- Put a missing reusable variant where the standards say, or else in a shared
  `cva`/`tailwind-variants` file named by purpose (`statusBadge`, not
  `greenBadge`). Report one-off needs as gaps.
- Propose domain wording changes (e.g. "filtered" to "excluded") in the report;
  never make them.
- Keep evidence in the system temp folder; never commit it.

## Browser

Find tools by name in the session's tool list; never hardcode a namespace. Use
the first available: the **T3 Code browser** (`preview_*`; open your own tab
with `reuseExistingTab: false` and pass its `tabId`), **Playwright** CLI or MCP,
or **Chrome DevTools MCP**. If none, stop and report.

Running this skill counts as a request for browser work, including checking your
fixes. Only touch tabs you opened, and close them at the end.

## Setup

- Scope: the page named in the request (default), or a representative set of
  routes when asked for a section or product (all light, key pages dark).
- Find or start the dev server.
- Ask once, only if something can't be inferred: numbered questions with
  defaults. Mention optional score thresholds only there.
- Make `<temp>/ui-polish/` and fill it from `templates/`: `standards.md` (the
  standards without the product name), `criteria.md` (adjust once, then freeze),
  `decisions.md`, `capture-list.md`. Add `ledger.md` for yourself: issues with
  severity, status and attempts, and blind and revised scores per round.

## Process

A round is one capture and one review; round 1 is the UI as found. After each
review, check the exit rules; otherwise fix and start the next round.

### 1. Capture

Save each round to a fresh `shots-<hex>/` (never a round number), with the same
file name (`a01.png`) for the same view every round. Capture every view in
`capture-list.md`.

- **Health check:** before each screenshot, run `scripts/health-check.js` with
  `MARKER` set. If `ok` is false, reload, then restart the dev server, then stop
  and report. Once per page per round, and after a failed check, read console
  errors and failed requests (T3 `preview_snapshot()` without image; Playwright
  `browser_console_messages`, `browser_network_requests`; DevTools
  `list_console_messages`, `list_network_requests`).
- **Screenshots:** blur focus unless capturing focus. For dark mode, set the
  colour scheme, check `<html>` has the `dark` class, or else use the app's
  theme toggle. Take crops as element screenshots; in T3, use
  `getBoundingClientRect()` and
  `node scripts/crop.mjs <in> <out> <x> <y> <w> <h> --viewport <css-width>`.
- **Measurements** per key page, light and dark: `axe-<view>.json`
  (`scripts/axe.js`), `fonts-<view>.json` (`scripts/font-sizes.js`) and
  `a11y-<view>.txt`, the tool's own accessibility tree (T3 `preview_snapshot`,
  Playwright `ariaSnapshot()`/`browser_snapshot`, DevTools `take_snapshot`).
- **Index:** `index.md` with one row per screenshot (file, page, theme,
  viewport, state, pixel scale, crop or full), the measurement files, and what
  couldn't be captured.
- **Comparison** (from round 2): `compare-<hex>/` with
  `<id>-before.png`/`<id>-after.png` for views tied to previous issues, and an
  `index.md` mapping pairs to issue IDs.

### 2. Review

Start **one fresh reviewer** with `templates/reviewer-brief.md`. Pass files
only: no source code, project name, round numbers, fix history or thresholds.

1. **Blind:** from round 2, include `previous-review.md` (all previous issues
   and the pattern inventory) and the comparison folder, but no scores.
2. **Reveal:** send `templates/score-reveal.md` with the previous revised scores
   to the same session (or, if the harness can't, to a fresh reviewer with the
   blind output).

Exit on the revised scores, averaged yourself. From round 2, fix new Medium or
Low issues only if they are regressions in changed views or in new views; defer
the rest.

### 3. Exit

In order:

- **User threshold**, if set, overrides the defaults.
- **Done:** average 9 or more, no category below 8.
- **Stop** on a blocker; on an average drop of 0.3 or a category drop of 1
  (first undo that round's taste changes, keeping accessibility and layout
  fixes); from round 3, on a gain under 0.3 with no open High or Medium issue.
  Report an issue still open after two real attempts as a gap.
- **Budget:** 3 fix rounds, so round 4 is the final review; then ask before each
  extra round.

### 4. Fix

- High, then Medium, then Low (severity in `criteria.md`); consistency issues
  and quick wins first within each. Check the [common pitfalls](#common-pitfalls).
- To decline an issue, add it with a reason to "Declined suggestions" in
  `decisions.md`. If the user rejects a fix on taste, revert and decline it, and
  strengthen non-visual cues (tooltips, accessible names, legends).
- Run format, lint, typecheck and tests; reload changed pages and rerun the
  health check and axe on them.

### 5. Report

Revised and blind scores per category per round and the overall change (e.g. 7.3
→ 8.6; scores are judgments, not measurements); fixes, added components, new
variants, declined suggestions, proposed wording, missing variants, deferred
issues and gaps; two to four before/after pairs; and the path to a final
screenshot folder with clear names (`jobs-light-1440.png`) and an `index.md`.

If the harness renders HTML (T3: `html_render`), make one self-contained page:
inline `<style>`, images as data URIs (prefer crops), no outer background, card,
border or side padding, theme variables only (`--foreground`, `--muted`,
`--card`, `--border`, `--success`, `--warning`, `--destructive`,
`--chart-1`…`--chart-6`, `--radius`), and no `vh` or `height: 100%` on
`html`/`body`. Check it with `html_preview` if available, render once, and keep
the reply short. Otherwise use Markdown.

## Common pitfalls

- Metric cards showing a bare count with no context.
- Icon-only controls without an accessible name or tooltip.
- Status shown by colour alone.
- Uppercase badges and jargon labels.
- Accessible names that don't contain the visible text (a "No" toggle named
  "Exclude plugin 1").
- Card titles that look like headings but aren't.
- Wide tables that squeeze at narrow widths instead of scrolling.
- Invalid nesting that breaks hydration (a `div` inside a `p`).
