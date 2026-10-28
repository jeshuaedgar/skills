---
name: cleanup-code
description: When the user asks to clean up dead code, unused dependencies, duplication, and complexity; use Knip and Fallow together for JavaScript and TypeScript projects.
---

# Cleanup Code

Preserve behavior and public APIs. Use Knip for unused files, exports, and
dependencies; use Fallow to cross-check dead code and find duplication and
complexity hotspots. Investigate disagreements before deleting anything.

1. **Discover.** Read repository instructions and Git status. Inspect manifests,
   lockfiles, workspace packages, framework configs, and scripts to identify the
   package manager, frameworks, test runners, and runtime entry points. Preserve
   existing work; use native tooling outside JavaScript/TypeScript.
2. **Install.** Add `knip` and `fallow` as devDependencies with the repository's
   package manager at the
   appropriate workspace scope. Reuse compatible versions, satisfy Knip's peer
   requirements, and update only the matching lockfile. Run installed local CLIs.
3. **Generate.** Preserve existing configs. For missing configs, run Knip's
   `@knip/config` generator using the repository's package manager.
   Run local `fallow init` for `.fallowrc.json`
   (`--toml` for `fallow.toml`). Review generated configs, manifest changes, and
   Fallow's `.gitignore` addition. Do not install hooks or agent integrations.
4. **Configure frameworks.** Both tools have built-in, auto-detected plugins.
   Verify coverage separately using Knip `--debug` and Fallow `list` / `doctor`.
   Configure documented plugins for the detected stack; built-ins need no extra
   packages. Check routes, convention-based exports, dynamic loading, workers,
   and workspace boundaries. Add narrowly scoped entries or exclusions where
   needed. Never invent plugin packages, flags, or config keys: check installed
   `--help`, schemas, and the official sources below before using them.
5. **Clean.** Run Knip and Fallow `dead-code`, `dupes`, and `health`. Confirm
   candidates against references, side effects, runtime registration, and external
   consumers. Fix configuration gaps before trusting reports. Remove confirmed
   waste in small changes; remove dependencies through the package manager.
   Consolidate duplication only when behavior belongs together. Review automatic
   fixes before applying; never hide findings with broad suppressions.
6. **Verify.** Rerun both tools and relevant existing typecheck, lint, tests, and
   build checks. Review the diff and report changes, checks, remaining findings,
   and coverage gaps. Distinguish analysis errors from code findings.

Consult version-compatible official sources as needed:

- Knip: [setup/generator](https://knip.dev/overview/getting-started),
  [plugins](https://knip.dev/explanations/plugins).
- Fallow: [package/install](https://github.com/fallow-rs/fallow/blob/main/npm/fallow/README.md),
  [generator](https://fallow.tools/docs/cli/init/),
  [configuration](https://fallow.tools/docs/configuration/overview/),
  [framework diagnostics](https://fallow.tools/docs/analysis/debugging/).
