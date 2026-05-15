# Deployment Strategy

## Overview

The project uses **Vercel** for deployments connected to the GitHub repository `jmvelasco/monster-high`.

## Environments

| URL | Branch | Purpose |
|-----|--------|---------|
| `monster-high-lake.vercel.app` | `main` | Production |
| `monster-high-refactor.vercel.app` | `refactor/frontend-hexagonal` | Frontend hexagonal refactor preview |

## Branch Strategy

- **`main`**: Production branch. Only merge the winning version here.
- **`development`**: Original frontend implementation. Preserved as reference for comparison.
- **`refactor/frontend-hexagonal`**: Hexagonal architecture refactor of the frontend. Deployed to its own Vercel URL.

### Decision rule

Both `development` and `refactor/frontend-hexagonal` contain alternative implementations of the frontend. Only one should be merged into `main`. Never merge both — this avoids conflicts.

## Snapshot Tags

Tags created on 2026-05-15 to preserve the state of each branch before any merge decision:

| Tag | Commit | Branch |
|-----|--------|--------|
| `snapshot/development-2026-05-15` | `e134cf0` | `development` |
| `snapshot/refactor-hexagonal-2026-05-15` | `12a7561` | `refactor/frontend-hexagonal` |

### Recovering a snapshot

```bash
# View the state at that point
git show snapshot/development-2026-05-15

# Create a branch from a snapshot
git checkout -b recover/development snapshot/development-2026-05-15

# Compare snapshots
git diff snapshot/development-2026-05-15..snapshot/refactor-hexagonal-2026-05-15
```

## Vercel Configuration

- Production branch: `main`
- Branch deployment: `refactor/frontend-hexagonal` → `monster-high-refactor.vercel.app`
- Every push to `refactor/frontend-hexagonal` automatically updates the refactor URL.
