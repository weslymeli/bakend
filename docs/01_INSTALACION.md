# 🛠️ Guía de Instalación y Setup

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.x o superior → [Descargar](https://nodejs.org/)
- **npm** 9.x o superior (viene con Node.js)
- **Git** → [Descargar](https://git-scm.com/)
- **PostgreSQL** (o usar Neon Cloud) → [Neon](https://neon.tech/)

Verifica las versiones:
```bash
node --version  # v18.0.0 o superior
npm --version   # 9.0.0 o superior
git --version   # git version 2.x o superior
```

---

## 📦 Instalación Paso a Paso

### Paso 1: Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto-oni-style
```

### Paso 2: Instalar Dependencias Backend

```bash
# Instala todas las dependencias definidas en package.json
npm install

# O si usas yarn
yarn install
```

**Dependencias instaladas:**
- Express.js (servidor web)
- Prisma (ORM)
- PostgreSQL driver
- JWT (autenticación)
- Cloudinary (uploads)
- Mercado Pago (pagos)
- Socket.io (chat en tiempo real)

### Paso 3: Configurar Variables de Entorno

Copia el archivo de ejemplo y rellena los valores:

```bash
cp .env.example .env  # O crea .env manualmente
```

Ver [13_VARIABLES_ENTORNO.md](./13_VARIABLES_ENTORNO.md) para la lista completa.

### Paso 4: Configurar la Base de Datos

**Opción A: Usar Neon (Recomendado para desarrollo)**

```bash
# 1. Crear cuenta en https://neon.tech/
# 2. Crear proyecto y copiar la URL de conexión
# 3. Pegar en .env como DATABASE_URL
# 4. Ejecutar migraciones
npx prisma migrate deploy

# 5. (Opcional) Llenar datos de prueba
npx prisma db seed
```

**Opción B: PostgreSQL Local**

```bash
# 1. Crear base de datos
createdb oni_style_db

# 2. Configurar conexión en .env
DATABASE_URL="postgresql://usuario:password@localhost:5432/oni_style_db"

# 3. Ejecutar migraciones
npx prisma migrate deploy
```

### Paso 5: Instalar Dependencias Frontend

```bash
cd oni-style-frontend
npm install
```

### Paso 6: Verificar la Instalación

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd oni-style-frontend
npm run dev
```

Debería ver:
```
Backend: ✅ Servidor Oni Style corriendo en http://localhost:4000
Frontend: ✅ http://localhost:3000
```

---

## 🔐 Configuración de Seguridad

### JWT Secret
```bash
# Generar un secret seguro
openssl rand -hex 32
# Copiar output en .env como JWT_SECRET
```

### Cloudinary Setup
1. Crear cuenta en [Cloudinary](https://cloudinary.com/)
2. Ir a Dashboard → Settings
3. Copiar: `Cloud Name`, `API Key`, `API Secret`
4. Pegar en `.env`:
```env
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Mercado Pago Setup
1. Crear cuenta en [Mercado Pago Developers](https://developers.mercadopago.com/)
2. Ir a Credenciales
3. Copiar Access Token (modo test/sandbox)
4. Pegar en `.env`:
```env
MERCADOPAGO_ACCESS_TOKEN=xxx
```

### Resend Email Setup
1. Crear cuenta en [Resend](https://resend.com/)
2. Crear API Key
3. Pegar en `.env`:
```env
RESEND_API_KEY=xxx
RESEND_FROM_EMAIL=noreply@tudominio.com
```

---

## 📱 Estructura Inicial de Carpetas

```
proyecto-oni-style/
├── server.js                    # Entrada del backend
├── package.json                 # Dependencias Node
├── .env                        # Variables de entorno
├── prisma/
│   ├── schema.prisma           # Esquema de BD
│   └── migrations/             # Historial de cambios BD
├── src/
│   ├── controllers/            # Lógica de negocio
│   ├── routes/                 # Rutas API
│   ├── middlewares/            # Autenticación, validaciones
│   └── lib/                    # Utilidades (Prisma, etc)
└── oni-style-frontend/         # Aplicación Next.js
    ├── app/                    # Pages (App Router)
    ├── components/             # Componentes React
    ├── lib/                    # Utilidades (Axios, etc)
    └── store/                  # Zustand stores
```

---

## ✅ Lista de Verificación Post-Instalación

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Repo clonado localmente
- [ ] `npm install` ejecutado en raíz
- [ ] `.env` configurado con todas las variables
- [ ] Base de datos configurada
- [ ] `npx prisma migrate deploy` ejecutado
- [ ] Frontend: `npm install` ejecutado en `oni-style-frontend/`
- [ ] Backend corriendo en puerto 4000
- [ ] Frontend corriendo en puerto 3000
- [ ] Login funciona correctamente
- [ ] Panel admin accesible

---

## 🐛 Problemas Comunes

### Error: "Cannot find module 'express'"
```bash
# Solución: Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "database connection failed"
```bash
# Verificar:
# 1. DATABASE_URL configurado correctamente
# 2. Base de datos existe
# 3. Migraciones ejecutadas: npx prisma migrate deploy
```

### Puerto 4000 ya en uso
```bash
# Opción 1: Cambiar puerto en .env
PORT=4001

# Opción 2: Matar proceso en puerto 4000
lsof -i :4000  # macOS/Linux
netstat -ano | findstr :4000  # Windows
```

### Frontend no conecta al backend
```bash
# Verificar en .env del frontend:
NEXT_PUBLIC_API_URL=http://localhost:4000

# Verificar CORS en server.js:
cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" })
```

Ver [12_TROUBLESHOOTING.md](./12_TROUBLESHOOTING.md) para más problemas.

---

## 🎓 Próximos Pasos

1. ✅ Instalación completada
2. 📖 Leer [02_ARQUITECTURA.md](./02_ARQUITECTURA.md)
3. 📚 Leer [03_ESTRUCTURA_CARPETAS.md](./03_ESTRUCTURA_CARPETAS.md)
4. 🔑 Leer [06_AUTENTICACION.md](./06_AUTENTICACION.md)
5. 📡 Leer [05_API_ENDPOINTS.md](./05_API_ENDPOINTS.md)

---

**Tiempo estimado:** 30 minutos
**Dificultad:** ⭐⭐ Intermedia
**Soporte:** Ver [12_TROUBLESHOOTING.md](./12_TROUBLESHOOTING.md)
