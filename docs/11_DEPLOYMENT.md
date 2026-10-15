# 🚀 Deployment - Guía de Despliegue

## Ambientes

```
Desarrollo:  localhost:3000 y localhost:4000
Staging:     https://staging.onstyle.com (opcional)
Producción:  https://onstyle.com
```

---

## Pre-Deployment Checklist

### Code Quality

- [ ] Todos los tests pasan
- [ ] No hay console.log() en código
- [ ] Sin código comentado
- [ ] Sin archivos .env en git
- [ ] Variables de entorno documentadas
- [ ] Linter sin warnings (si existe)

### Funcionalidad

- [ ] Login/Registro funciona
- [ ] Carrito funciona
- [ ] Pagos funciona (modo test)
- [ ] Admin panel funciona
- [ ] API endpoints testados
- [ ] Imágenes cargan correctamente

### Security

- [ ] JWT Secret fuerte y único
- [ ] Bcrypt configurado
- [ ] CORS restringido a dominio correcto
- [ ] Rate limiting en login
- [ ] SQL Injection imposible
- [ ] XSS prevention (sanitizar inputs)

### Performance

- [ ] Imágenes optimizadas
- [ ] BD indexada
- [ ] Lazy loading implementado
- [ ] Caché configurado

---

## Backend - Node.js Express

### Opción A: Vercel

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Para producción
vercel --prod
```

**Configurar .env en Vercel:**
1. Ir a Project Settings
2. Environment Variables
3. Agregar todas las variables

### Opción B: Railway.app (Recomendado)

```bash
# 1. Crear cuenta en railway.app
# 2. Conectar GitHub repo
# 3. Crear proyecto
# 4. Agregar PostgreSQL plugin
# 5. Configurar variables de entorno
```

**Variables en Railway:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=xyz...
CLOUDINARY_CLOUD_NAME=...
MERCADOPAGO_ACCESS_TOKEN=...
RESEND_API_KEY=...
PORT=3000
NODE_ENV=production
```

### Opción C: AWS/GCP/Azure

```bash
# Requiere más configuración
# Usar Docker para containerizar
docker build -t oni-style .
docker run -p 4000:4000 oni-style
```

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

---

## Frontend - Next.js

### Opción A: Vercel (Recomendado)

```bash
# Vercel está optimizado para Next.js
vercel

# En producción
vercel --prod
```

**Configurar variables en Vercel:**
```
NEXT_PUBLIC_API_URL=https://api.onstyle.com
```

### Opción B: Netlify

```bash
# 1. Conectar repo de GitHub
# 2. Build command: npm run build
# 3. Publish directory: .next
# 4. Agregar variables de entorno
```

### Opción C: Docker + Cloud Run

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Base de Datos - PostgreSQL

### Neon Cloud (Actual)

```bash
# Ya está configurado
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/...

# Backups automáticos cada 24h
# Disponible en Neon Dashboard
```

### Migrar a Producción

```bash
# 1. En Neon, copiar URL de BD de producción
# 2. Pegar en .env de producción
# 3. Ejecutar migraciones
npx prisma migrate deploy

# 4. (Opcional) Seed de datos
npx prisma db seed
```

---

## Dominio y SSL

### Registrar Dominio

1. Comprar en: GoDaddy, Namecheap, Route53
2. Apuntar nameservers a hosting elegido

### SSL/TLS (Certificado)

- **Vercel:** Automático
- **Railway:** Automático
- **Netlify:** Automático
- **AWS:** ACM (AWS Certificate Manager)

---

## Monitoreo en Producción

### Logging

```javascript
// Backend - Guardar logs
const fs = require('fs');

const logError = (error) => {
  const log = `${new Date().toISOString()} - ${error}\n`;
  fs.appendFileSync('logs/error.log', log);
};
```

### Error Tracking (Recomendado)

```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

### Uptime Monitoring

Usar: UptimeRobot, Pingdom, HealthChecks.io

---

## CI/CD Pipeline

### GitHub Actions (Automático)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm run build
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## Rollback en Caso de Error

### Método 1: Git Revert

```bash
# Ver historial
git log --oneline

# Revertir último commit
git revert HEAD

# Push
git push origin main
```

### Método 2: Versión Anterior en Hosting

- **Vercel:** Dashboard → Deployments → Select old version
- **Railway:** Select previous deployment

---

## Performance en Producción

### Optimizaciones Recomendadas

```javascript
// 1. Compresión
const compression = require('compression');
app.use(compression());

// 2. Helmet para seguridad
const helmet = require('helmet');
app.use(helmet());

// 3. Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
```

### Caching

```javascript
// Cache headers
app.use((req, res, next) => {
  if (req.url.includes('/static/')) {
    res.set('Cache-Control', 'public, max-age=31536000');
  }
  next();
});
```

---

## Checklist Final Antes de Publicar

- [ ] `npm run build` sin errores
- [ ] Tests pasan
- [ ] .env configurado
- [ ] BD migraciones ejecutadas
- [ ] Cloudinary configurado
- [ ] Mercado Pago en modo producción
- [ ] Resend email verificado
- [ ] Socket.io funcionando
- [ ] CORS correcto
- [ ] SSL/HTTPS habilitado
- [ ] Monitoreo configurado
- [ ] Backups automáticos
- [ ] Error logging activo
- [ ] Dominio apuntando correctamente

---

## Postmortem de Incidente

Si algo falla en producción:

1. **Detectar:** Monitoreo alerta el error
2. **Comunicar:** Notificar al equipo
3. **Investigar:** Ver logs y error tracking
4. **Arreglar:** Hacer fix en rama
5. **Testear:** Verificar en desarrollo
6. **Deploy:** Hacer rollout rápido
7. **Documentar:** Escribir postmortem
8. **Prevenir:** Agregar test para evitar regresión

---

**Tiempo de lectura:** 15 minutos
**Nivel:** DevOps/Backend Lead

Próxima lectura → [12_TROUBLESHOOTING.md](./12_TROUBLESHOOTING.md)
