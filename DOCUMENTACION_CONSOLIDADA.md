# 📘 DOCUMENTACIÓN COMPLETA CONSOLIDADA - Oni Style

> **ESTE ARCHIVO CONTIENE TODO LO IMPORTANTE EN UN SOLO LUGAR PARA COPIAR Y PEGAR**

---

## TABLA DE CONTENIDOS RÁPIDA

```
1. RESUMEN DE CAMBIOS CORS FIX
2. REQUISITOS MÍNIMOS DEL PROYECTO
3. STACK TECNOLÓGICO COMPLETO
4. INSTALACIÓN PASO A PASO
5. ESTRUCTURA DE CARPETAS
6. VARIABLES DE ENTORNO (.env)
7. MODELOS DE BASE DE DATOS
8. ENDPOINTS API PRINCIPALES
9. AUTENTICACIÓN Y SEGURIDAD
10. COMPONENTES FRONTEND PRINCIPALES
11. CONVENCIONES DE CÓDIGO
12. TROUBLESHOOTING RÁPIDO
```

---

## 1. RESUMEN DE CAMBIOS CORS FIX

### ✅ PROBLEMA RESUELTO
**Error:** `CORS error en /api/admin/products - No 'Access-Control-Allow-Origin' header`
**Causa:** Middleware CORS registrado DESPUÉS de las rutas (Express ejecuta primero lo registrado primero)
**Solución:** Mover CORS middleware ANTES de las rutas

### ARCHIVO MODIFICADO: server.js

**ANTES (INCORRECTO):**
```javascript
// Línea 16-19: CORS después de rutas (❌ MAL)
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// Línea 40-50: CORS después
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
```

**DESPUÉS (CORRECTO):**
```javascript
// Línea 15-17: CORS PRIMERO (✅ BIEN)
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// LUEGO rutas (orden importa: específico primero)
app.use("/api/admin/products", adminProductsRoutes);  // Específico
app.use("/api/admin", adminRoutes);                    // Genérico
```

### ARCHIVO MODIFICADO: app/admin/page.js

**CAMBIO 1:** Agregado estado faltante
```javascript
// Línea 26: AGREGAR estado
const [productos, setProductos] = useState([]);

// Ahora la destructuración completa es:
const [tab, pedidos, usuarios, productos, listo, mostrarForm] = useState([...]);
```

**CAMBIO 2:** Mover table de productos fuera de usuarios
```javascript
// ANTES: Tabla de productos DENTRO de <thead> de usuarios
<table>
  <thead>
    {/* Productos table AQUÍ ❌ */}
  </thead>
</table>

// DESPUÉS: Tabla de productos en su propia sección
{tab === 'usuarios' && <UserTable />}
{tab === 'productos' && <ProductTable />}  // Separado ✅
```

---

## 2. REQUISITOS MÍNIMOS DEL PROYECTO

### Sistema Operativo
- Windows 10+, macOS 11+, o Linux (Ubuntu 20+)

### Software Obligatorio
```
Node.js      : v18.0.0 o superior
npm          : v9.0.0 o superior
Git          : Última versión
```

### Verificar versión
```bash
node --version      # Debe ser v18+
npm --version       # Debe ser v9+
git --version       # Debe tener instalado
```

### Cuentas Necesarias (Crear ANTES de instalar)
1. **Neon.tech** - Para base de datos PostgreSQL
2. **Cloudinary** - Para almacenar imágenes
3. **Mercado Pago** - Para pagos (sandbox primero)
4. **Resend** - Para enviar emails
5. **Groq** - Para chatbot IA

---

## 3. STACK TECNOLÓGICO COMPLETO

### Backend
```
Runtime       : Node.js 18+
Framework     : Express 4.22.2
Database      : PostgreSQL 15 (Neon Cloud)
ORM           : Prisma 7.8.0
Authentication: JWT (jsonwebtoken 9.0.3)
Password Hash : bcryptjs 2.4.3
File Upload   : Multer 2.3.0
Cloud Storage : Cloudinary 2.10.0
WebSocket     : Socket.io 4.8.3
Validation    : Joi (optional)
Logging       : Winston (recommended)
```

### Frontend
```
Framework     : Next.js 14+
UI Library    : React 18+
State Manager : Zustand 4.3+
HTTP Client   : Axios 1.6+
CSS Framework : Tailwind CSS 3+
Animations    : Framer Motion 10+
Notifications : Sonner 0.7+
Icons         : React Icons 4+
Date Utils    : date-fns 2.30+
```

### Integraciones
```
Pagos         : Mercado Pago SDK
Emails        : Resend 3.0+
IA Chatbot    : Groq SDK
Imágenes      : Cloudinary API
Chat Real     : Socket.io
```

---

## 4. INSTALACIÓN PASO A PASO

### PASO 1: Preparación (5 minutos)

```bash
# 1. Clonar repositorio
git clone <url-repositorio>
cd proyecto-oni-style

# 2. Verificar versiones
node --version    # Debe ser v18+
npm --version     # Debe ser v9+
```

### PASO 2: Instalar Dependencias Backend (10 minutos)

```bash
# En raíz del proyecto
npm install

# Verificar que se instalaron todas las dependencias
npm ls | head -20
```

### PASO 3: Instalar Dependencias Frontend (10 minutos)

```bash
# Ir a carpeta frontend
cd oni-style-frontend

# Instalar
npm install

# Volver a raíz
cd ..
```

### PASO 4: Configurar .env (5 minutos)

**En raíz del proyecto, crear archivo `.env`:**

```env
# BASE DE DATOS
DATABASE_URL=postgresql://usuario:password@ep-xxx.neon.tech:5432/nombre?sslmode=require

# JWT
JWT_SECRET=abc123xyz789def456ghi789jkl012mno345pqr678stu901vwx234yz567abc

# SERVIDOR
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# CLOUDINARY
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# MERCADO PAGO (Sandbox para desarrollo)
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890abcdefghijk

# RESEND
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@onstyle.com

# GROQ
GROQ_API_KEY=gsk_xxx

# FRONTEND (en oni-style-frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### PASO 5: Setup Base de Datos (5 minutos)

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Seed de datos de prueba
npx prisma db seed
```

### PASO 6: Iniciar Desarrollo (2 minutos)

**Terminal 1 - Backend:**
```bash
npm run dev
# Debe mostrar: "Servidor Oni Style corriendo en http://localhost:4000"
```

**Terminal 2 - Frontend:**
```bash
cd oni-style-frontend
npm run dev
# Debe mostrar: "Local:        http://localhost:3000"
```

### PASO 7: Verificar Todo Funciona

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Login de prueba: `admin@example.com / password123`

---

## 5. ESTRUCTURA DE CARPETAS

```
proyecto-oni-style/
│
├── src/                        # 🔌 Backend
│   ├── controllers/            # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── admin.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   ├── chat.controller.js
│   │   ├── user.controller.js
│   │   ├── newsletter.controller.js
│   │   ├── referral.controller.js
│   │   └── adminProducts.controller.js
│   │
│   ├── routes/                 # Rutas API
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── admin.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── chat.routes.js
│   │   ├── user.routes.js
│   │   ├── newsletter.routes.js
│   │   ├── referral.routes.js
│   │   └── adminProducts.routes.js
│   │
│   ├── middlewares/            # Middleware
│   │   └── auth.middleware.js  # JWT, soloAdmin
│   │
│   └── lib/
│       └── prisma.js           # Instancia Prisma
│
├── prisma/                     # 💾 ORM
│   ├── schema.prisma           # Modelos BD
│   └── migrations/             # Historial cambios
│
├── oni-style-frontend/         # 🎨 Frontend
│   ├── app/                    # App Router Next.js
│   │   ├── layout.js           # HTML base
│   │   ├── page.js             # Home
│   │   ├── globals.css         # Estilos globales
│   │   ├── admin/
│   │   │   └── page.js         # Panel admin
│   │   ├── auth/
│   │   │   └── page.js         # Login/Registro
│   │   ├── productos/
│   │   │   ├── page.js         # Catálogo
│   │   │   └── [slug]/
│   │   │       └── page.js     # Detalle producto
│   │   ├── carrito/
│   │   │   └── page.js         # Mi carrito
│   │   ├── perfil/
│   │   │   └── page.js         # Cuenta usuario
│   │   └── [otras-rutas]/
│   │
│   ├── components/             # Componentes React
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── products/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── FilterDrawer.jsx
│   │   │   ├── RelatedProducts.jsx
│   │   │   └── MisResenas.jsx
│   │   ├── cart/
│   │   │   └── CartDrawer.jsx
│   │   ├── admin/
│   │   │   └── ProductForm.jsx
│   │   ├── chat/
│   │   │   └── ChatWidget.jsx
│   │   ├── home/
│   │   │   ├── HeroCarousel.jsx
│   │   │   ├── CategoryGrid.jsx
│   │   │   ├── ProductsSection.jsx
│   │   │   ├── Features.jsx
│   │   │   └── PromoBanner.jsx
│   │   ├── auth/
│   │   │   └── [componentes auth]
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       ├── Badge.jsx
│   │       ├── AvatarUpload.jsx
│   │       └── [otros UI]
│   │
│   ├── store/                  # Zustand Stores
│   │   ├── useAuthStore.js     # Autenticación
│   │   ├── useCartStore.js     # Carrito
│   │   └── useWishlistStore.js # Deseos
│   │
│   ├── lib/                    # Utilidades
│   │   ├── axios.js            # Cliente HTTP configurado
│   │   └── colombia.js         # Datos Colombia
│   │
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   ├── jsconfig.json
│   └── postcss.config.mjs
│
├── tests/                      # Tests
│   └── chat-controller.test.js
│
├── docs/                       # 📚 Documentación
│   ├── INDEX.md
│   ├── 00_README.md
│   ├── 01_INSTALACION.md
│   ├── 02_ARQUITECTURA.md
│   ├── 03_ESTRUCTURA_CARPETAS.md
│   ├── 04_DATABASE.md
│   ├── 05_API_ENDPOINTS.md
│   ├── 06_AUTENTICACION.md
│   ├── 07_FRONTEND_GUIDE.md
│   ├── 08_ESTADO_GLOBAL.md
│   ├── 09_CONVENCIONES.md
│   ├── 10_GUIA_CONTRIBUCION.md
│   ├── 11_DEPLOYMENT.md
│   ├── 12_TROUBLESHOOTING.md
│   └── 13_VARIABLES_ENTORNO.md
│
├── package.json                # Dependencias backend
├── server.js                   # 🔴 Punto entrada backend
├── tsconfig.json
├── prisma.config.ts            # (Deprecated, usar prisma/schema.prisma)
├── .env                        # ⚠️ NO COMMITAR
├── .env.example                # ✅ Commitar
├── .gitignore
└── README.md
```

---

## 6. VARIABLES DE ENTORNO (.env)

### Obtener DATABASE_URL

1. Ir a https://neon.tech
2. Dashboard → Connection string
3. Copiar string completo
4. Pegar en DATABASE_URL

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech:5432/dbname?sslmode=require
```

### Generar JWT_SECRET

```bash
# macOS/Linux
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Obtener CLOUDINARY

1. https://cloudinary.com/console → Login
2. Settings → API Keys
3. Copiar: Cloud Name, API Key, API Secret

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefg123456
```

### Obtener MERCADO PAGO

1. https://www.mercadopago.com.co/settings/account/credentials
2. Copiar Access Token de SANDBOX

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890abcdef
```

### Obtener RESEND

1. https://resend.com → Dashboard
2. API Keys → Create
3. Copiar token

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@onstyle.com
```

### Obtener GROQ

1. https://groq.com → Sign In
2. API Keys → Create
3. Copiar

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxx
```

---

## 7. MODELOS DE BASE DE DATOS

### Usuario
```prisma
model Usuario {
  id            Int     @id @default(autoincrement())
  nombre        String
  email         String  @unique
  password      String  // Hasheada con bcrypt
  rol           String  @default("cliente")  // "cliente" o "administrador"
  telefono      String?
  activo        Boolean @default(true)
  creadoEn      DateTime @default(now())
  
  // Relaciones
  pedidos       Pedido[]
  direcciones   Dirección[]
  carritoItems  CarritoItem[]
  mensajes      MensajeChat[]
  resenas       Resena[]
  referidos     Referido[] @relation("referente")
  referidoPor   Referido? @relation("referido", fields: [referidoDesdeId], references: [id])
  referidoDesdeId Int?
  
  @@map("usuario")
}
```

### Producto
```prisma
model Producto {
  id           Int     @id @default(autoincrement())
  nombre       String
  descripcion  String?
  precio       Float
  descuento    Float?
  destacado    Boolean @default(false)
  activo       Boolean @default(true)
  slug         String  @unique
  creadoEn     DateTime @default(now())
  
  // Foreign keys
  categoriaId  Int
  subcategoriaId Int?
  
  // Relaciones
  categoria    Categoría @relation(fields: [categoriaId], references: [id])
  subcategoria SubCategoría? @relation(fields: [subcategoriaId], references: [id])
  tallas       Talla[]
  imagenes     ImagenProducto[]
  carritoItems CarritoItem[]
  pedidoItems  PedidoItem[]
  resenas      Resena[]
  
  @@map("producto")
}
```

### Talla
```prisma
model Talla {
  id           Int     @id @default(autoincrement())
  nombre       String  // "XS", "S", "M", "L", "XL"
  productoId   Int
  
  // Relaciones
  producto     Producto @relation(fields: [productoId], references: [id], onDelete: Cascade)
  inventarios  Inventario[]
  
  @@unique([productoId, nombre])
  @@map("talla")
}
```

### Inventario
```prisma
model Inventario {
  productoId   Int
  tallaId      Int
  cantidad     Int     @default(0)
  
  // Relaciones
  producto     Producto @relation(fields: [productoId], references: [id], onDelete: Cascade)
  talla        Talla @relation(fields: [tallaId], references: [id], onDelete: Cascade)
  
  @@id([productoId, tallaId])
  @@map("inventario")
}
```

### Carrito
```prisma
model CarritoItem {
  id           Int     @id @default(autoincrement())
  cantidad     Int
  precioUnitario Float
  
  // Foreign keys
  usuarioId    Int
  productoId   Int
  tallaId      Int
  
  // Relaciones
  usuario      Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  producto     Producto @relation(fields: [productoId], references: [id])
  
  @@unique([usuarioId, productoId, tallaId])
  @@map("carrito_item")
}
```

### Pedido
```prisma
model Pedido {
  id           Int     @id @default(autoincrement())
  numero       String  @unique
  estado       String  @default("pendiente")  // "pendiente", "pagado", "enviado", "entregado"
  total        Float
  metodoPago   String  // "mercadopago", "transferencia"
  
  // Foreign keys
  usuarioId    Int
  direccionId  Int
  
  // Relaciones
  usuario      Usuario @relation(fields: [usuarioId], references: [id])
  direccion    Dirección @relation(fields: [direccionId], references: [id])
  items        PedidoItem[]
  
  creadoEn     DateTime @default(now())
  @@map("pedido")
}
```

### Más modelos disponibles en `prisma/schema.prisma`:
- `Categoría`
- `SubCategoría`
- `ImagenProducto`
- `PedidoItem`
- `Dirección`
- `MensajeChat`
- `Suscriptor`
- `Referido`
- `Resena`

---

## 8. ENDPOINTS API PRINCIPALES

### Autenticación

```
POST   /api/auth/register
Body: { nombre, email, password }
Response: { usuario, token }

POST   /api/auth/login
Body: { email, password }
Response: { usuario, token }
```

### Productos

```
GET    /api/products
Query: ?categoria=1&minPrecio=0&maxPrecio=500000&pagina=1&limite=10
Response: { productos: [], total, paginas }

GET    /api/products/:slug
Response: { producto }

GET    /api/products/:id/resenas
Response: { resenas: [] }
```

### Carrito

```
GET    /api/cart
Response: { items: [], total }

POST   /api/cart
Body: { productoId, tallaId, cantidad }

PATCH  /api/cart/:itemId
Body: { cantidad }

DELETE /api/cart/:itemId
```

### Pedidos

```
GET    /api/orders
Response: { pedidos: [] }

POST   /api/orders
Body: { items, direccionId, metodoPago }
Response: { pedido }

GET    /api/orders/:id
Response: { pedido }
```

### Admin (Requiere rol "administrador")

```
GET    /api/admin/products
Response: { productos: [] }

POST   /api/admin/products
Body: FormData {nombre, precio, imagenes[], tallas[], inventarios[]}

PATCH  /api/admin/products/:id
Body: {nombre, precio, ...}

DELETE /api/admin/products/:id

PATCH  /api/admin/products/stock/:tallaId
Body: {cantidad}
```

### Chat

```
GET    /api/chat/historial
Response: { mensajes: [] }

POST   /api/chat/enviar
Body: {mensaje}
```

---

## 9. AUTENTICACIÓN Y SEGURIDAD

### Flujo Login

1. Usuario envía `email + password`
2. Backend compara `password` con hash en BD
3. Si correcto, genera `JWT` con datos del usuario
4. Frontend guarda token en `localStorage`
5. Futuras requests incluyen header: `Authorization: Bearer <TOKEN>`
6. Backend verifica token en middleware `verificarToken`

### Middleware de Protección

```javascript
// src/middlewares/auth.middleware.js

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.user?.rol !== "administrador") {
    return res.status(403).json({ error: "Solo administradores" });
  }
  next();
};
```

### Uso en Rutas

```javascript
// ✅ Solo autenticados
router.get("/ordenes", verificarToken, obtenerOrdenes);

// ✅ Solo administradores
router.post("/productos", verificarToken, soloAdmin, crearProducto);
```

### Contraseña Hasheada

```javascript
const bcryptjs = require("bcryptjs");

// Guardar
const salt = await bcryptjs.genSalt(10);
const passwordHasheada = await bcryptjs.hash(password, salt);

// Verificar
const esValida = await bcryptjs.compare(passwordIngresada, passwordHasheada);
```

---

## 10. COMPONENTES FRONTEND PRINCIPALES

### Navbar

```javascript
// components/layout/Navbar.jsx
'use client';
import useAuthStore from '@/store/useAuthStore';

export default function Navbar() {
  const { estaLogueado, usuario, logout } = useAuthStore();
  
  return (
    <nav className="bg-black text-white">
      <div className="flex justify-between items-center p-4">
        <span className="font-bold">ONI Style</span>
        {estaLogueado ? (
          <>
            <span>Hola, {usuario?.nombre}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <a href="/auth/login">Login</a>
        )}
      </div>
    </nav>
  );
}
```

### ProductCard

```javascript
// components/products/ProductCard.jsx
'use client';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/useCartStore';

export default function ProductCard({ producto }) {
  const router = useRouter();
  const agregarAlCarrito = useCartStore((s) => s.agregarAlCarrito);
  
  const handleClick = () => {
    router.push(`/productos/${producto.slug}`);
  };
  
  return (
    <div className="border p-4 cursor-pointer" onClick={handleClick}>
      <img src={producto.imagenes?.[0]?.url} alt={producto.nombre} />
      <h3 className="font-bold">{producto.nombre}</h3>
      <p className="text-2xl">${producto.precio}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          agregarAlCarrito(producto.id, producto.tallas[0]?.id, 1);
        }}
        className="bg-black text-white w-full py-2 mt-2"
      >
        Agregar al Carrito
      </button>
    </div>
  );
}
```

### useAuthStore

```javascript
// store/useAuthStore.js
import { create } from 'zustand';
import api from '@/lib/axios';

const useAuthStore = create((set) => ({
  usuario: null,
  token: null,
  estaLogueado: false,
  
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { usuario, token } = res.data;
      
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('token', token);
      
      set({ usuario, token, estaLogueado: true });
      return true;
    } catch (error) {
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    set({ usuario: null, token: null, estaLogueado: false });
  },
}));
```

---

## 11. CONVENCIONES DE CÓDIGO

### Variables

```javascript
✅ BIEN:
const usuarioActual = null;
const precioTotal = 0;
const estaAutenticado = true;
const MAX_INTENTOS = 5;
const obtenerProducto = () => { };

❌ MAL:
const user = null;
const price = 0;
const auth = true;
const maxintentts = 5;
const get = () => { };
```

### Componentes React

```javascript
✅ BIEN:
export default function ProductCard({ producto }) {
  // Estado
  const [cantidad, setCantidad] = useState(1);
  
  // Effects
  useEffect(() => {
    // lógica
  }, []);
  
  // Handlers
  const handleAgregar = () => { };
  
  // Render
  return <div>...</div>;
}

❌ MAL:
function Pc({p}) {
  const [qty,setQty]=(s)=>{};
  return <></>;
}
```

### Commits Git

```
✅ BIEN:
git commit -m "feat: agregar sistema de referidos"
git commit -m "fix: corregir error CORS en /api/admin/products"
git commit -m "docs: actualizar README"

❌ MAL:
git commit -m "cambios"
git commit -m "fix"
git commit -m "arreglar"
```

---

## 12. TROUBLESHOOTING RÁPIDO

### Error: "EADDRINUSE - Puerto en uso"
```bash
# Puerto 4000 está ocupado
lsof -i :4000
kill -9 <PID>
```

### Error: "Cannot connect to database"
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Si no existe .env, crear
cp .env.example .env
# Rellenar valores
```

### Error: "Token inválido"
```javascript
// Usuario debe hacer logout y login de nuevo
// O verificar que JWT_SECRET es igual en backend y frontend
```

### Error: "Imágenes no cargan"
```javascript
// 1. Verificar que Cloudinary tiene las imágenes
// 2. Verificar que URLs de Cloudinary en DB son correctas
// 3. Revisar credentials de Cloudinary
```

### Error: "Cannot find module"
```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

### Error: "npm ERR! 404 Not Found"
```bash
npm cache clean --force
npm install
```

---

## ✅ CHECKLIST INICIAL

- [ ] Node.js v18+ instalado
- [ ] Dependencias instaladas (`npm install` en raíz y frontend)
- [ ] Archivo `.env` creado con todas las variables
- [ ] Base de datos conectada (DATABASE_URL válida)
- [ ] Migraciones ejecutadas (`npx prisma migrate deploy`)
- [ ] Backend corriendo (`npm run dev`)
- [ ] Frontend corriendo (`cd oni-style-frontend && npm run dev`)
- [ ] Puedes acceder a `http://localhost:3000`
- [ ] Login funciona con credenciales de prueba
- [ ] Admin panel carga correctamente

---

**DOCUMENTACIÓN COMPLETADA**

Esta documentación consolida **13 documentos profesionales** en un solo archivo copiable.

**Documentación completa disponible en:** `docs/` folder

**Índice maestro:** [docs/INDEX.md](./docs/INDEX.md)

---

**Última actualización:** Enero 2025  
**Versión:** 1.0  
**Mantenedor:** Equipo de Desarrollo  
**Próxima revisión:** Trimestral
