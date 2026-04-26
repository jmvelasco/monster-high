# ADR 002: Shared Agent Guidance with Local Antigravity Bootstrap

**Status**: Accepted  
**Date**: 2026-04-18  
**Decision Makers**: Development Team  
**Related**: [ADR-001: Monorepo Structure](001-monorepo-structure.md)

---

## Context

El proyecto se trabaja desde varios entornos:

- VS Code con GitHub Copilot
- Antigravity en otra maquina

Ambos necesitan instrucciones operativas para trabajar con el repositorio, pero no necesariamente consumen la misma estructura de archivos.

La estrategia anterior basada en symlinks hacia `.agents/rules/` ya no representa bien el estado real del proyecto:

- los archivos locales de Antigravity no viven en este workspace de forma estable
- `.agents/` se trata como configuracion local y no como parte del repo
- los symlinks introducen fragilidad innecesaria entre maquinas, shells y sistemas operativos

El objetivo sigue siendo evitar reglas duplicadas como fuente de verdad compartida.

---

## Decision

Adoptamos el siguiente modelo:

1. `.github/` es la fuente de verdad versionada para las instrucciones compartidas de agentes.
2. Las adaptaciones especificas para Antigravity se generan localmente cuando hagan falta.
3. La generacion local se hace mediante un script de bootstrap versionado en `scripts/setup-antigravity-local.sh`.
4. Los archivos generados en `.agents/` permanecen fuera de Git.

---

## Canonical Sources

La guia compartida y versionada vive en:

- `.github/copilot-instructions.md`
- `.github/instructions/`
- `.agents/skills/`

Estas rutas forman el contrato estable del repositorio para asistentes de codigo.

---

## Local Antigravity Materialization

Cuando una maquina necesite una estructura local para Antigravity, se ejecuta:

```bash
sh scripts/setup-antigravity-local.sh
```

El script crea una copia local en `.agents/rules/` a partir de las fuentes versionadas en `.github/`.

Esto permite:

- mantener una sola fuente de verdad versionada
- evitar symlinks entre rutas locales
- regenerar el estado local cuando cambien las instrucciones

---

## Consequences

### Positivas

1. La documentacion compartida queda centralizada en rutas versionadas y visibles.
2. El repo deja de depender de symlinks para representar setups locales.
3. La configuracion de Antigravity pasa a ser reproducible por script.
4. La estrategia funciona mejor entre equipos, ordenadores y sistemas operativos distintos.

### Negativas

1. Antigravity consume una copia local, no la fuente directamente.
2. Tras cambios en `.github/`, hay que regenerar el material local si esa maquina usa Antigravity.

---

## Alternatives Considered

### Opcion A: Mantener symlinks

Rechazada porque acopla demasiado el repo a una topologia local concreta y no representa el uso real actual.

### Opcion B: Duplicacion manual fuera del repo

Rechazada porque facilita desincronizacion silenciosa entre maquinas.

### Opcion C: Bootstrap local desde fuente versionada

Elegida porque mantiene una sola fuente de verdad dentro del repo y mueve la adaptacion especifica a un paso local explicito.

---

## Operational Notes

- `.agents/` se considera espacio local de herramientas y permanece ignorado por Git.
- VS Code puede invocar el bootstrap mediante la task `Prepare Antigravity Local Rules`.
- Si Antigravity cambia su formato esperado en el futuro, se actualiza el script, no la estrategia general.

---

## References

- [ADR-001: Monorepo Structure](001-monorepo-structure.md)
- [Copilot Instructions](../../.github/copilot-instructions.md)
- [VS Code Tasks](../../.vscode/tasks.json)