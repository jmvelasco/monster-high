# 🚀 Opciones de Despliegue - Monster High Frontend

**Proyecto**: Monster High Frontend (React 19 + Vite)  
**Build Output**: `dist/` (~249KB, gzip 80.6KB)  
**Requisitos**: Servir static assets HTML/CSS/JS

---

## 📊 Comparativa de Plataformas

| Opción | Costo | Setup | CI/CD | Edge | Analytics | Recomendación |
|--------|-------|-------|-------|------|-----------|---|
| **Vercel** | Free/Pago | 2 min | ✅ Automático | ✅ Sí | ✅ Sí | ⭐⭐⭐ Recomendado |
| **Netlify** | Free/Pago | 2 min | ✅ Automático | ✅ Sí | ✅ Sí | ⭐⭐⭐ Recomendado |
| **GitHub Pages** | FREE | 5 min | ✅ GH Actions | ❌ No | ❌ No | ⭐⭐ Simple |
| **AWS Amplify** | FREE Tier | 10 min | ✅ Automático | ✅ Sí | ✅ CloudWatch | ⭐⭐ Verbose |
| **Azure Static** | FREE Tier | 10 min | ✅ Automático | ✅ Sí | ✅ Sí | ⭐⭐ Verbose |
| **Self-hosted** | Costo servidor | 1h | 🔧 Manual | ❌ No | 🔧 Manual | ⭐ Complejo |

---

## 🥇 RECOMENDACIÓN: Vercel (Mejor Opción)

### ✅ Ventajas
- **Deploy en 2 minutos** desde GitHub
- **CI/CD automático** en cada push
- **Hosting global** con edge functions
- **Preview URLs** para cada PR
- **Analytics integrado**
- **HTTPS/HTTP2 gratis**
- **Soporte oficial para Vite**
- **Plan Free muy generoso**

### 📋 Pasos para Desplegar en Vercel

#### 1. Conectar GitHub
```bash
# Ya tienes el repo en GitHub, solo abre:
# https://vercel.com/import

# Selecciona: monster-high → apps/web
```

#### 2. Configurar
```bash
# Vercel detecta automáticamente:
# - Framework: Vite
# - Build Command: npm run build
# - Output Directory: dist
```

#### 3. Listo - Deploy automático
```bash
# Cada push a main/frontend-development triggerea:
1. npm install
2. npm run build
3. Deploy a production/preview
```

### 🔗 URL en Vivo
```
Production: https://monster-high-web.vercel.app
Preview PRs: https://monster-high-web-pr-123.vercel.app
```

---

## 🥈 ALTERNATIVA: Netlify

### ✅ Ventajas
- Idéntico a Vercel en funcionalidad
- Interfaz más intuitiva
- **Netlify Forms integrado** (si necesitas contacto)
- Edge Functions también disponibles

### 📋 Pasos
```bash
# https://app.netlify.com/signup
# Conectar GitHub
# Drag & drop carpeta dist (si lo prefieres)
```

---

## 🟡 OPCIÓN GRATIS: GitHub Pages

### ✅ Ventajas
- **Completamente GRATIS**
- Zero setup (está en GitHub)
- Confiable y simple

### ❌ Limitaciones
- URL: `username.github.io/monster-high/` (con subpath)
- No edge functions
- No analytics avanzado
- Manejo manual de deploy

### 📋 Pasos
```bash
# 1. Editar vite.config.ts
export default {
  base: '/monster-high/',
  build: { outDir: 'dist' }
}

# 2. GitHub Actions (crear .github/workflows/deploy.yml)
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build --workspace=apps/web
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./apps/web/dist

# 3. Settings → Pages → Deploy from branch (gh-pages)
```

---

## 🎯 DECISIÓN FINAL

| Escenario | Recomendación |
|-----------|---|
| **Producción profesional** | → **Vercel** ⭐⭐⭐ |
| **Alternativa equally good** | → **Netlify** ⭐⭐⭐ |
| **Budget ZERO absoluto** | → **GitHub Pages** ⭐⭐ |
| **Empresa con AWS** | → **AWS Amplify** ⭐⭐ |

---

## 🚀 Próximos Pasos

### 1️⃣ Opción Recomendada (Vercel)
```bash
# 1. Ir a https://vercel.com/import
# 2. Autorizar GitHub
# 3. Seleccionar repositorio: monster-high
# 4. Seleccionar raíz del proyecto: apps/web
# 5. Click "Deploy"
# ✅ LISTO en 2 minutos
```

### 2️⃣ Validación Post-Deploy
```bash
# Smoke tests manuales:
☐ Visitar URL en vivo
☐ Probar hamburger menu en móvil (Chrome DevTools)
☐ Navegar entre páginas
☐ Agregar/quitar favoritos
☐ Verificar que los estilos se ven correctamente
☐ Probar en Safari (si disponible)
```

### 3️⃣ Configuración Opcional
```bash
# En Vercel dashboard:
- Environment variables (si necesarias)
- Custom domain (opcional)
- Analytics
- Monitoring
```

---

## 📊 Estimación de Costos

| Plataforma | Free | Pro | Notas |
|-----------|------|-----|-------|
| Vercel | ✅ | $20/mes | Free indefinido para este proyecto |
| Netlify | ✅ | $19/mes | Free indefinido para este proyecto |
| GitHub Pages | ✅ | N/A | 100% gratis siempre |
| AWS Amplify | ✅ | Pay-as-you-go | Free tier cubre fácilmente este proyecto |

---

## ✅ Checklist Antes de Desplegar

- [x] Tests: 84/84 pasando
- [x] Build: Sin errores (`npm run build`)
- [x] Coverage: 98.5%
- [x] Accesibilidad: Validada
- [x] Responsive: Testeado
- [x] Diseño visual: Aprobado
- [ ] Smoke tests manuales (post-deploy)
- [ ] Performance validada en navegador real

---

**Recomendación Final**: Usa **Vercel**. Deploy automatizado, confiable, y lista de espera de 2 minutos.

¿Procedemos con Vercel?
