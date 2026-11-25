# aifactory gate canary

The canary for the [itm8 AI Factory gate](https://github.com/itm8-public/aifactory-gate). A gate
release reaches the customers' `@v0` only after real GitHub workflow runs of `@v0-next` in this
repository give the expected verdict for each known case.

**Everything here is synthetic.** There is no real code, data or credential. The planted secret on
`canary/secret` is a fake key written for this canary.

## The cases

Each case is a branch with one commit on top of `main`, and an open **draft** pull request into
`main` (the legacy case goes into a base of its own, below). The pull requests are never merged.

| Branch                     | Change                                     | Expected verdict                                     |
| -------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| `canary/pass`              | A clean app-code change with a test        | `pass`                                               |
| `canary/secret`            | A planted fake private key                 | `fail` (a possible secret)                           |
| `canary/platform`          | An infrastructure file (`infra/main.bicep`) | `needs-person` (CI, deployment or infrastructure)    |
| `canary/ai-values-missing` | A clean change; the AI review on, values empty | `needs-person` (the AI review values are missing) |
| `canary/ai-review`         | A clean change; the AI review fully on     | `pass` with the "In plain words" explanation (only when this repository's AI review variables are set) |
| `canary/describes-review`  | A README section that explains the gate and the AI review; the AI review fully on | `pass`: describing the review is not steering it. Then its merge is pushed (below) |
| `canary-legacy/case`       | One README line, into `canary-legacy/base`; that base's caller grants only `contents: read` and `id-token: write` | `pass`, no comment, no gate job fails. Then its squash is pushed and must run in full (below) |

The caller is [`.github/workflows/aifactory-gate.yml`](.github/workflows/aifactory-gate.yml). It
calls `gate.yml@v0-next` on zone green, level 2, and turns the AI review on by branch name. It
grants `actions: read` (a push reuses a pull request's verdict) and `pull-requests: write` (the
gate's comment on the pull request).

**The legacy caller.** `canary-legacy/base` holds a caller that grants only what the customer
template granted before gate 0.5.0 (`contents: read`, `id-token: write`), as callers that predate
it still do. GitHub does not start a called workflow whose job asks for more than the caller
grants, so this case fails as soon as a gate release asks for a permission those callers lack. Its
pull request goes into `canary-legacy/base`, so the change it judges is one README line, not the
caller. After its run, the canary pushes a squash of it to `canary-push/legacy`: one commit with
the tree the run judged, on its base. No pull request leads to that commit, so its push run must
run in full and pass. That is how every push of such a caller runs in a private repository, where
it cannot read the pull request run. A merge commit would not show it here: this repository is
public, so the gate reads its runs with any token and reuses the verdict even without
`actions: read`. To change the legacy caller, commit to `canary-legacy/base` and merge it into
`canary-legacy/case`.

**The push of a merge.** After the `canary/describes-review` run, the canary pushes a merge commit
of that pull request (the tree the run judged, on the base it judged it against) to
`canary-push/describes-review`, as a merge to `main` would push it. That push run must reuse the
pull request run's verdict instead of running again. The `canary-push/` branches are written by the
canary only and moved with force on every run.

## How it runs

A gate maintainer runs `node scripts/canary.mjs` from a clone of the gate repository, signed in
with the GitHub CLI. It pushes an empty commit to each case branch (a push by a person starts the
workflow; one made with the workflow token would not), waits for the runs, checks the verdict, the
`gate / verdict` check, the gate commit each run used and the gate's comment on the pull request, and records the result as the commit
status `aifactory/canary` on that gate commit. `@v0` moves only after a green canary on the same
commit. See the gate's README, Release.

Do not merge the pull requests or delete the branches. To change a case, open a pull request in
the gate repository for `scripts/canary.mjs` and change the branch here to match.
