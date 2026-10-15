# 🏗️ Arquitectura del Sistema

## Diagrama Arquitectónico

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE NAVEGADOR                      │
│                   (localhost:3000)                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                    HTTP/HTTPS
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   FRONTEND NEXT.JS                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Pages (App Router)                                 │   │
│  │  ├── /admin          → Panel de administración      │   │
│  │  ├── /auth           → Login/Registro              │   │
│  │  ├── /productos      → Catálogo                    │   │
│  │  ├── /carrito        → Carrito de compras          │   │
│  │  ├── /pago           → Checkout                    │   │
│  │  └── /perfil         → Mi cuenta                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Componentes (React)                                │   │
│  │  ├── Navbar, Footer, ProductCard, AdminForm, etc   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Estado Global (Zustand)                            │   │
│  │  ├── useAuthStore    → Usuario, token              │   │
│  │  ├── useCartStore    → Items del carrito           │   │
│  │  └── useWishlistStore → Wishlist                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                     REST API
                   JSON/JWT Auth
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   BACKEND EXPRESS.JS                        │
│                 (localhost:4000)                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  MIDDLEWARES                                        │   │
│  │  ├── CORS       → Comunicación con frontend        │   │
│  │  ├── JWT Auth   → Verificación de tokens           │   │
│  │  ├── Multer     → Procesamiento de uploads         │   │
│  │  └── Body Parser → Parseo de JSON                  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  RUTAS API (10 módulos)                             │   │
│  │  ├── /api/auth         → Autenticación             │   │
│  │  ├── /api/products     → Catálogo público          │   │
│  │  ├── /api/cart         → Carrito                   │   │
│  │  ├── /api/orders       → Órdenes                   │   │
│  │  ├── /api/payments     → Pagos                     │   │
│  │  ├── /api/users        → Perfil de usuario         │   │
│  │  ├── /api/admin        → Panel admin               │   │
│  │  ├── /api/admin/products → Gestión de productos   │   │
│  │  ├── /api/chat         → Chat en tiempo real       │   │
│  │  ├── /api/newsletter   → Email marketing           │   │
│  │  └── /api/referrals    → Sistema de referidos      │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CONTROLLERS & LÓGICA DE NEGOCIO                    │   │
│  │  Validaciones, cálculos, integraciones externas    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                    Prisma ORM
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   BASE DE DATOS                             │
│              PostgreSQL (Neon Cloud)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Modelos (15+ tablas)                               │   │
│  │  ├── Usuario          → Cuentas de usuario          │   │
│  │  ├── Producto         → Catálogo                    │   │
│  │  ├── Imagen           → Fotos de productos          │   │
│  │  ├── Talla            → Variantes de producto       │   │
│  │  ├── Inventario       → Stock por talla             │   │
│  │  ├── Categoría        → Clasificación              │   │
│  │  ├── Carrito          → Items del carrito          │   │
│  │  ├── Pedido           → Órdenes de compra          │   │
│  │  ├── PedidoItem       → Ítems por orden            │   │
│  │  ├── Dirección        → Direcciones de envío       │   │
│  │  ├── MensajeChat      → Chat en tiempo real        │   │
│  │  ├── Suscriptor       → Newsletter                  │   │
│  │  ├── Referido         → Sistema de afiliados       │   │
│  │  └── ... (más modelos)                             │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Servicios Externos Integrados

```
┌─────────────────────────────────────────────────────┐
│           INTEGRACIONES EXTERNAS                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔐 Autenticación                                   │
│     └─ JWT (generado en backend)                   │
│                                                     │
│  💳 Pagos                                           │
│     └─ Mercado Pago API                            │
│                                                     │
│  📧 Email                                           │
│     └─ Resend API                                  │
│                                                     │
│  🖼️ Storage de Imágenes                            │
│     └─ Cloudinary API                              │
│                                                     │
│  💬 Chat en Tiempo Real                            │
│     └─ Socket.io                                   │
│                                                     │
│  🤖 IA & NLP                                        │
│     └─ Groq API (Chatbot)                          │
│                                                     │
│  🎨 Base de Datos                                   │
│     └─ PostgreSQL (Neon)                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Flujo de Autenticación

```
1. REGISTRO/LOGIN (Frontend)
        │
        ▼
2. POST /api/auth/register o /api/auth/login
        │
        ▼
3. Backend valida credenciales
   - Hash contraseña con bcryptjs
   - Verifica en BD
        │
        ▼
4. Genera JWT Token
   - Incluye: user_id, rol, email
   - Válido por: 7 días (configurable)
        │
        ▼
5. Devuelve token al frontend
        │
        ▼
6. Frontend guarda en Zustand + localStorage
        │
        ▼
7. Futuras requests incluyen JWT en header
   Authorization: Bearer <token>
        │
        ▼
8. Middleware verifica token
   - Si es válido → Acceso permitido
   - Si es inválido → 401 Unauthorized
   - Si expiró → Refresh token
```

---

## Flujo de una Compra

```
1. Cliente navega catálogo
   GET /api/products
        │
        ▼
2. Agrega items al carrito
   POST /api/cart
        │
        ▼
3. Revisa carrito y procede a checkout
   GET /api/cart
        │
        ▼
4. Envía datos de pago a Mercado Pago
   POST /api/payments/create
        │
        ▼
5. Usuario completa pago en MP
   (iframe externo)
        │
        ▼
6. MP envía webhook de confirmación
   POST /api/payments/webhook
        │
        ▼
7. Backend crea orden en BD
   - Descuenta inventario
   - Limpia carrito
   - Envía email de confirmación
        │
        ▼
8. Usuario ve orden confirmada
   GET /api/orders/:id
        │
        ▼
9. Admin recibe notificación
   /api/admin/pedidos
```

---

## Ciclo de Vida de una Solicitud

```
CLIENTE
  │
  ├─ Navega a /admin
  │
  └─> FRONTEND (Next.js)
       │
       ├─ Valida autenticación (Zustand)
       │
       ├─ Si no autenticado → Redirect /auth/login
       │
       └─> AXIOS REQUEST
            │
            POST /api/admin/products
            Headers: {
              "Authorization": "Bearer <JWT_TOKEN>",
              "Content-Type": "application/json"
            }
            │
            └─> BACKEND (Express)
                 │
                 1️⃣ CORS Middleware
                    ├─ Verifica origin
                    └─ Agrega headers CORS
                 │
                 2️⃣ Body Parser
                    └─ Parsea JSON
                 │
                 3️⃣ Router Matcher
                    └─ Encuentra ruta /api/admin/products
                 │
                 4️⃣ JWT Middleware (verificarToken)
                    ├─ Extrae token del header
                    ├─ Verifica firma
                    └─ Adjunta user a req.user
                 │
                 5️⃣ Admin Check (soloAdmin)
                    ├─ Verifica req.user.rol === 'administrador'
                    └─ Si no → 403 Forbidden
                 │
                 6️⃣ Controller (listarTodos)
                    ├─ Query BD con Prisma
                    ├─ Formatea datos
                    └─ Retorna JSON
                 │
                 └─> RESPUESTA HTTP 200
                      {
                        "productos": [...]
                      }
                      Headers: {
                        "Access-Control-Allow-Origin": "http://localhost:3000",
                        "Content-Type": "application/json"
                      }
                      │
                      └─> FRONTEND (recibe respuesta)
                           │
                           ├─ Zustand setState
                           ├─ React re-renderiza
                           └─ Usuario ve tabla de productos
```

---

## Patrones de Arquitectura Utilizados

### 1. **MVC (Model-View-Controller)**
- **Models:** Prisma schemas
- **Views:** Componentes React
- **Controllers:** Lógica en `src/controllers/`

### 2. **Middleware Stack**
Todos los requests pasan por:
```javascript
CORS → BodyParser → Router → Auth → Controller → Response
```

### 3. **Token-Based Authentication**
- JWT para stateless auth
- Refresh tokens para sesiones largas
- Roles basados en tokens

### 4. **RESTful API**
```
GET    /api/products      → Listar
POST   /api/products      → Crear
PATCH  /api/products/:id  → Actualizar
DELETE /api/products/:id  → Eliminar
```

### 5. **State Management (Frontend)**
- Zustand para estado global
- Separado por dominio (auth, cart, wishlist)
- Persistencia en localStorage

---

## Seguridad

### Autenticación
- ✅ JWT Token basado en tiempo
- ✅ Contraseñas hasheadas con bcryptjs
- ✅ Protección CORS

### Autorización
- ✅ Rol-based access control (RBAC)
- ✅ Middleware de admin-only
- ✅ Verificación en cada request

### Datos Sensibles
- ✅ Variables de entorno para secretos
- ✅ SSL para BD (Neon)
- ✅ Rate limiting (recomendado implementar)

### Validaciones
- ✅ Email único en BD
- ✅ Contraseña mínimo 8 caracteres
- ✅ Validación de datos en requests

---

## Performance

### Optimizaciones Implementadas
- ✅ Prisma con relaciones eficientes
- ✅ Índices en BD (email, slug)
- ✅ Next.js Image optimization
- ✅ Lazy loading de componentes
- ✅ Caching de static assets

### Recomendaciones
- ⚠️ Implementar Redis para sesiones
- ⚠️ Implementar CDN para imágenes
- ⚠️ Rate limiting en APIs públicas
- ⚠️ Monitoring con Sentry

---

**Tiempo de lectura estimado:** 20 minutos
**Nivel:** Arquitecto/Lead Developer

Próxima lectura recomendada → [03_ESTRUCTURA_CARPETAS.md](./03_ESTRUCTURA_CARPETAS.md)
