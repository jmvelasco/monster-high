# ADR 002: Multi-IDE Configuration with Symlinks

**Status**: Accepted  
**Date**: 2025-01-18  
**Decision Makers**: Development Team  
**Related**: [ADR-001: Monorepo Structure](001-monorepo-structure.md)

---

## Context

El proyecto Monster High se desarrolla usando múltiples IDEs:
- **VSCode** con GitHub Copilot (Mac/Linux/Windows)
- **Antigravity AI** (Windows con Git Bash)

Cada IDE tiene su propio sistema de configuración para agentes de IA:
- VSCode Copilot: `.github/copilot-instructions.md`
- Antigravity: `.agent/` folder

**Problema**: Tener las mismas reglas de desarrollo (XP, TDD, Coding Standards) duplicadas en múltiples ubicaciones causa:
- ❌ Desincronización de contenido
- ❌ Mantenimiento duplicado
- ❌ Confusión sobre qué archivo es la fuente de verdad

---

## Decision

Adoptamos una **arquitectura multi-IDE con fuente única de verdad usando symlinks**:

### Estructura:

```
docs/development-rules/     ← FUENTE ÚNICA DE VERDAD
├── xp-methodology.md
├── tdd.md
├── coding-standards.md
└── testing-standards.md

.github/
├── copilot-instructions.md  ← VSCode Copilot (referencia docs/*)
└── skills/                  ← Skills específicos (backend/frontend)

.agent/
├── rules/                   ← Antigravity (SYMLINKS a docs/*)
│   ├── xp-programming.md    → ../../docs/development-rules/xp-methodology.md
│   ├── tdd.md               → ../../docs/development-rules/tdd.md
│   ├── coding-standards.md  → ../../docs/development-rules/coding-standards.md
│   └── testing.md           → ../../docs/development-rules/testing-standards.md
└── antigravity-config.md    ← Config específica Antigravity
```

### Reglas:

1. **Fuente única**: Todos los archivos de reglas de desarrollo viven en `docs/development-rules/`
2. **Symlinks**: `.agent/rules/` contiene symlinks a `docs/development-rules/`
3. **Sin duplicación**: NO copiar contenido entre directorios
4. **Edición**: Siempre editar en `docs/development-rules/`, cambios se reflejan automáticamente en `.agent/rules/`
5. **Sin prefijo @**: Las rutas en archivos de configuración usan rutas relativas simples (sin `@`) para compatibilidad entre IDEs

---

## Consequences

### Positivas ✅

1. **Fuente única de verdad**: Solo editas un archivo, afecta a ambos IDEs
2. **No desincronización**: Imposible tener versiones diferentes
3. **Multi-IDE sin esfuerzo**: Funciona en VSCode y Antigravity sin cambios
4. **Mantenimiento simple**: Cambias 1 archivo en `docs/`, ambos IDEs lo ven
5. **Compatible entre OS**: Git Bash en Windows soporta symlinks como Mac/Linux

### Negativas ⚠️

1. **Requiere Git Bash en Windows**: Sin Git Bash, los symlinks no funcionan en Antigravity
2. **Configuración inicial**: Necesita ejecutar comandos bash para crear symlinks
3. **Nombres diferentes**: `.agent/rules/xp-programming.md` vs `docs/.../xp-methodology.md` (inevitable por convenciones de Antigravity)

### Mitigaciones 🛠️

1. **Documentación clara**: `docs/adr/002-multi-ide-configuration.md` (este archivo)
2. **Configuración de Antigravity**: `.agent/antigravity-config.md` explica cómo verificar Git Bash
3. **Scripts de verificación**: Futuros scripts pueden validar que symlinks existen
4. **README actualizado**: Incluir sección de configuración por IDE

---

## Rationale

### Alternativas Consideradas

#### Opción A: Duplicación con scripts de sincronización
```
docs/development-rules/  ← Fuente
.agent/rules/            ← Copias sincronizadas con script
```

**Pros**:
- ✅ No requiere Git Bash
- ✅ Funciona en cualquier OS sin configuración

**Contras**:
- ❌ Requiere ejecutar script manualmente
- ❌ Puede desincronizarse si olvidas ejecutar script
- ❌ Git hooks pueden ser invasivos

**Decisión**: ❌ Rechazada por riesgo de desincronización

---

#### Opción B: Symlinks (ELEGIDA)
```
docs/development-rules/  ← Fuente
.agent/rules/            ← Symlinks
```

**Pros**:
- ✅ Sincronización automática
- ✅ Imposible desincronizar
- ✅ Más simple que scripts

**Contras**:
- ⚠️ Requiere Git Bash en Windows

**Decisión**: ✅ **ELEGIDA** porque el equipo usa Git Bash

---

#### Opción C: Configuración única en raíz
```
.dev-rules/  ← Configuración única
```

**Pros**:
- ✅ No duplicación

**Contras**:
- ❌ IDEs no la reconocen
- ❌ Requiere configuración manual en cada IDE

**Decisión**: ❌ Rechazada por incompatibilidad con IDEs

---

## Implementation Notes

### Comandos para Crear Symlinks

```bash
# En Git Bash (Windows) o Terminal (Mac/Linux)
cd .agent/rules
rm -f *.md
ln -s ../../docs/development-rules/xp-methodology.md xp-programming.md
ln -s ../../docs/development-rules/tdd.md tdd.md
ln -s ../../docs/development-rules/coding-standards.md coding-standards.md
ln -s ../../docs/development-rules/testing-standards.md testing.md
```

### Verificación en Windows con Antigravity

**1. Verificar que Antigravity usa Git Bash**:
```bash
# En terminal de Antigravity
echo $SHELL
# Esperado: /usr/bin/bash o /bin/bash
```

**Si muestra otra cosa** (PowerShell, CMD):
- Configurar Antigravity para usar Git Bash como terminal por defecto
- Consultar documentación de Antigravity

**2. Verificar symlinks**:
```bash
ls -la .agent/rules/
# Debe mostrar: xp-programming.md -> ../../docs/development-rules/xp-methodology.md
```

**3. Verificar lectura**:
```bash
cat .agent/rules/tdd.md
# Debe mostrar contenido de docs/development-rules/tdd.md
```

---

## Migration Path

### Si alguien usa Windows sin Git Bash:

**Opción 1**: Instalar Git Bash (recomendado)
- Descargar de https://git-scm.com/downloads
- Configurar IDE para usar Git Bash

**Opción 2**: Usar WSL (Windows Subsystem for Linux)
- Los symlinks funcionan nativamente en WSL

**Opción 3**: Modo desarrollador de Windows 10/11
- Habilitar modo desarrollador
- Los symlinks funcionan sin permisos admin

---

## References

- [Git Bash Symlinks Documentation](https://git-scm.com/docs/git-symbolic-ref)
- [Antigravity Documentation](https://antigravity.dev/docs)
- [ADR-001: Monorepo Structure](001-monorepo-structure.md)
- [VSCode Copilot Instructions](.github/copilot-instructions.md)

---

## Future Considerations

1. **Script de validación**: Crear `scripts/validate-symlinks.sh` para verificar integridad
2. **CI/CD check**: Validar symlinks en pipeline de CI
3. **Documentación IDE-específica**: Crear guías para configurar VSCode y Antigravity correctamente
