# 🛠️ Troubleshooting - Solución de Problemas Comunes

## Backend

### Error: "listen EADDRINUSE: address already in use :::4000"

**Causa:** Puerto 4000 ya está en uso

**Soluciones:**

```bash
# Opción 1: Cambiar puerto en .env
PORT=4001

# Opción 2: Matar proceso (macOS/Linux)
lsof -i :4000
kill -9 <PID>

# Opción 3: Matar proceso (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force
```

---

### Error: "Cannot connect to the Database"

**Causa:** BD no está disponible o URL incorrecta

**Soluciones:**

```bash
# 1. Verificar DATABASE_URL
echo $DATABASE_URL

# 2. Si usa Neon, verificar conexión
psql $DATABASE_URL

# 3. Reiniciar servidor
npm run dev

# 4. Si persistencia error, check
# - Usuario/password correcto
# - Firewall permite conexión
# - Neon status en https://neon.tech
```

---

### Error: "Prisma migrations failed"

```bash
# Ver estado
npx prisma migrate status

# Intentar arreglar
npx prisma migrate resolve --rolled-back <nombre>

# Generar cliente
npx prisma generate

# Si todo falla, reset (⚠️ borra BD)
npx prisma migrate reset
```

---

### Error: "JWT Token is invalid or expired"

**Causa:** Token expirado (7 días) o secret incorrecto

**Soluciones:**

```bash
# Verificar JWT_SECRET en .env
# Debe ser igual en desarrollo y producción

# Si el usuario hace logout/login:
# - Genera nuevo token automáticamente
# Implementar refresh token para sesiones largas
```

---

### Error: "CORS error - Access Denied"

**Causa:** Origen no está permitido en CORS

**Verificar en server.js:**
```javascript
// Debe coincidir con FRONTEND_URL
cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" })
```

**Soluciones:**
```javascript
// Si necesita múltiples orígenes:
cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://onstyle.com"
  ]
})
```

---

### Error: "Cannot find module 'express'"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# O si usa yarn
rm -rf node_modules yarn.lock
yarn install
```

---

### Error: "POST /api/admin/products - 413 Payload too large"

**Causa:** Archivos muy grandes o payload excede límite

**Solución:**
```javascript
// En server.js
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```

---

## Frontend

### Error: "Cannot find module '@/...' when importing"

**Causa:** Alias de import no configurado

**Verificar jsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Si persiste:**
```bash
# Limpiar Next.js cache
rm -rf .next

# Reiniciar servidor
npm run dev
```

---

### Error: "useAuthStore is not a function"

**Causa:** Store no se está importando correctamente

```javascript
// ❌ Mal
import useAuthStore from '@/store/useAuthStore.js';

// ✅ Bien
import useAuthStore from '@/store/useAuthStore';

// ✅ Usar selector
const usuario = useAuthStore((state) => state.usuario);
```

---

### Error: "Cannot GET /productos"

**Causa:** Página no existe en App Router

**Solucionar:**
```
app/
├── productos/
│   └── page.js    ← Crear este archivo

# Luego crear ruta /productos/[slug]/page.js para dinámico
```

---

### Error: "Hydration mismatch between server and client"

**Causa:** Estado diferente entre servidor y cliente

**Soluciones:**
```javascript
// Usar useEffect para reidratar
'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;  // O skeleton

  return <div>{/* contenido */}</div>;
}
```

---

### Error: "API call returns 401 Unauthorized"

**Causas posibles:**

```javascript
// 1. Token no se está enviando
// Verificar axios interceptor en lib/axios.js

// 2. Token expirado
// Usuario debe hacer login de nuevo

// 3. JWT_SECRET diferente
// Verificar .env en backend vs frontend
```

---

### Error: "Imágenes no cargan"

**Causas:**

```javascript
// 1. URL de Cloudinary incorrecta
// Ver en admin si las imágenes se subieron

// 2. CORS de Cloudinary
// Las imágenes de Cloudinary deberían funcionar

// 3. Next.js Image optimization
import Image from 'next/image';

// Asegurar que src es URL válida
<Image src={producto.imagenes[0].url} alt="..." width={300} height={300} />
```

---

### Error: "npm ERR! 404 Not Found"

```bash
# Dependencia no existe o estás offline

# Solucionar
npm install         # Reinstalar
npm cache clean --force
npm install

# O cambiar registry
npm config set registry https://registry.npmjs.org/
```

---

## Base de Datos

### Error: "relation 'usuario' does not exist"

```bash
# Migraciones no ejecutadas
npx prisma migrate deploy

# O para desarrollo
npx prisma migrate dev
```

---

### Error: "Database connection timeout"

```bash
# 1. Neon puede estar reiniciando
# Ver: https://neon.tech/console

# 2. Firewall bloquea conexión
# Whitelist tu IP

# 3. Conexión string incorrecta
# Verificar DATABASE_URL
```

---

### Queries lentas en Producción

```javascript
// Agregar índices en schema.prisma
model Usuario {
  // ...
  @@index([email])
  @@index([activo])
}

// Luego migrar
npx prisma migrate dev --name agregar_indices
```

---

## Desarrollo

### Servidor reinicia en bucle infinito

**Causa:** Código tiene error de sintaxis

**Solucionar:**
- Revisar terminal por errores específicos
- Comentar secciones hasta encontrar el culpable
- Usar `npm run dev` sin `--watch` para ver errores

---

### Git conflictos en merge

```bash
# Marca archivos como resueltos
git add <archivo>
git commit -m "resolve: conflicto merge"
git push
```

---

### .env no se carga

```bash
# 1. Archivo se llama .env (no .env.local en Node)
ls -la | grep env

# 2. Requiere restart
npm run dev

# 3. Valores con espacios necesitan comillas
FRONTEND_URL="http://localhost:3000"
```

---

## Integración Externa

### Error: "Cloudinary upload failed"

```javascript
// Verificar en .env
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

// En producción, agregar en plataforma hosting
```

---

### Error: "Mercado Pago no procesa pago"

```
1. Verificar modo test en Mercado Pago
2. Usar tarjeta de prueba: 4111 1111 1111 1111
3. Verificar que ACCESS_TOKEN es de sandbox
4. Webhook configurado correctamente
```

---

### Error: "Resend email no envía"

```javascript
// Verificar API Key
RESEND_API_KEY=xxx

// Verificar email FROM está verificado en Resend
RESEND_FROM_EMAIL=noreply@tu-dominio.com

// No funciona con dominios personalizados sin verificar
```

---

## Tabla de Referencia Rápida

| Problema | Comando | Esperar |
|----------|---------|---------|
| Puerto en uso | `lsof -i :4000` | 5s |
| Deps faltantes | `npm install` | 30s |
| Migraciones | `npx prisma migrate dev` | 10s |
| Cache Next.js | `rm -rf .next` | 5s |
| BD reseteada | `npx prisma db seed` | 15s |

---

## Contacto para Ayuda

- **Backend issues:** @backend-lead
- **Frontend issues:** @frontend-lead
- **Database issues:** @devops
- **General:** #desarrollo-support

---

## Logging para Debugging

### Backend

```javascript
// Agregar en controladores
console.log('Entrada:', req.body);
console.log('Usuario:', req.user);
console.error('Error:', error);

// Mejor con logger
const log = require('@/lib/logger');
log.info('Usuario logueado:', usuario.id);
log.error('Error en pago:', error);
```

### Frontend

```javascript
// Usar React DevTools
// Chrome Extension: React Developer Tools

// Zustand DevTools
// Inspecciona estado en tiempo real

// Network tab de DevTools
// Ver requests/responses
```

---

**Tiempo de lectura:** 20 minutos
**Nivel:** Todo el equipo

Próxima lectura → [13_VARIABLES_ENTORNO.md](./13_VARIABLES_ENTORNO.md)
