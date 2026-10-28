# Skills

Skills live in `skills/<category>/<skill-name>/SKILL.md`.

## Install skills

Use the [skills CLI](https://github.com/vercel-labs/skills) from the project where
you want to install skills.

```sh
# List available skills
npx skills add jeshuaedgar/skills --list

# Choose skills and agents interactively
npx skills add jeshuaedgar/skills

# Install one skill for Codex in the current project
npx skills add jeshuaedgar/skills --skill pr --agent codex
```

Add `--global` to install for your user instead of the current project:

```sh
npx skills add jeshuaedgar/skills --skill pr --global
```

## Create a skill

Requires Python 3.9 or newer on macOS or Linux. No packages to install.

```sh
git clone https://github.com/jeshuaedgar/skills.git
cd skills
./skill new
```

Create your category folders directly under `skills/`, for example
`mkdir -p skills/engineering skills/writing`. The CLI prompts for a skill name,
lets you choose a category, then asks for a description. It reads only the immediate
category folders each run, without scanning their subfolders, and creates
`skills/<category>/<skill-name>/SKILL.md`.
