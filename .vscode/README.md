# VSCode Setup - Monster High

Configuración optimizada para desarrollo con metodología XP/TDD en VSCode.

---

## 📋 Tasks Disponibles

Este proyecto incluye tasks configuradas en [tasks.json](tasks.json) para facilitar el workflow TDD.

### 🔴🟢🔵 TDD Workflow

#### **TDD: Watch Mode (Backend)** ⭐ (Default)
- **Comando**: `npm run test:watch --workspace=apps/backend`
- **Uso**: `Cmd+Shift+B` (Mac) / `Ctrl+Shift+B` (Windows)
- **Descripción**: Ejecuta tests automáticamente al guardar archivos
- **Background**: Sí (corre en segundo plano)
- **Problem Matcher**: Jest (errores clickeables)

#### **TDD: Red/Green/Refactor Phases**
- **Uso**: `Cmd+Shift+P` → "Tasks: Run Task" → Seleccionar fase
- **Descripción**: Recordatorios visuales del ciclo TDD
  - 🔴 RED: Write failing test
  - 🟢 GREEN: Make test pass
  - 🔵 REFACTOR: Improve code

---

### ✅ Validación y Testing

#### **Run All Tests**
- **Comando**: `npm test --workspaces`
- **Descripción**: Ejecuta tests de todos los workspaces (backend)
- **Uso**: Para validación completa antes de commits

#### **Compile Check**
- **Comando**: `npm run compile`
- **Descripción**: Verifica que TypeScript compila sin errores en todos los workspaces
- **Problem Matcher**: TypeScript

#### **Full Validation** ⭐ (Default Build)
- **Comando**: `npm run validate`
- **Descripción**: Ejecuta compile + lint + test
- **Uso**: Antes de hacer commits o abrir PRs
- **Problem Matcher**: TypeScript + ESLint

---

### 🛠️ Desarrollo

#### **Backend: Watch Compile**
- **Comando**: `npm run compile:watch --workspace=apps/backend`
- **Descripción**: TypeScript watch mode (compilación incremental)
- **Background**: Sí
- **Uso**: Para desarrollo con feedback inmediato de tipos

---

### 🔗 Multi-IDE

#### **Validate Symlinks**
- **Comando**: `ls -la .agent/rules/`
- **Descripción**: Verifica que los symlinks de configuración multi-IDE funcionen
- **Uso**: Después de clonar el repo o actualizar configuración
- **Contexto**: Ver [ADR-002](../docs/adr/002-multi-ide-configuration.md)

---

## ⌨️ Atajos de Teclado

### Ejecutar Tasks

| Atajo | Acción | Task Ejecutada |
|-------|--------|---------------|
| `Cmd+Shift+B` (Mac)<br>`Ctrl+Shift+B` (Win) | Build por defecto | **TDD: Watch Mode (Backend)** |
| `Cmd+Shift+P` → "Tasks: Run Task" | Menú de tasks | Elegir cualquier task |
| `Cmd+Shift+P` → "Tasks: Run Build Task" | Build tasks | Full Validation |

### Testing Integrado

VSCode tiene soporte nativo para tests con la extensión Jest:

- Tests aparecen en el panel lateral (beaker icon 🧪)
- Click derecho en test → "Run Test" / "Debug Test"
- Ver configuración en [settings.json](settings.json)

---

## ⚙️ Settings Configurados

El archivo [settings.json](settings.json) incluye:

### Testing
- `jest.runMode: "watch"` - Jest corre automáticamente
- `testing.automaticallyOpenPeekView` - Muestra errores inline
- `testing.followRunningTest` - Sigue el test en ejecución

### Code Quality
- Auto-fix ESLint al guardar
- Auto-organizar imports al guardar
- Rulers en columnas 80 y 120

### TypeScript
- Deshabilitado auto-imports de package.json (evita imports incorrectos)

---

## 🚀 Quick Start para Desarrollo TDD

1. **Abrir VSCode** en la raíz del monorepo
2. **Iniciar Watch Mode**: `Cmd+Shift+B`
3. **Editar test**: Los tests corren automáticamente al guardar
4. **Ver errores**: Click en errores en el panel de problemas

### Workflow Recomendado

```bash
# Terminal 1: Tests en watch mode
Cmd+Shift+B → "TDD: Watch Mode (Backend)"

# Terminal 2 (opcional): TypeScript watch
Cmd+Shift+P → "Tasks: Run Task" → "Backend: Watch Compile"

# Editar código
# Guardar → tests corren automáticamente
# Ver feedback inmediato
```

---

## 📚 Referencias

- [TDD Methodology](../docs/development-rules/tdd.md) - Ciclo Red-Green-Refactor
- [XP Methodology](../docs/development-rules/xp-methodology.md) - Extreme Programming
- [ADR-002](../docs/adr/002-multi-ide-configuration.md) - Multi-IDE Configuration
- [Tasks JSON Schema](https://code.visualstudio.com/docs/editor/tasks-schema)
