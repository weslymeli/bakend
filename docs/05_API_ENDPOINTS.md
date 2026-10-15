# 📡 API Endpoints - Documentación Completa

## Base URL

```
Desarrollo: http://localhost:4000
Producción: https://tu-dominio.com (a definir)
```

## Autenticación

Todos los endpoints protegidos requieren:

```
Authorization: Bearer <JWT_TOKEN>
```

El token se obtiene en `/api/auth/login` y tiene validez de **7 días**.

---

## 🔑 AUTH - Autenticación

### Registro
```
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "miContraseña123"
}

✅ 201 Created
{
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "cliente",
    "codigoReferido": "JUAN123ABC"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "miContraseña123"
}

✅ 200 OK
{
  "usuario": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Logout
```
POST /api/auth/logout
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "mensaje": "Sesión cerrada"
}
```

### Refresh Token
```
POST /api/auth/refresh
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🛍️ PRODUCTS - Catálogo Público

### Listar Productos
```
GET /api/products
GET /api/products?pagina=1&limite=10
GET /api/products?categoria=1
GET /api/products?busqueda=camiseta
GET /api/products?minPrecio=50000&maxPrecio=150000

✅ 200 OK
{
  "productos": [
    {
      "id": 1,
      "nombre": "Camiseta Oni",
      "slug": "camiseta-oni",
      "precio": 75000,
      "precioAntes": 100000,
      "imagenes": [{ "url": "https://...", "esPrincipal": true }],
      "categoria": { "id": 1, "nombre": "Camisetas" },
      "tallas": [{ "id": 1, "nombre": "S" }, { "id": 2, "nombre": "M" }],
      "stock": 45
    }
  ],
  "total": 125,
  "pagina": 1,
  "paginas": 13
}
```

### Obtener Producto por Slug
```
GET /api/products/:slug

✅ 200 OK
{
  "producto": {
    "id": 1,
    "nombre": "Camiseta Oni",
    "descripcion": "Camiseta de algodón 100%...",
    "precio": 75000,
    "imagenes": [...],
    "tallas": [...],
    "inventario": [
      { "tallaId": 1, "talla": "S", "cantidad": 10 },
      { "tallaId": 2, "talla": "M", "cantidad": 15 }
    ],
    "resenas": [...]
  }
}
```

### Búsqueda Rápida
```
GET /api/products/search?q=camiseta&limit=5

✅ 200 OK
{
  "resultados": [
    { "id": 1, "nombre": "Camiseta Oni", "slug": "camiseta-oni" },
    { "id": 2, "nombre": "Camiseta Classic", "slug": "camiseta-classic" }
  ]
}
```

---

## 🛒 CART - Carrito de Compras

### Ver Carrito
```
GET /api/cart
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "items": [
    {
      "id": 1,
      "productoId": 1,
      "producto": {
        "nombre": "Camiseta Oni",
        "precio": 75000,
        "imagenes": [...]
      },
      "tallaId": 1,
      "talla": { "nombre": "M" },
      "cantidad": 2,
      "subtotal": 150000
    }
  ],
  "total": 150000,
  "cantidad": 2
}
```

### Agregar al Carrito
```
POST /api/cart
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "productoId": 1,
  "tallaId": 2,
  "cantidad": 2
}

✅ 201 Created
{
  "mensaje": "Producto agregado al carrito",
  "item": { ... }
}
```

### Actualizar Cantidad
```
PATCH /api/cart/:itemId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "cantidad": 3
}

✅ 200 OK
{
  "item": { ... }
}
```

### Eliminar del Carrito
```
DELETE /api/cart/:itemId
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "mensaje": "Item removido del carrito"
}
```

### Vaciar Carrito
```
DELETE /api/cart
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "mensaje": "Carrito vaciado"
}
```

---

## 💳 PAYMENTS - Pagos

### Crear Orden de Pago
```
POST /api/payments/create
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "direccionId": 1,
  "metodoPago": "mercadopago"
}

✅ 200 OK
{
  "pedidoId": 123,
  "initPoint": "https://www.mercadopago.com/..."  // URL para pagar
}
```

### Webhook de Mercado Pago
```
POST /api/payments/webhook
Content-Type: application/json

(Enviado automáticamente por MP)
- Actualiza estado del pedido
- Descuenta inventario
- Envía email de confirmación

✅ 200 OK
{
  "id": "webhook-id-123"
}
```

---

## 📦 ORDERS - Órdenes de Compra

### Ver Mis Órdenes
```
GET /api/orders
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "pedidos": [
    {
      "id": 123,
      "numero": "ONI-2024-0001",
      "total": 200000,
      "estado": "enviado",
      "numeroSeguimiento": "CC123456789CO",
      "creadoEn": "2024-09-01T10:30:00Z",
      "items": [...]
    }
  ]
}
```

### Obtener Detalles de Orden
```
GET /api/orders/:id
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "pedido": {
    "id": 123,
    "numero": "ONI-2024-0001",
    "estado": "enviado",
    "items": [...],
    "total": 200000,
    "direccion": { ... },
    "rastreo": { "numeroSeguimiento": "CC123456789CO" }
  }
}
```

### Rastrear Pedido (Público)
```
GET /api/orders/track/:numeroSeguimiento

✅ 200 OK
{
  "pedido": {
    "numero": "ONI-2024-0001",
    "estado": "enviado",
    "pasos": [
      { "estado": "pendiente", "fecha": null },
      { "estado": "pagado", "fecha": "2024-09-01T10:35:00Z" },
      { "estado": "enviado", "fecha": "2024-09-02T14:20:00Z" },
      { "estado": "entregado", "fecha": null }
    ]
  }
}
```

---

## 👤 USERS - Perfil de Usuario

### Ver Perfil
```
GET /api/users/me
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "avatarUrl": "https://...",
    "rol": "cliente",
    "codigoReferido": "JUAN123ABC",
    "creditoDisponible": 50000,
    "creadoEn": "2024-08-15T10:00:00Z"
  }
}
```

### Actualizar Perfil
```
PATCH /api/users/me
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "avatarUrl": "https://..."
}

✅ 200 OK
{ "usuario": { ... } }
```

### Cambiar Contraseña
```
PATCH /api/users/password
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "contraseñaActual": "oldPassword123",
  "contraseñaNueva": "newPassword123"
}

✅ 200 OK
{ "mensaje": "Contraseña actualizada" }
```

### Ver Direcciones
```
GET /api/users/direcciones
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "direcciones": [
    {
      "id": 1,
      "calle": "Calle 50 #15-20",
      "ciudad": "Medellín",
      "departamento": "Antioquia",
      "codigoPostal": "050001",
      "esDefault": true
    }
  ]
}
```

### Agregar Dirección
```
POST /api/users/direcciones
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "calle": "Calle 50 #15-20",
  "ciudad": "Medellín",
  "departamento": "Antioquia",
  "codigoPostal": "050001",
  "telefono": "3001234567",
  "esDefault": false
}

✅ 201 Created
{ "direccion": { ... } }
```

---

## 🔧 ADMIN - Panel de Administración

### Verificación Requerida
Todos los endpoints admin requieren:
```
Authorization: Bearer <TOKEN>
```
Y el usuario debe tener `rol: "administrador"`

### Listar Pedidos (Admin)
```
GET /api/admin/pedidos

✅ 200 OK
{
  "pedidos": [
    {
      "id": 123,
      "usuario": { "nombre": "Juan", "email": "juan@example.com" },
      "estado": "pendiente",
      "total": 200000,
      "items": 3,
      "creadoEn": "2024-09-01T10:30:00Z"
    }
  ]
}
```

### Cambiar Estado de Pedido
```
PATCH /api/admin/pedidos/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "estado": "pagado",
  "numeroSeguimiento": "CC123456789CO"
}

✅ 200 OK
{ "pedido": { ... } }
```

### Listar Usuarios (Admin)
```
GET /api/admin/usuarios

✅ 200 OK
{
  "usuarios": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "cliente",
      "activo": true,
      "pedidos": 5,
      "creadoEn": "2024-08-15T10:00:00Z"
    }
  ]
}
```

### Toggle Usuario Activo
```
PATCH /api/admin/usuarios/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "activo": false
}

✅ 200 OK
{ "usuario": { ... } }
```

---

## 📦 ADMIN PRODUCTS - Gestión de Productos

### Listar Todos los Productos (Admin)
```
GET /api/admin/products

✅ 200 OK
{
  "productos": [
    {
      "id": 1,
      "nombre": "Camiseta Oni",
      "precio": 75000,
      "activo": true,
      "stock": 150,
      "imagenes": [...],
      "tallas": [...],
      "categoria": { ... }
    }
  ]
}
```

### Crear Producto
```
POST /api/admin/products
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

{
  "nombre": "Camiseta Nueva",
  "slug": "camiseta-nueva",
  "descripcion": "Descripción...",
  "precio": 80000,
  "precioAntes": 100000,
  "categoriaId": 1,
  "subcategoriaId": 2,
  "badge": "Nuevo",
  "destacado": false,
  "tallas": "[{\"nombre\":\"S\",\"cantidad\":10},{\"nombre\":\"M\",\"cantidad\":15}]",
  "imagenes": [file1, file2, ...]  // Upload
}

✅ 201 Created
{
  "mensaje": "Producto creado con exito.",
  "productoId": 100
}
```

### Editar Producto
```
PATCH /api/admin/products/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "nombre": "Nombre Actualizado",
  "precio": 85000,
  "activo": true
}

✅ 200 OK
{ "mensaje": "Producto actualizado.", "producto": { ... } }
```

### Actualizar Stock
```
PATCH /api/admin/products/stock/:tallaId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "cantidad": 25
}

✅ 200 OK
{ "mensaje": "Stock actualizado." }
```

### Agregar Imagen
```
POST /api/admin/products/:id/imagen
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

{
  "imagen": [file]  // Upload
}

✅ 201 Created
{
  "mensaje": "Imagen agregada.",
  "imagen": { "id": 50, "url": "https://..." }
}
```

### Eliminar Producto
```
DELETE /api/admin/products/:id
Authorization: Bearer <TOKEN>

✅ 200 OK
{ "mensaje": "Producto eliminado." }
```

---

## 💬 CHAT - Chat en Tiempo Real

### Enviar Mensaje (Socket.io)
```javascript
socket.emit("enviar_mensaje", {
  nombre: "Juan",
  email: "juan@example.com",
  mensaje: "¿Cómo puedo rastrear mi orden?",
  timestamp: new Date()
});
```

### Recibir Mensaje
```javascript
socket.on("nuevo_mensaje", (datos) => {
  console.log(`${datos.nombre}: ${datos.mensaje}`);
});
```

### Guardar Mensaje
```
POST /api/chat
Content-Type: application/json

{
  "nombre": "Juan",
  "email": "juan@example.com",
  "mensaje": "¿Cómo puedo rastrear mi orden?"
}

✅ 201 Created
{ "mensaje": { ... } }
```

---

## 📧 NEWSLETTER - Email Marketing

### Suscribirse
```
POST /api/newsletter/suscribir
Content-Type: application/json

{
  "email": "juan@example.com",
  "nombre": "Juan Pérez"
}

✅ 201 Created
{ "mensaje": "Suscripción exitosa" }
```

### Desuscribirse
```
POST /api/newsletter/desuscribir
Content-Type: application/json

{
  "email": "juan@example.com"
}

✅ 200 OK
{ "mensaje": "Desuscripción exitosa" }
```

---

## 🎁 REFERRALS - Sistema de Referidos

### Obtener Código Referido
```
GET /api/referrals/mi-codigo
Authorization: Bearer <TOKEN>

✅ 200 OK
{
  "codigoReferido": "JUAN123ABC",
  "creditoDisponible": 50000,
  "referidosActivos": 3
}
```

### Registrarse con Referido
```
POST /api/auth/register?codigo=JUAN123ABC
Content-Type: application/json

{
  "nombre": "María García",
  "email": "maria@example.com",
  "password": "password123"
}

✅ 201 Created
{
  "usuario": { ... },
  "mensaje": "¡Referido aplicado! Ambos reciben bonificación."
}
```

---

## Códigos de Estado HTTP

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 200 | OK - Éxito | GET, PATCH exitoso |
| 201 | Created - Creado | POST exitoso |
| 400 | Bad Request - Datos inválidos | Email inválido |
| 401 | Unauthorized - Sin autenticación | Falta JWT token |
| 403 | Forbidden - Sin permisos | No es admin |
| 404 | Not Found - No existe | Producto no existe |
| 409 | Conflict - Duplicado | Email ya existe |
| 500 | Internal Server Error | Error del servidor |

---

## Errores Comunes

```javascript
// 401 - Falta token
{
  "error": "No autorizado",
  "codigo": "NO_TOKEN"
}

// 403 - No es admin
{
  "error": "Solo administradores pueden acceder",
  "codigo": "NO_ADMIN"
}

// 404 - No existe
{
  "error": "Producto no encontrado",
  "codigo": "NOT_FOUND"
}

// 400 - Datos inválidos
{
  "error": "Validación fallida",
  "detalles": {
    "email": "Email inválido",
    "precio": "Precio debe ser positivo"
  }
}
```

---

**Tiempo de lectura:** 30 minutos
**Nivel:** Developer/QA

Próxima lectura → [06_AUTENTICACION.md](./06_AUTENTICACION.md)
