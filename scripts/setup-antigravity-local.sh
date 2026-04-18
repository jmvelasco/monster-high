#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
TARGET_DIR="$ROOT_DIR/.agents/rules"

mkdir -p "$TARGET_DIR"

cp "$ROOT_DIR/.github/copilot-instructions.md" "$TARGET_DIR/00-copilot-instructions.md"
cp "$ROOT_DIR/.github/instructions/commit-strategy.instructions.md" "$TARGET_DIR/10-commit-strategy.instructions.md"
cp "$ROOT_DIR/.github/instructions/tdd-workflow.instructions.md" "$TARGET_DIR/20-tdd-workflow.instructions.md"
cp "$ROOT_DIR/.github/instructions/react-optimization.instructions.md" "$TARGET_DIR/30-react-optimization.instructions.md"

cat > "$ROOT_DIR/.agents/README.md" <<'EOF'
# Local Antigravity Files

This directory contains agent configuration for the repository.

- `skills/` — versioned agent skills (committed to Git)
- `rules/` — generated locally from `.github/` sources (ignored by Git)

Regenerate rules with `sh scripts/setup-antigravity-local.sh`

Do not edit generated files in `.agents/rules/` by hand unless you intentionally want machine-local divergence.

Source of truth:
  - `.github/copilot-instructions.md`
  - `.github/instructions/`
EOF

printf '%s\n' "Prepared local Antigravity rules in .agents/rules/"