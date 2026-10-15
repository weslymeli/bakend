# 🔐 Variables de Entorno

## ¿Qué es .env?

Archivo que contiene **secretos y configuraciones** que no deben estar en el código ni en git.

```
.env (archivo local - NO commitar)
.env.example (template público - SÍ commitar)
```

---

## Creación

### Paso 1: Copiar template

```bash
cp .env.example .env
```

### Paso 2: Rellenar valores

Editar `.env` con tus valores reales.

---

## Variables Backend

### Base de Datos

```env
# PostgreSQL en Neon Cloud
DATABASE_URL=postgresql://usuario:password@ep-xxx.neon.tech:5432/nombredb?sslmode=require
```

**Cómo obtenerla:**
1. Ir a https://neon.tech
2. Dashboard → Copy connection string
3. Pegar en .env

---

### Autenticación JWT

```env
# Genera un string aleatorio fuerte (32+ caracteres)
JWT_SECRET=abc123xyz789def456ghi789jkl012mno345pqr678stu901vwx234yz567abc

# Comando para generar:
# openssl rand -hex 32
```

**¿Qué es?** Clave secreta para firmar y verificar tokens JWT.

---

### Servidor

```env
# Puerto del servidor backend
PORT=4000

# Entorno (development, production)
NODE_ENV=development

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:3000
```

---

### Cloudinary (Imágenes)

```env
# Obtener en: https://cloudinary.com/console

CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

**Cómo obtenerlas:**
1. Crear cuenta en Cloudinary
2. Ir a Settings → API Keys
3. Copiar los valores

---

### Mercado Pago (Pagos)

```env
# Modo SANDBOX (para desarrollo)
MERCADOPAGO_ACCESS_TOKEN=TEST-xxx...

# Modo PRODUCCIÓN (después de verificar)
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxx...
```

**Cómo obtenerlo:**
1. Ir a https://developers.mercadopago.com
2. Dashboard → Credenciales
3. Usar token de SANDBOX para desarrollo

---

### Resend (Email)

```env
# API Key de Resend para emails
RESEND_API_KEY=re_xxx...

# Email desde donde se envían
RESEND_FROM_EMAIL=noreply@onstyle.com
```

**Cómo obtenerlo:**
1. Crear cuenta en https://resend.com
2. Crear API Key
3. Verificar tu dominio

---

### Groq (IA Chatbot)

```env
# API Key para chatbot con IA
GROQ_API_KEY=gsk_xxx...
```

**Cómo obtenerlo:**
1. Ir a https://groq.com
2. Crear API Key en console
3. Copiar

---

## Variables Frontend (Next.js)

### Base de Datos

Variables que **deben empezar con `NEXT_PUBLIC_`** para ser accesibles en el navegador:

```env
# URL del backend (accesible desde navegador)
NEXT_PUBLIC_API_URL=http://localhost:4000

# En producción
# NEXT_PUBLIC_API_URL=https://api.onstyle.com
```

**⚠️ NUNCA agregar secretos con `NEXT_PUBLIC_`**

---

## Ejemplo Completo de .env

```env
# ──────────────────────────────────────────────────────
# BASE DE DATOS
# ──────────────────────────────────────────────────────
DATABASE_URL=postgresql://usuario:password@ep-xxx.neon.tech:5432/oni_style_db?sslmode=require

# ──────────────────────────────────────────────────────
# AUTENTICACIÓN
# ──────────────────────────────────────────────────────
JWT_SECRET=abc123xyz789def456ghi789jkl012mno345pqr678stu901vwx234yz567abc

# ──────────────────────────────────────────────────────
# SERVIDOR
# ──────────────────────────────────────────────────────
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# ──────────────────────────────────────────────────────
# CLOUDINARY (Imágenes)
# ──────────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# ──────────────────────────────────────────────────────
# MERCADO PAGO (Pagos)
# ──────────────────────────────────────────────────────
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890abcdefghijk

# ──────────────────────────────────────────────────────
# RESEND (Email)
# ──────────────────────────────────────────────────────
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@onstyle.com

# ──────────────────────────────────────────────────────
# GROQ (IA)
# ──────────────────────────────────────────────────────
GROQ_API_KEY=gsk_xxx

# ──────────────────────────────────────────────────────
# FRONTEND
# ──────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Ejemplo .env.example (para git)

```env
# ──────────────────────────────────────────────────────
# BASE DE DATOS
# ──────────────────────────────────────────────────────
# Obtener en: https://neon.tech
DATABASE_URL=postgresql://user:password@host/dbname

# ──────────────────────────────────────────────────────
# AUTENTICACIÓN
# ──────────────────────────────────────────────────────
# Generar con: openssl rand -hex 32
JWT_SECRET=tu_jwt_secret_aqui

# ──────────────────────────────────────────────────────
# SERVIDOR
# ──────────────────────────────────────────────────────
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# ──────────────────────────────────────────────────────
# CLOUDINARY
# ──────────────────────────────────────────────────────
# Obtener en: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ──────────────────────────────────────────────────────
# MERCADO PAGO
# ──────────────────────────────────────────────────────
# Obtener en: https://developers.mercadopago.com
MERCADOPAGO_ACCESS_TOKEN=

# ──────────────────────────────────────────────────────
# RESEND
# ──────────────────────────────────────────────────────
# Obtener en: https://resend.com
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@onstyle.com

# ──────────────────────────────────────────────────────
# GROQ
# ──────────────────────────────────────────────────────
# Obtener en: https://groq.com
GROQ_API_KEY=

# ──────────────────────────────────────────────────────
# FRONTEND
# ──────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Entornos Diferentes

### Desarrollo

```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost/oni_style_dev
MERCADOPAGO_ACCESS_TOKEN=TEST-...  # Modo sandbox
```

### Staging (Opcional)

```env
NODE_ENV=staging
DATABASE_URL=postgresql://staging.neon.tech/...
FRONTEND_URL=https://staging.onstyle.com
MERCADOPAGO_ACCESS_TOKEN=TEST-...
```

### Producción

```env
NODE_ENV=production
DATABASE_URL=postgresql://prod.neon.tech/...
FRONTEND_URL=https://onstyle.com
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...  # Modo producción
JWT_SECRET=<secret_fuerte_aleatorio>
```

---

## Acceso en Código

### Backend

```javascript
// Acceso directo
const dbUrl = process.env.DATABASE_URL;
const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;

// Con valor por defecto
const puerto = process.env.PORT || 4000;

// Obligatorio (lanza error si falta)
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no configurado en .env');
}
```

### Frontend

```javascript
// Solo variables con NEXT_PUBLIC_
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ❌ NO FUNCIONA en navegador
console.log(process.env.JWT_SECRET);  // undefined
```

---

## Seguridad

### ✅ Buenas Prácticas

- [ ] Nunca commitear `.env`
- [ ] `.env` está en `.gitignore`
- [ ] Crear `.env.example` sin secretos
- [ ] Regenerar `JWT_SECRET` en producción
- [ ] Usar secretos fuertes y aleatorios
- [ ] Cambiar secrets regularmente
- [ ] No compartir `.env` por email
- [ ] Variables sensibles `NEVER` con `NEXT_PUBLIC_`

### ✅ En Producción

Usar panel de hosting (Vercel, Railway, etc.):

**Vercel:**
```
Settings → Environment Variables
```

**Railway:**
```
Project → Variables → Add Variable
```

---

## Troubleshooting

### Variable no se carga

```javascript
// Reiniciar servidor
npm run dev

// Verificar que existe en .env
grep JWT_SECRET .env

// Verificar no hay espacios
# ✅ JWT_SECRET=abc
# ❌ JWT_SECRET = abc
```

### NEXT_PUBLIC_ no funciona

```javascript
// Debe estar en .env (raíz)
// ✅ NEXT_PUBLIC_API_URL=...

// NO en .env.local en frontend (usar raíz del proyecto)
```

### Database connection refused

```javascript
// Verificar DATABASE_URL
echo $DATABASE_URL

// Verificar que Neon está online
# https://neon.tech/console
```

---

## Checklist

Antes de hacer deploy:

- [ ] Todos los .env.example están documentados
- [ ] Ningún secreto real en git
- [ ] `.gitignore` incluye `.env*`
- [ ] Variables en hosting configuradas
- [ ] JWT_SECRET fuerte en producción
- [ ] BASE_URL apunta a servidor correcto
- [ ] APIs externas autenticadas
- [ ] Emails verificados en Resend
- [ ] Mercado Pago en modo correcto

---

**Tiempo de lectura:** 10 minutos
**Nivel:** Todo el equipo

---

## Resumen

| Variable | Dónde | Tipo | Necesaria |
|----------|-------|------|-----------|
| DATABASE_URL | Backend | Secret | ✅ |
| JWT_SECRET | Backend | Secret | ✅ |
| PORT | Backend | Config | ⭕ |
| CLOUDINARY_* | Backend | Secret | ✅ |
| MERCADOPAGO_* | Backend | Secret | ✅ |
| RESEND_* | Backend | Secret | ✅ |
| NEXT_PUBLIC_API_URL | Frontend | Config | ✅ |

**Total documentación completada. ¡Excelente! 📚**
