# aifactory gate canary

The canary for the [itm8 AI Factory gate](https://github.com/itm8-public/aifactory-gate). A gate
release reaches the customers' `@v0` only after real GitHub workflow runs of `@v0-next` in this
repository give the expected verdict for each known case.

**Everything here is synthetic.** There is no real code, data or credential. The planted secret on
`canary/secret` is a fake key written for this canary.

## The cases

Each case is a branch with one commit on top of `main`, and an open **draft** pull request into
`main`. The pull requests are never merged.

| Branch                     | Change                                     | Expected verdict                                     |
| -------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| `canary/pass`              | A clean app-code change with a test        | `pass`                                               |
| `canary/secret`            | A planted fake private key                 | `fail` (a possible secret)                           |
| `canary/platform`          | An infrastructure file (`infra/main.bicep`) | `needs-person` (CI, deployment or infrastructure)    |
| `canary/ai-values-missing` | A clean change; the AI review on, values empty | `needs-person` (the AI review values are missing) |
| `canary/ai-review`         | A clean change; the AI review fully on     | `pass` with the "In plain words" explanation (only when this repository's AI review variables are set) |

The caller is [`.github/workflows/aifactory-gate.yml`](.github/workflows/aifactory-gate.yml). It
calls `gate.yml@v0-next` on zone green, level 2, and turns the AI review on by branch name.

## How it runs

A gate maintainer runs `node scripts/canary.mjs` from a clone of the gate repository, signed in
with the GitHub CLI. It pushes an empty commit to each case branch (a push by a person starts the
workflow; one made with the workflow token would not), waits for the runs, checks the verdict, the
`gate / verdict` check and the gate commit each run used, and records the result as the commit
status `aifactory/canary` on that gate commit. `@v0` moves only after a green canary on the same
commit. See the gate's README, Release.

Do not merge the pull requests or delete the branches. To change a case, open a pull request in
the gate repository for `scripts/canary.mjs` and change the branch here to match.
