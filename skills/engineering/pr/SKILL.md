---
name: pr
description: Write or update pull request titles and descriptions with clear summaries, evidence, and merge risks.
---

# Pull Requests

Read the final diff and any repository PR template before writing. Describe the
complete change, including its purpose and resulting behavior. Use domain terms
from `GLOSSARY.md` when available. Keep small PRs brief and scale detail to the
change.

## Title

Use a Conventional Commits title:

```text
<type>(<optional-scope>): <summary>
```

- Choose the type that describes the main change: `feat` for new behavior, `fix`
  for a bug fix, `refactor` for restructuring without behavior changes, `docs` for
  documentation, `test` for tests, or `chore` for maintenance.
- Add a scope only when it identifies a useful area, such as `auth` or `scheduler`.
- Write a specific, imperative summary: say what the change does. Use lowercase
  after the colon and omit a trailing period. Aim for 72 characters or fewer.
- Add `!` before the colon only for a breaking change and explain the required
  migration in the body.
- When scope changes during implementation, rewrite the title around the final
  diff. Avoid vague titles such as `fix: address feedback`.

Examples:

```text
feat(scheduler): allow rescheduling pending talks
fix(auth): reject expired verification codes
docs: explain skill installation
feat(api)!: require circuit identifiers for speaker requests
```

## Body

Follow the repository's PR template when present. Otherwise use these sections:

```markdown
## Summary

Explain the problem and resulting behavior. Include a concrete before/after
example when useful.

## Evidence

- Record the checks actually run and their results.
- State any relevant checks that were not run and why.

## Merge Danger

Describe affected users or systems, likely regressions, and rollback difficulty.
Mention migrations or operational steps when required.
```

Prefer short prose or a few bullets. Add a screenshot, diagram, or diff only when
it clarifies the change. Distinguish local checks from deployment or production
verification; never claim evidence you do not have. Remove template instructions
and placeholders before submitting.
