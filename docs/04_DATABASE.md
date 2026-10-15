# 🗄️ Base de Datos y Modelos Prisma

## Visión General

**Base de Datos:** PostgreSQL
**Hosted:** Neon Cloud
**ORM:** Prisma 7.8.0
**Patrón:** Relacional con normalización

---

## Diagrama Entidad-Relación (ER)

```
┌──────────────┐         ┌──────────────┐
│    USUARIO   │────────→│   DIRECCION  │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ nombre       │         │ usuarioId(FK)│
│ email        │         │ calle        │
│ password     │         │ ciudad       │
│ rol          │         │ pais         │
└──────────────┘         └──────────────┘
       │
       │ has_many
       ├─────────────────→ PEDIDO ←─────────────────┐
       │                  ├──────────────┐           │
       │                  │ id (PK)      │           │
       │                  │ usuarioId(FK)├──→ USER   │
       │                  │ direccionId  │           │
       │                  │ estado       │           │
       │                  │ total        │           │
       │                  └──────────────┘           │
       │                        │                    │
       │                        ├─→ PEDIDO_ITEM  ←──┘
       │                             ├──────────────────┐
       └─→ CARRITO_ITEM              │ id (PK)         │
            ├──────────────────┐     │ pedidoId (FK)   │
            │ id (PK)          │     │ productoId(FK)  │
            │ usuarioId (FK)   │     │ tallaId (FK)    │
            │ productoId(FK)   │     │ cantidad        │
            │ tallaId (FK)     │     │ precioUnitario  │
            │ cantidad         │     └──────────────────┘
            └──────────────────┘              │
                                              │
                        ┌─────────────────────┘
                        │
                        ↓
            ┌──────────────────────────┐
            │      PRODUCTO            │
            ├──────────────────────────┤
            │ id (PK)                  │
            │ nombre                   │
            │ slug                     │
            │ descripcion              │
            │ precio                   │
            │ precioAntes              │
            │ categoriaId (FK)         │
            │ subcategoriaId (FK)      │
            │ destacado                │
            │ activo                   │
            └──────────────────────────┘
                  │        │
        ┌─────────┘        └─────────┐
        │                            │
        ↓                            ↓
   ┌─────────────┐          ┌──────────────────┐
   │  TALLA      │          │ IMAGEN_PRODUCTO  │
   ├─────────────┤          ├──────────────────┤
   │ id (PK)     │          │ id (PK)          │
   │ productoId  │          │ productoId (FK)  │
   │ nombre      │          │ url              │
   └─────────────┘          │ esPrincipal      │
        │                   │ orden            │
        │                   └──────────────────┘
        ↓
   ┌──────────────┐
   │  INVENTARIO  │
   ├──────────────┤
   │ id (PK)      │
   │ productoId   │
   │ tallaId      │
   │ cantidad     │
   └──────────────┘
```

---

## Modelos y Schemas

### 1. **Usuario**

```prisma
model Usuario {
  id                Int       @id @default(autoincrement())
  nombre            String    @db.VarChar(100)
  email             String    @unique @db.VarChar(255)
  password          String
  avatarUrl         String?
  rol               String    @default("cliente")  // "cliente", "administrador"
  activo            Boolean   @default(true)
  creadoEn          DateTime  @default(now())
  actualizadoEn     DateTime  @updatedAt
  
  // Sistema de referidos
  codigoReferido    String?   @unique
  referidoPorId     Int?
  referidoPor       Usuario?  @relation("Referidos", fields: [referidoPorId], references: [id])
  referidos         Usuario[] @relation("Referidos")
  creditoDisponible Decimal   @default(0) @db.Decimal(10, 2)
  
  // Relaciones
  pedidos           Pedido[]
  direcciones       Direccion[]
  mensajes          MensajeChat[]
  carritoItems      CarritoItem[]
  
  @@map("usuario")
}
```

**Campos Importantes:**
- `email` - Único, usado para login
- `password` - Hasheado con bcryptjs
- `rol` - "cliente" o "administrador"
- `codigoReferido` - Código único para referir amigos
- `creditoDisponible` - Dinero disponible del programa de referidos

---

### 2. **Producto**

```prisma
model Producto {
  id                Int       @id @default(autoincrement())
  nombre            String    @db.VarChar(255)
  slug              String    @unique
  descripcion       String?   @db.Text
  precio            Decimal   @db.Decimal(10, 2)
  precioAntes       Decimal?  @db.Decimal(10, 2)  // Para descuentos
  badge             String?   // "Nuevo", "Sale", etc
  destacado         Boolean   @default(false)
  activo            Boolean   @default(true)
  categoriaId       Int
  subcategoriaId    Int?
  creadoEn          DateTime  @default(now())
  actualizadoEn     DateTime  @updatedAt
  
  // Relaciones
  categoria         Categoria @relation(fields: [categoriaId], references: [id])
  subcategoria      SubCategoria? @relation(fields: [subcategoriaId], references: [id])
  imagenes          ImagenProducto[]
  tallas            Talla[]
  inventario        Inventario[]
  carritoItems      CarritoItem[]
  pedidoItems       PedidoItem[]
  resenas           Resena[]
  
  @@map("producto")
}
```

---

### 3. **Categoría y SubCategoría**

```prisma
model Categoria {
  id          Int       @id @default(autoincrement())
  nombre      String    @db.VarChar(100)
  descripcion String?
  
  productos   Producto[]
  subcategorias SubCategoria[]
  
  @@map("categoria")
}

model SubCategoria {
  id          Int       @id @default(autoincrement())
  nombre      String    @db.VarChar(100)
  categoriaId Int
  
  categoria   Categoria @relation(fields: [categoriaId], references: [id])
  productos   Producto[]
  
  @@map("subcategoria")
}
```

---

### 4. **Talla e Inventario**

```prisma
model Talla {
  id          Int       @id @default(autoincrement())
  nombre      String    @db.VarChar(10)  // "XS", "S", "M", "L", "XL", "XXL"
  productoId  Int
  
  producto    Producto  @relation(fields: [productoId], references: [id])
  inventarios Inventario[]
  carritoItems CarritoItem[]
  pedidoItems PedidoItem[]
  
  @@map("talla")
}

model Inventario {
  id          Int       @id @default(autoincrement())
  productoId  Int
  tallaId     Int
  cantidad    Int       @default(0)
  
  producto    Producto  @relation(fields: [productoId], references: [id])
  talla       Talla     @relation(fields: [tallaId], references: [id])
  
  @@unique([productoId, tallaId])  // Una sola entrada por producto-talla
  @@map("inventario")
}
```

---

### 5. **Imagen de Producto**

```prisma
model ImagenProducto {
  id          Int       @id @default(autoincrement())
  productoId  Int
  url         String    @db.Text  // URL de Cloudinary
  esPrincipal Boolean   @default(false)
  orden       Int       @default(0)  // Para ordenar galería
  
  producto    Producto  @relation(fields: [productoId], references: [id], onDelete: Cascade)
  
  @@map("imagen_producto")
}
```

---

### 6. **Carrito**

```prisma
model CarritoItem {
  id          Int       @id @default(autoincrement())
  usuarioId   Int
  productoId  Int
  tallaId     Int
  cantidad    Int
  creadoEn    DateTime  @default(now())
  
  usuario     Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  producto    Producto  @relation(fields: [productoId], references: [id])
  talla       Talla     @relation(fields: [tallaId], references: [id])
  
  @@unique([usuarioId, productoId, tallaId])
  @@map("carrito_item")
}
```

---

### 7. **Pedido**

```prisma
model Pedido {
  id              Int       @id @default(autoincrement())
  usuarioId       Int
  numeroSeguimiento String? @unique
  estado          String    @default("pendiente")  // pendiente, pagado, enviado, entregado, cancelado
  subtotal        Decimal   @db.Decimal(10, 2)
  impuestos       Decimal   @default(0) @db.Decimal(10, 2)
  envio           Decimal   @default(0) @db.Decimal(10, 2)
  descuento       Decimal   @default(0) @db.Decimal(10, 2)
  total           Decimal   @db.Decimal(10, 2)
  
  // Datos de envío
  direccionId     Int
  direccion       Direccion @relation(fields: [direccionId], references: [id])
  
  // Pago
  metodoPago      String?   // "mercadopago", "tarjeta", etc
  idPagoExterno   String?   // ID de Mercado Pago, etc
  
  // Timestamps
  creadoEn        DateTime  @default(now())
  actualizadoEn   DateTime  @updatedAt
  entregadoEn     DateTime?
  
  // Relaciones
  usuario         Usuario   @relation(fields: [usuarioId], references: [id])
  items           PedidoItem[]
  
  @@map("pedido")
}

model PedidoItem {
  id              Int       @id @default(autoincrement())
  pedidoId        Int
  productoId      Int
  tallaId         Int
  cantidad        Int
  precioUnitario  Decimal   @db.Decimal(10, 2)
  subtotal        Decimal   @db.Decimal(10, 2)
  
  pedido          Pedido    @relation(fields: [pedidoId], references: [id], onDelete: Cascade)
  producto        Producto  @relation(fields: [productoId], references: [id])
  talla           Talla     @relation(fields: [tallaId], references: [id])
  
  @@map("pedido_item")
}
```

---

### 8. **Dirección**

```prisma
model Direccion {
  id              Int       @id @default(autoincrement())
  usuarioId       Int
  calle           String    @db.VarChar(255)
  ciudad          String    @db.VarChar(100)
  departamento    String    @db.VarChar(100)  // Departamento colombiano
  codigoPostal    String    @db.VarChar(20)
  pais            String    @default("Colombia")
  telefono        String    @db.VarChar(20)
  esDefault       Boolean   @default(false)
  
  usuario         Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  pedidos         Pedido[]
  
  @@map("direccion")
}
```

---

### 9. **Chat en Tiempo Real**

```prisma
model MensajeChat {
  id              Int       @id @default(autoincrement())
  usuarioId       Int
  nombre          String    @db.VarChar(100)
  email           String    @db.VarChar(255)
  mensaje         String    @db.Text
  esDelAdmin      Boolean   @default(false)
  respondido      Boolean   @default(false)
  creadoEn        DateTime  @default(now())
  
  usuario         Usuario?  @relation(fields: [usuarioId], references: [id], onDelete: SetNull)
  
  @@map("mensaje_chat")
}
```

---

### 10. **Newsletter**

```prisma
model Suscriptor {
  id              Int       @id @default(autoincrement())
  email           String    @unique @db.VarChar(255)
  nombre          String?   @db.VarChar(100)
  activo          Boolean   @default(true)
  creadoEn        DateTime  @default(now())
  
  @@map("suscriptor")
}
```

---

### 11. **Sistema de Referidos**

```prisma
model Referido {
  id              Int       @id @default(autoincrement())
  referidoPorId   Int       // Usuario que refirió
  usuarioRefId    Int       // Usuario referido
  estado          String    @default("pendiente")  // pendiente, completado
  bonificacion    Decimal   @db.Decimal(10, 2)
  creadoEn        DateTime  @default(now())
  completadoEn    DateTime?
  
  @@map("referido")
}
```

---

### 12. **Reseñas**

```prisma
model Resena {
  id              Int       @id @default(autoincrement())
  productoId      Int
  usuarioId       Int
  calificacion    Int       // 1-5 estrellas
  titulo          String?   @db.VarChar(200)
  contenido       String?   @db.Text
  verificado      Boolean   @default(false)  // Compra verificada
  creadoEn        DateTime  @default(now())
  
  producto        Producto  @relation(fields: [productoId], references: [id], onDelete: Cascade)
  usuario         Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  
  @@map("resena")
}
```

---

## Operaciones Comunes con Prisma

### Crear

```javascript
// Crear usuario
const usuario = await prisma.usuario.create({
  data: {
    nombre: "Juan",
    email: "juan@example.com",
    password: hashedPassword,
    rol: "cliente",
  },
});

// Crear producto con relaciones
const producto = await prisma.producto.create({
  data: {
    nombre: "Camiseta Oni",
    slug: "camiseta-oni",
    precio: 50000,
    categoriaId: 1,
    imagenes: {
      create: [
        { url: "https://cloudinary.com/...", esPrincipal: true, orden: 0 },
      ],
    },
    tallas: {
      create: [
        { nombre: "S" },
        { nombre: "M" },
        { nombre: "L" },
      ],
    },
  },
  include: { imagenes: true, tallas: true },
});
```

### Leer

```javascript
// Obtener un usuario con sus pedidos
const usuario = await prisma.usuario.findUnique({
  where: { email: "juan@example.com" },
  include: { pedidos: true },
});

// Listar productos activos
const productos = await prisma.producto.findMany({
  where: { activo: true },
  include: { imagenes: true, tallas: true, categoria: true },
  orderBy: { creadoEn: "desc" },
  take: 10,  // Limitar a 10
  skip: 0,   // Offset
});

// Buscar productos
const busqueda = await prisma.producto.findMany({
  where: {
    nombre: { contains: "camiseta", mode: "insensitive" },
    activo: true,
  },
});
```

### Actualizar

```javascript
// Actualizar estado de pedido
const pedidoActualizado = await prisma.pedido.update({
  where: { id: 123 },
  data: { estado: "enviado" },
});

// Actualizar stock
await prisma.inventario.update({
  where: {
    productoId_tallaId: { productoId: 1, tallaId: 1 },
  },
  data: { cantidad: { decrement: 5 } },  // Decrementar 5
});
```

### Eliminar

```javascript
// Eliminar producto (cascada elimina imagenes)
await prisma.producto.delete({
  where: { id: 123 },
});

// Eliminar múltiples
await prisma.carrito.deleteMany({
  where: { usuarioId: 456 },
});
```

---

## Índices y Performance

### Índices Actuales
```prisma
@@unique([email])              // Usuario.email
@@unique([slug])               // Producto.slug
@@unique([codigoReferido])     // Usuario.codigoReferido
@@unique([productoId, tallaId]) // Inventario
```

### Recomendaciones
```prisma
// Agregar en schema.prisma si hay problemas de performance:

// Búsqueda rápida por categoría
@@index([categoriaId])

// Filtrar activos
@@index([activo])

// Búsqueda por usuario
@@index([usuarioId])
```

---

## Migraciones

### Crear migración

```bash
# Cambiar schema.prisma
# Luego:
npx prisma migrate dev --name descripcion_cambio

# Ejemplo:
npx prisma migrate dev --name agregar_modelo_resenas
```

### Ver migraciones

```bash
npx prisma migrate status
npx prisma migrate resolve --rolled-back nombre_migracion
```

### En producción

```bash
npx prisma migrate deploy  # Ejecutar todas las pendientes
```

---

## Seeding (Datos de Prueba)

Crear archivo `prisma/seed.js`:

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Crear categorías
  const categoria = await prisma.categoria.create({
    data: {
      nombre: "Camisetas",
      descripcion: "Camisetas de algodón",
    },
  });

  // Crear producto
  const producto = await prisma.producto.create({
    data: {
      nombre: "Camiseta Oni Classic",
      slug: "camiseta-oni-classic",
      precio: 45000,
      categoriaId: categoria.id,
    },
  });

  console.log("Datos de seed creados");
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
```

Ejecutar:
```bash
npx prisma db seed
```

---

**Tiempo de lectura:** 20 minutos
**Nivel:** Full-Stack Developer

Próxima lectura → [05_API_ENDPOINTS.md](./05_API_ENDPOINTS.md)
