# ADR 004: Frontend Deployment Strategy & Release Management

**Status**: ✅ DECIDIDO  
**Date**: 2026-01-23  
**Authors**: Agente XP, Tech Lead José Manuel Velasco  
**Priority**: HIGH - Bloquea go-live a producción
**Decision Made**: Opción B (Vercel) + Rama `release` + Hotfix Flow (2026-01-23)

---

## Context

El frontend (React 19 + Vite) ha completado Fase 6 con:
- ✅ 84/84 tests pasando
- ✅ 98.5% coverage
- ✅ Diseño visual aprobado y ajustes post-review completos
- ✅ Accesibilidad validada
- ✅ Performance excelente (248KB, gzip 80.6KB)
- ✅ 2 commits locales no pusheados en rama `frontend-development`

Se necesita definir:
1. **Estrategia de push al upstream** (GitHub)
2. **Versioning** del frontend (actualmente 0.0.0)
3. **Release tagging** (siguiente versión)
4. **Plataforma de despliegue** a producción
5. **Rama de producción** (¿main o frontend-development?)

---

## Current Repository State

### 🔍 Git Status

```
Rama local: frontend-development
Commits sin pushear: 2
  - 5307752: docs: cleanup Fase 7 y agregar DEPLOYMENT.md
  - 927b43b: feat(css): ajustes visuales - contraste, menú mobile, imágenes, fuentes y espaciado

Working directory: LIMPIO ✅
```

### 📍 Estructura de Ramas

```
GitHub (Remote):
  - origin/main              → Production-ready (HEAD remoto)
  - origin/frontend-development → Current development
  - origin/frontend-preparation → Branch preparatorio
  - origin/main-backup       → Respaldo

Local:
  - frontend-development* (2 commits ahead of origin)
  - frontend-preparation
  - main
```

### 🏷️ Tags Existentes (Semantic Versioning)

```
frontend/v0.1.0 → Primeros tests
frontend/v0.2.0 → Sistema de favoritos
frontend/v0.3.0 → Navegación global
frontend/v0.4.0 → Tests accesibilidad y responsive
frontend/v0.5.0 → Tests accesibilidad completos
frontend/v0.6.0 → Diseño visual CSS Monster High

Próximo: frontend/v0.7.0 (esta release con ajustes post-review)
```

### 📦 Versionamiento Actual

| Ubicación | Versión | Estado |
|-----------|---------|--------|
| `/package.json` (raíz) | 1.0.0 | ✅ Correcto |
| `/apps/web/package.json` | 0.0.0 | ❌ **Nunca se actualizó** |
| `/apps/backend/package.json` | ? | ⓘ No revisado |

### 🏗️ Monorepo Structure

```
monster-high/ (v1.0.0)
├── apps/
│   ├── backend/    (Node.js - Scraper + AI)
│   └── web/        (React 19 - Frontend) ← FOCUS
├── packages/       (Shared - vacío)
├── docs/
│   └── adr/        (Architecture Decisions)
├── lib/            (Built backend output)
└── data/           (Datos estáticos)
```

---

## Problem Statement

### Decisiones Pendientes

#### 1️⃣ **Push Strategy**
- ¿Push directo a `frontend-development` + tag?
- ¿O hacer PR a `main` para control?
- ¿Cuál es la rama de "source of truth" para producción?

#### 2️⃣ **Version Management**
- `/apps/web/package.json` está en `0.0.0` desde inicio
- ¿Actualizar a `0.7.0` en esta release?
- ¿Mantener independiente de raíz `1.0.0`?

#### 3️⃣ **Release Tagging**
- Crear `frontend/v0.7.0` después de push?
- ¿Incluir changelog?
- ¿Release notes?

#### 4️⃣ **Plataforma de Despliegue**
- **Vercel**: Deploy en 2 min, CI/CD automático, free plan generoso
- **Netlify**: Igual que Vercel, interfaz más intuitiva
- **GitHub Pages**: Gratis pero sin edge functions, requiere config manual
- **AWS Amplify**: Enterprise option
- **Azure Static**: Enterprise option

#### 5️⃣ **Rama de Producción**
- ¿Deploy desde `main` (más controlado)?
- ¿Deploy desde `frontend-development` (más ágil)?
- ¿Ambas con diferentes configuraciones?

---

## Analysis of Options

### 📋 Option A: Fast-Track (Current Development Branch)

**Estrategia**: Push directo a `frontend-development` → Tag → Deploy desde `frontend-development`

#### Flujo
```
1. git push origin frontend-development
2. git tag -a frontend/v0.7.0 -m "..."
3. git push origin --tags
4. Conectar Vercel a rama `frontend-development`
5. Deploy automático en cada push
```

#### ✅ Ventajas
- ⚡ Rápido: Go-live en horas
- 🔄 CI/CD automático de desarrollo
- 📊 Vercel puede hacer preview de PRs
- 🎯 Directo sin ceremony

#### ❌ Desventajas
- 🚨 `main` queda desincronizado
- 🔀 Confusión sobre "source of truth"
- 🛑 Sin control de qué va a producción
- 📝 Difícil rastrear qué está deployado

#### 📊 Riesgo: **ALTO** - Falta de control en producción

---

### 📋 Option B: Controlled Merge (Pull Request to Main)

**Estrategia**: PR `frontend-development` → `main` → Merge → Tag → Deploy desde `main`

#### Flujo
```
1. Crear PR: frontend-development → main
2. Vercel hace preview del PR
3. Code review + smoke tests manuales
4. Merge a main
5. git tag -a frontend/v0.7.0
6. git push origin --tags
7. Deploy automático desde main
```

#### ✅ Ventajas
- ✅ Control total antes de producción
- ✅ `main` siempre === producción
- ✅ Fácil rastrear qué está deployado
- ✅ PR Preview en Vercel
- ✅ Mejor para equipo

#### ❌ Desventajas
- ⏱️ Más lento (~30 min adicionales)
- 📋 Requiere review manual
- 🔀 Bifurcación temporal de ramas

#### 📊 Riesgo: **BAJO** - Controlado y auditable

---

### � Option C: GitHub Actions + CDN (Self-Hosted CI/CD)

**Estrategia**: GitHub Actions ejecuta workflow → Build backend + frontend → Publica a CDN

#### Contexto Monorepo
```
Backend (apps/backend/):
  - Genera monsterHighCharacters.json
  - Actualmente datos copiados a public/api/characters.json
  
Frontend (apps/web/):
  - Consume JSON del filesystem o API
  - Build genera dist/ (~249KB)
```

#### Flujo Propuesto
```
1. Push a main/frontend-development
2. GitHub Actions workflow inicia:
   a) Build backend (genera JSON actualizado)
   b) Copia JSON a public/api/
   c) Build frontend (npm run build → dist/)
   d) Deploy dist/ a CDN (Cloudflare Pages, GitHub Pages, etc.)
3. Aplicación viva sin depender de Vercel
```

#### 🔧 Workflow YAML (Ejemplo)
```yaml
name: Build & Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'apps/backend/**'
      - 'apps/web/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Build Backend (si cambió)
      - name: Build Backend
        run: npm run build --workspace=apps/backend
      
      # Copiar datos generados
      - name: Copy Generated Data
        run: cp apps/backend/data/*.json apps/web/public/api/
      
      # Build Frontend
      - name: Build Frontend
        run: npm run build --workspace=apps/web
      
      # Deploy a Cloudflare Pages
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: monster-high-web
          directory: apps/web/dist
```

#### ✅ Ventajas
- 🆓 Completamente gratis (usando GitHub Actions + CDN gratis)
- 🚀 CI/CD bajo control total en GitHub
- 🔄 Automatiza sincronización backend ↔ frontend
- 🌍 CDN global (Cloudflare, GitHub Pages)
- 📊 Log en GitHub (auditable)
- 🔐 No depende de terceros (Vercel)
- 💾 Historial en GitHub

#### ❌ Desventajas
- 🔧 Más configuración que Vercel
- 📚 Requiere aprender GitHub Actions YAML
- 🐛 Debug más complejo si falla
- ⏱️ Build toma más tiempo (no caché como Vercel)
- 🔌 Necesita secrets en GitHub (API tokens)

#### 📊 Riesgo: **MEDIO** - Controlado pero más setup

#### CDN Options para Option C

| CDN | Costo | Setup | Nota |
|-----|-------|-------|------|
| **GitHub Pages** | FREE | Automático | Subpath requerido (`/monster-high/`) |
| **Cloudflare Pages** | FREE | 10 min | Static hosting excepcional |
| **Netlify (drag-drop)** | FREE | 5 min | Sin Actions, upload manual |
| **AWS S3 + CloudFront** | Casi FREE | 20 min | ~$1/mes si hay tráfico |

---

### 📊 Plataforma de Despliegue: Comparativa Técnica

#### **Vercel** ⭐⭐⭐
```
Setup: 2 minutos (conectar GitHub)
Build: Detecta automáticamente Vite
Output: dist/
CI/CD: Automático en cada push
Preview: SÍ (cada PR)
Edge: SÍ
Analytics: SÍ
Costo: Free indefinido para este proyecto
```

#### **Netlify** ⭐⭐⭐
```
Setup: 2 minutos (idéntico a Vercel)
Build: Automático
CI/CD: Automático
Preview: SÍ
Edge: SÍ
Forms: SÍ (bonus)
Costo: Free indefinido
```

#### **GitHub Pages + GitHub Actions** ⭐⭐⭐
```
Setup: 15 minutos (workflow YAML)
Build: Actions ejecuta comando build
Output: rama gh-pages o artifact
CI/CD: Actions (100% control)
Preview: ❌ (pero logs en GitHub)
Edge: ❌ (pero rápido)
Analytics: ❌
Costo: Completamente GRATIS
```

#### **Cloudflare Pages + GitHub Actions** ⭐⭐⭐⭐
```
Setup: 20 minutos (integración + secrets)
Build: Actions ejecuta + deploy
CI/CD: Actions (100% control)
Preview: SÍ (por rama)
Edge: ✅ SÍ (Cloudflare global)
Analytics: ✅ SÍ
Costo: Completamente GRATIS
```

#### **GitHub Pages** ⭐⭐
```
Setup: 5 minutos (manual config)
Build: Requiere workflow de GH Actions
Output: rama gh-pages
CI/CD: Manual con Actions
Preview: ❌
Edge: ❌
Costo: Gratis siempre
```

**Veredicto**: 
- **Más simple**: Vercel o Netlify (plug-and-play)
- **Más control**: GitHub Actions + Cloudflare Pages
- **Más barato**: GitHub Pages (gratis absoluto)

---

## Decision

### 🎯 DECISIÓN FINAL: Option B + Rama `release` + Hotfix Flow

**Opción Elegida**: Vercel con rama `release` como rama de producción + hotfix flow

```
main (histórico, no toca)
├── frontend-development (rama de trabajo activa)
└── release (rama de producción en Vercel)
    ↓ Vercel toma automáticamente cambios
    ↓ Deploy automático a producción
```

---

## 🌳 Branching Strategy: GitFlow Simplificado

### Ramas

| Rama | Propósito | Protección | Deploy |
|------|-----------|-----------|--------|
| `main` | Histórico (no se usa) | Git protect | ❌ No |
| `frontend-development` | Trabajo diario, desarrollo continuo | ✅ | ❌ No |
| `release` | Producción viva en Vercel | ✅ | ✅ SÍ |
| `hotfix/*` | Fixes urgentes (rama temporal) | ❌ | ✅ (a `release`) |

### Flujo Normal: Feature → Release

```bash
# 1. Trabajo en frontend-development (diario)
git checkout frontend-development
# ... commits, push, tests ...
git push origin frontend-development

# 2. Cuando está listo para PRODUCCIÓN
#    Crear PR: frontend-development → release

# 3. En GitHub:
#    - Code review
#    - Vercel preview del merge
#    - Approve + Merge

# 4. Vercel detecta push a `release`
#    → Build automático
#    → Deploy a producción

# 5. Crear tag de release
git tag web-v0.7.0
git push origin web-v0.7.0
```

### Flujo Hotfix: Fix Urgente en Producción

```bash
# 1. Crear rama hotfix desde release
git checkout release
git checkout -b hotfix/critical-bug

# 2. Hacer fix + test
# ... commits ...

# 3. PR: hotfix/critical-bug → release
#    (mínimo review si es urgente)

# 4. Vercel deploya automáticamente

# 5. Crear tag hotfix
git tag web-v0.7.1-hotfix
git push origin web-v0.7.1-hotfix

# 6. Opcional: Syncronizar fix a frontend-development
git checkout frontend-development
git merge release
git push origin frontend-development
```

---

## 📦 Version Management: npm version Strategy

### Actualización Automática de Versión

**Opción Recomendada**: `npm version` (simple y estándar)

```bash
# Cuando quieres hacer release desde frontend-development
cd apps/web
npm version minor
# Actualiza apps/web/package.json de 0.0.0 → 0.1.0
# Crea commit automático
# Crea tag automático

git push origin frontend-development --follow-tags
```

**Tipos de bump**:
```bash
npm version patch    # 0.7.0 → 0.7.1 (hotfix)
npm version minor    # 0.7.0 → 0.8.0 (feature release)
npm version major    # 0.7.0 → 1.0.0 (breaking changes)
```

### Configuración en package.json (opcional)

```json
{
  "name": "@monster-high/web",
  "version": "0.7.0",
  "scripts": {
    "release:minor": "npm version minor && git push origin --follow-tags",
    "release:patch": "npm version patch && git push origin --follow-tags"
  }
}
```

**Uso**:
```bash
npm run release:minor
```

---

## 🔄 Hybrid Approach: What If Both?

También puedes hacer **ambas simultaneously**:

```
├─ GitHub Actions (build + test automático)
│  └─ Deploy staging a Cloudflare Pages
│
└─ Vercel (deploy production desde rama release)
   └─ Deploy automático a producción
```

**Ventaja**: Tienes staging (GitHub Actions) + production (Vercel)

---

## Consequences of Each Option

### ✅ Consequences if Option B (Vercel)

**Positivos**:
- ✅ Producción controlada (PR review)
- ✅ `main` limpio y deployable
- ✅ CI/CD automático Vercel
- ✅ Easy rollback
- ✅ Preview URLs
- ✅ Analytics integrado

**Negativos**:
- ⏱️ +30 min PR review
- 💰 Dependencia de Vercel (aunque free)
- 🔐 Secrets en Vercel

---

### ✅ Consequences if Option C (GitHub Actions)

**Positivos**:
- ✅ Control total en GitHub
- ✅ Costo cero absoluto
- ✅ CI/CD en tu control
- ✅ Automatiza backend ↔ frontend
- ✅ Escalable
- ✅ No dependencia de terceros
- ✅ Log auditables en GitHub

**Negativos**:
- 🔧 Más setup inicial (~20 min)
- 📚 Aprende GitHub Actions YAML
- 🐛 Debug más complejo si falla
- ⏱️ Build toma más (sin caché global)
- 🌍 Sin edge functions (pero no necesitas)

---

## Consequences

### ✅ Si seguimos esta decisión:

**Positivos**:
- ✅ Producción controlada y auditable
- ✅ `main` siempre limpio y deployable
- ✅ PR review como safety net
- ✅ Fácil rollback si algo falla
- ✅ CI/CD automático desde Vercel
- ✅ Preview URLs para QA

**Negativos**:
- ⏱️ +30 min de tiempo en PR review
- 📋 Requiere discipline en team
- 🔀 Bifurcación temporal de ramas

---

## Implementation Checklist

✅ Decisión hecha. Checklist para implementación:

### Preparación Inmediata
- [ ] Crear rama `release` desde `frontend-development`
  ```bash
  git checkout frontend-development
  git checkout -b release
  git push -u origin release
  ```

- [ ] Actualizar versión en apps/web/package.json
  ```bash
  cd apps/web
  npm version minor  # 0.0.0 → 0.1.0
  git push origin release --follow-tags
  ```

### Configuración Vercel
- [ ] Conectar repositorio GitHub a Vercel
- [ ] En Vercel Project Settings:
  - Root Directory: `apps/web`
  - Production Branch: `release` ← **IMPORTANTE**
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`

### Merge de 2 commits pendientes
- [ ] Push 2 commits locales a `frontend-development`
  ```bash
  git push origin frontend-development
  ```

- [ ] Crear PR: `frontend-development` → `release`
- [ ] Vercel preview automático en PR
- [ ] Merge en release
- [ ] Vercel deploya automáticamente ✨

### Post-Deploy
- [ ] Verificar aplicación en dominio Vercel
- [ ] Smoke tests manuales
- [ ] Celebrar 🎉
- [ ] ¿Creamos CHANGELOG para v0.7.0?
- [ ] ¿Incluimos release notes?

### ✅ Validación Técnica (una vez decidido)
- [ ] Tests: 84/84 ✅ (ya validado)
- [ ] Build: Sin errores ✅ (ya validado)
- [ ] Coverage: 98.5% ✅ (ya validado)
- [ ] Accesibilidad: Validada ✅ (ya validado)

---

## Related Documents

- [PROGRESS.md](../../apps/web/PROGRESS.md) - Estado de desarrollo actual
- [ADR 001](./001-monorepo-structure.md) - Estructura del monorepo
- [ADR 003](./003-frontend-framework-selection.md) - Selección de framework

---

## Next Steps (Once Approved)

1. Tech Lead aprueba esta ADR
2. Ejecutar pasos de "Implementación Recomendada"
3. Smoke tests en Vercel preview
4. Merge a main
5. Validar deployment en producción
6. Documentar en PROGRESS.md

---

**Status**: AWAITING TECH LEAD DECISION  
**Decision Maker**: José Manuel Velasco (Tech Lead)  
**Implementation Owner**: Agente XP

