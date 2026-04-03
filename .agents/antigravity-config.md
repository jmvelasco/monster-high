# Antigravity AI Configuration

## ⚙️ Terminal Configuration

**IMPORTANT**: Ensure Antigravity is configured to use **Git Bash** as the default terminal.

### Why Git Bash?

- ✅ Unix-like environment in Windows
- ✅ Supports symlinks natively
- ✅ Compatible with Mac/Linux commands
- ✅ Required for `.agent/rules/` symlinks to work

### How to Verify Git Bash is Active

In Antigravity terminal, run:

```bash
echo $SHELL
```

**Expected output**: `/usr/bin/bash` or `/bin/bash`

If you see something else (e.g., `powershell`, `cmd`), configure Antigravity to use Git Bash.

---

## 📁 Project Structure

This project uses **symlinks** to maintain a single source of truth:

```
docs/development-rules/     ← SOURCE OF TRUTH (edit here)
├── xp-methodology.md
├── tdd.md
├── coding-standards.md
└── testing-standards.md

.agent/rules/               ← Symlinks (DO NOT edit directly)
├── xp-programming.md       → ../../docs/development-rules/xp-methodology.md
├── tdd.md                  → ../../docs/development-rules/tdd.md
├── coding-standards.md     → ../../docs/development-rules/coding-standards.md
└── testing.md              → ../../docs/development-rules/testing-standards.md
```

**Rule**: Always edit files in `docs/development-rules/`, changes will reflect in `.agent/rules/` automatically.

---

## 🎯 Context Files for AI Agent

### Core XP Methodology (Always Active)

- `.agent/rules/xp-programming.md` (→ docs/development-rules/xp-methodology.md)
- `.agent/rules/tdd.md` (→ docs/development-rules/tdd.md)
- `.agent/rules/coding-standards.md` (→ docs/development-rules/coding-standards.md)
- `.agent/rules/testing.md` (→ docs/development-rules/testing-standards.md)

### Backend Development (when editing `apps/backend/**/*.ts`)

- `.github/skills/backend-hexagonal/SKILL.md`
- Hexagonal Architecture principles
- Domain-driven design
- Zero dependencies in domain layer

### Frontend Development (when editing `apps/web/**/*.tsx`)

- `.github/skills/react-best-practices/SKILL.md`
- 45 React best practices
- TDD with React Testing Library + Vitest
- YAGNI for performance optimizations

### Global rules live in ~/.gemini/GEMINI.md

- `./gemini.md`

---

## 🔍 Troubleshooting Symlinks

### Symlinks not working?

**Verify Git Bash is active**:

```bash
echo $SHELL
# Expected: /usr/bin/bash or /bin/bash
```

**Re-create symlinks**:

```bash
cd .agent/rules
rm -f *.md
ln -s ../../docs/development-rules/xp-methodology.md xp-programming.md
ln -s ../../docs/development-rules/tdd.md tdd.md
ln -s ../../docs/development-rules/coding-standards.md coding-standards.md
ln -s ../../docs/development-rules/testing-standards.md testing.md
```

**Verify symlinks**:

```bash
ls -la .agent/rules/
# Should show: filename -> ../../docs/...
```

---

## 🚀 Quick Start for AI Agent

When Antigravity starts:

1. ✅ Verify Git Bash is active (`echo $SHELL`)
2. ✅ Symlinks in `.agent/rules/` resolve correctly
3. ✅ Agent can access XP methodology, TDD, coding standards
4. ✅ Context-aware skills activate based on file location (backend vs frontend)
