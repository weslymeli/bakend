# 📁 Estructura de Carpetas y Convenciones

## Árbol Completo del Proyecto

```
proyecto-oni-style/
│
├── 📄 server.js                          # Archivo principal del backend
├── 📄 package.json                       # Dependencias Node.js
├── 📄 package-lock.json                  # Lock de versiones
├── 📄 tsconfig.json                      # Configuración TypeScript
├── 📄 .env                               # Variables de entorno (NO commitar)
├── 📄 .env.example                       # Template de .env
├── 📄 .gitignore                         # Archivos ignorados por git
├── 📄 README.md                          # README del proyecto
│
├── 📂 prisma/                            # ORM y Base de Datos
│   ├── 📄 schema.prisma                  # Esquema de BD (modelos)
│   └── 📂 migrations/                    # Historial de migraciones
│       ├── migration_lock.toml           # Lock de migraciones
│       └── 20260507010723_inicio/        # Ejemplo de migración
│
├── 📂 src/                               # Código fuente backend
│   │
│   ├── 📂 controllers/                   # Lógica de negocio
│   │   ├── 📄 auth.controller.js         # Autenticación
│   │   ├── 📄 product.controller.js      # Productos públicos
│   │   ├── 📄 adminProducts.controller.js # Gestión de productos
│   │   ├── 📄 cart.controller.js         # Carrito de compras
│   │   ├── 📄 order.controller.js        # Órdenes de compra
│   │   ├── 📄 payment.controller.js      # Procesamiento de pagos
│   │   ├── 📄 admin.controller.js        # Pedidos y usuarios (admin)
│   │   ├── 📄 user.controller.js         # Perfil de usuario
│   │   ├── 📄 chat.controller.js         # Chat en tiempo real
│   │   ├── 📄 newsletter.controller.js   # Email marketing
│   │   └── 📄 referral.controller.js     # Sistema de referidos
│   │
│   ├── 📂 routes/                        # Definición de rutas API
│   │   ├── 📄 auth.routes.js
│   │   ├── 📄 product.routes.js
│   │   ├── 📄 adminProducts.routes.js
│   │   ├── 📄 cart.routes.js
│   │   ├── 📄 order.routes.js
│   │   ├── 📄 payment.routes.js
│   │   ├── 📄 admin.routes.js
│   │   ├── 📄 user.routes.js
│   │   ├── 📄 chat.routes.js
│   │   ├── 📄 newsletter.routes.js
│   │   └── 📄 referral.routes.js
│   │
│   ├── 📂 middlewares/                   # Funciones intermedias
│   │   └── 📄 auth.middleware.js         # Verificación de JWT
│   │
│   └── 📂 lib/                           # Utilidades y configuraciones
│       ├── 📄 prisma.js                  # Instancia de Prisma
│       └── 📄 colombia.js                # Datos de departamentos/ciudades
│
├── 📂 oni-style-frontend/                # Aplicación Next.js
│   │
│   ├── 📄 package.json                   # Dependencias frontend
│   ├── 📄 next.config.mjs                # Configuración Next.js
│   ├── 📄 jsconfig.json                  # Alias de imports
│   ├── 📄 tailwind.config.js             # Configuración Tailwind
│   ├── 📄 postcss.config.mjs             # PostCSS config
│   │
│   ├── 📂 app/                           # App Router (Next.js 13+)
│   │   ├── 📄 layout.js                  # Layout global
│   │   ├── 📄 page.js                    # Página inicio
│   │   ├── 📄 globals.css                # Estilos globales
│   │   │
│   │   ├── 📂 admin/                     # Panel administrativo
│   │   │   └── 📄 page.js                # /admin
│   │   │
│   │   ├── 📂 auth/                      # Autenticación
│   │   │   └── 📄 page.js                # /auth/login
│   │   │
│   │   ├── 📂 productos/                 # Catálogo público
│   │   │   ├── 📄 page.js                # /productos
│   │   │   └── 📂 [slug]/                # /productos/nombre-producto
│   │   │       └── 📄 page.js
│   │   │
│   │   ├── 📂 carrito/
│   │   │   └── 📄 page.js                # /carrito
│   │   │
│   │   ├── 📂 pago/
│   │   │   ├── 📂 exitoso/               # /pago/exitoso
│   │   │   └── 📂 fallido/               # /pago/fallido
│   │   │
│   │   ├── 📂 perfil/
│   │   │   └── 📄 page.js                # /perfil (Mi cuenta)
│   │   │
│   │   ├── 📂 rastrear-pedido/
│   │   │   ├── 📄 page.js                # /rastrear-pedido
│   │   │   └── 📄 [id].js                # /rastrear-pedido/123
│   │   │
│   │   └── 📂 [rutas estáticas]/
│   │       ├── 📂 sobre-nosotros/
│   │       ├── 📂 sostenibilidad/
│   │       ├── 📂 preguntas-frecuentes/
│   │       ├── 📂 guia-tallas/
│   │       ├── 📂 trabaja-con-nosotros/
│   │       ├── 📂 colaboraciones/
│   │       ├── 📂 prensa/
│   │       └── 📂 proximamente/
│   │
│   ├── 📂 components/                    # Componentes React reutilizables
│   │   │
│   │   ├── 📂 layout/
│   │   │   ├── 📄 Navbar.jsx             # Barra de navegación
│   │   │   └── 📄 Footer.jsx             # Pie de página
│   │   │
│   │   ├── 📂 home/
│   │   │   ├── 📄 hero.jsx               # Sección hero
│   │   │   ├── 📄 HeroCarousel.jsx       # Carrusel de hero
│   │   │   ├── 📄 CategoryGrid.jsx       # Grid de categorías
│   │   │   ├── 📄 ProductsSection.jsx    # Sección de productos
│   │   │   ├── 📄 Features.jsx           # Características
│   │   │   └── 📄 PromoBanner.jsx        # Banner promocional
│   │   │
│   │   ├── 📂 products/
│   │   │   ├── 📄 ProductCard.jsx        # Tarjeta de producto
│   │   │   ├── 📄 FilterDrawer.jsx       # Panel de filtros
│   │   │   ├── 📄 RelatedProducts.jsx    # Productos relacionados
│   │   │   └── 📄 MisResenas.jsx         # Reseñas de usuario
│   │   │
│   │   ├── 📂 cart/
│   │   │   └── 📄 CartDrawer.jsx         # Sidebar del carrito
│   │   │
│   │   ├── 📂 admin/
│   │   │   └── 📄 ProductForm.jsx        # Formulario crear/editar producto
│   │   │
│   │   ├── 📂 chat/
│   │   │   └── 📄 ChatWidget.jsx         # Widget de chat
│   │   │
│   │   ├── 📂 auth/
│   │   │   ├── 📄 LoginForm.jsx
│   │   │   └── 📄 RegisterForm.jsx
│   │   │
│   │   └── 📂 ui/
│   │       ├── 📄 Button.jsx             # Componente botón
│   │       ├── 📄 Badge.jsx              # Componente badge
│   │       ├── 📄 Modal.jsx
│   │       ├── 📄 AvatarUpload.jsx       # Upload de avatar
│   │       └── ... (otros componentes UI)
│   │
│   ├── 📂 lib/                           # Utilidades frontend
│   │   ├── 📄 axios.js                   # Cliente HTTP configurado
│   │   └── 📄 colombia.js                # Datos Colombia (ciudades)
│   │
│   └── 📂 store/                         # Zustand state management
│       ├── 📄 useAuthStore.js            # Estado de autenticación
│       ├── 📄 useCartStore.js            # Estado del carrito
│       └── 📄 useWishlistStore.js        # Estado del wishlist
│
├── 📂 tests/                             # Tests unitarios
│   └── 📄 chat-controller.test.js        # Ejemplo de test
│
├── 📂 docs/                              # 📌 Esta documentación
│   ├── 📄 00_README.md                   # Overview
│   ├── 📄 01_INSTALACION.md              # Setup
│   ├── 📄 02_ARQUITECTURA.md             # Diseño técnico
│   ├── 📄 03_ESTRUCTURA_CARPETAS.md      # (Este archivo)
│   ├── 📄 04_DATABASE.md
│   ├── 📄 05_API_ENDPOINTS.md
│   ├── 📄 06_AUTENTICACION.md
│   ├── 📄 07_FRONTEND_GUIDE.md
│   ├── 📄 08_ESTADO_GLOBAL.md
│   ├── 📄 09_CONVENCIONES.md
│   ├── 📄 10_GUIA_CONTRIBUCION.md
│   ├── 📄 11_DEPLOYMENT.md
│   ├── 📄 12_TROUBLESHOOTING.md
│   └── 📄 13_VARIABLES_ENTORNO.md
│
└── 📄 conector a neon.txt                # Instrucciones conexión BD
```

---

## Descripción por Carpeta

### 🔧 Root Level (`/`)

| Archivo | Propósito |
|---------|-----------|
| `server.js` | Punto de entrada del backend Express |
| `package.json` | Dependencias del backend |
| `.env` | Variables de entorno (secreto, no en git) |
| `.gitignore` | Archivos que git ignora |

### 📊 Prisma (`/prisma`)

```
prisma/
├── schema.prisma        # Defines all database models
└── migrations/          # Version control for database changes
    ├── migration_lock.toml
    └── 20260507010723_inicial/
        ├── migration.sql
        └── migration_lock.toml
```

**Uso:**
```bash
npx prisma migrate dev --name nombre_cambio
npx prisma generate
npx prisma studio  # GUI para BD
```

### 🎮 Controllers (`/src/controllers`)

**Propósito:** Lógica de negocio por feature

**Convención de nombres:**
```javascript
// auth.controller.js
const register = async (req, res) => { ... }
const login = async (req, res) => { ... }
const logout = async (req, res) => { ... }

module.exports = { register, login, logout };
```

**Responsabilidades:**
- Validar entrada
- Consultar BD (Prisma)
- Llamar servicios externos
- Formatear respuesta
- Manejo de errores

### 🛣️ Routes (`/src/routes`)

**Propósito:** Definir endpoints y aplicar middlewares

**Patrón:**
```javascript
const express = require("express");
const router = express.Router();
const { verificarToken, soloAdmin } = require("../middlewares/auth.middleware");
const { listarProductos, crearProducto } = require("../controllers/product.controller");

// Rutas públicas
router.get("/", listarProductos);

// Rutas protegidas
router.post("/", verificarToken, soloAdmin, crearProducto);

module.exports = router;
```

### 🔐 Middlewares (`/src/middlewares`)

**Propósito:** Funciones que interceptan requests

**Ejemplo:**
```javascript
// auth.middleware.js
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};
```

### 📚 Lib (`/src/lib`)

**Propósito:** Configuraciones y utilidades compartidas

- `prisma.js` - Instancia del ORM
- `colombia.js` - Datos estáticos (departamentos, ciudades)
- `cloudinary.js` - Cliente Cloudinary (si se crea)

### 🎨 Frontend App (`/oni-style-frontend/app`)

**Patrón:** Next.js App Router

```
app/
├── layout.js           # Layout principal (HTML, nav, footer)
├── page.js             # Página principal /
├── globals.css         # Estilos globales
└── [ruta]/
    └── page.js         # Página de esa ruta
```

**Ejemplo:**
```javascript
// app/productos/[slug]/page.js
export default function ProductPage({ params }) {
  const { slug } = params;
  // Componente de producto
}
```

### 🧩 Components (`/oni-style-frontend/components`)

**Organización por features:**
```
components/
├── layout/          # Navbar, Footer (global)
├── home/            # Componentes de homepage
├── products/        # Componentes de catálogo
├── cart/            # Componentes del carrito
├── admin/           # Componentes de admin
├── auth/            # Componentes de autenticación
├── chat/            # Chat widget
└── ui/              # Componentes reutilizables (Button, Modal, etc)
```

**Convención:**
```javascript
// components/products/ProductCard.jsx
export default function ProductCard({ product }) {
  return <div>...</div>;
}
```

### 📦 Store (`/oni-style-frontend/store`)

**Gestión de estado global con Zustand:**

```javascript
// store/useAuthStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  usuario: null,
  token: null,
  setUsuario: (usuario) => set({ usuario }),
  logout: () => set({ usuario: null, token: null }),
}));

export default useAuthStore;
```

### 📖 Lib Frontend (`/oni-style-frontend/lib`)

**Configuraciones frontend:**
```
lib/
├── axios.js        # Cliente HTTP con interceptores
└── colombia.js     # Datos de departamentos/ciudades
```

---

## Convenciones de Nombrado

### Archivos

```
Controllers:      productController.js o product.controller.js
Routes:           productRoutes.js o product.routes.js
Componentes:      ProductCard.jsx (PascalCase)
Utilidades:       colombiaUtils.js (camelCase)
Hooks:            useAuthStore.js (camelCase con use prefix)
```

### Variables y Funciones

```javascript
// ✅ Funciones
const obtenerProducto = () => { }
const validarEmail = (email) => { }

// ✅ Variables
const usuarioActual = null;
const productosActivos = [];

// ✅ Constantes
const ITEMS_POR_PAGINA = 10;
const PRECIO_MINIMO = 50000;

// ✅ Booleanas
const estaAutenticado = true;
const puedeEditar = false;
```

### Componentes React

```javascript
// ✅ Nombre descriptivo
export default function ProductCard({ product }) {
  return <div>...</div>;
}

// ✅ Props con tipos (comentario)
function Button({ label, onClick, disabled }) {
  // label: string
  // onClick: function
  // disabled: boolean
  return <button disabled={disabled} onClick={onClick}>{label}</button>;
}
```

---

## Relación Entre Carpetas

```
Request HTTP
    ↓
server.js (punto de entrada)
    ↓
routes/adminProducts.routes.js
    ├─ Middlewares (auth.middleware.js)
    └─ Controllers (adminProducts.controller.js)
        ├─ Prisma (lib/prisma.js)
        └─ Servicios externos (Cloudinary, etc)
```

---

**Tiempo de lectura:** 15 minutos
**Nivel:** Developer/Architect

Próxima lectura → [04_DATABASE.md](./04_DATABASE.md)
