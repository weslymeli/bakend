# 📝 Convenciones de Código

## Objetivo

Mantener consistencia, legibilidad y calidad en todo el codebase.

---

## Nombres de Variables

### Convenciones Generales

```javascript
// ✅ BIEN - Descriptivos, camelCase
const usuarioActual = null;
const precioTotal = 0;
const esAdministrador = false;
const obtenerProducto = () => { };

// ❌ MAL - Nombres genéricos
const user = null;
const p = 0;
const admin = false;
const get = () => { };
```

### Booleanos

```javascript
// ✅ Usar prefijos is, has, can, should
const estaAutenticado = true;
const tienePermiso = false;
const puedeEditar = true;
const debeActualizar = false;

// ❌ Evitar
const autenticado = true;
const permiso = false;
```

### Constantes

```javascript
// ✅ MAYÚSCULAS con underscore
const MAX_INTENTOS_LOGIN = 5;
const PRECIO_MINIMO = 50000;
const RUTA_API = 'http://localhost:4000';
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ❌ Evitar
const maxIntentosLogin = 5;
const precioMinimo = 50000;
```

### Funciones

```javascript
// ✅ Verbos + sustantivo, camelCase
const obtenerProducto = () => { };
const crearUsuario = () => { };
const actualizarPrecio = () => { };
const eliminarCarrito = () => { };
const verificarToken = () => { };
const formatearFecha = () => { };

// ❌ Evitar
const getProducto = () => { };  // Mezclar inglés
const producto = () => { };     // Sin verbo
const user_create = () => { };  // snake_case
```

### Arrays

```javascript
// ✅ Plural
const productos = [];
const usuarios = [];
const itemsCarrito = [];

// ❌ Evitar
const producto = [];
const usuario = [];
const itemCart = [];
```

---

## Estructura de Archivos

### Backend

```
src/
├── controllers/
│   └── product.controller.js       # Nombres descriptivos
├── routes/
│   └── product.routes.js
├── middlewares/
│   └── auth.middleware.js
└── lib/
    └── prisma.js
```

### Frontend

```
components/
├── products/
│   ├── ProductCard.jsx            # PascalCase para componentes
│   ├── FilterDrawer.jsx
│   └── RelatedProducts.jsx
└── ui/
    ├── Button.jsx
    ├── Modal.jsx
    └── Badge.jsx

store/
├── useAuthStore.js                # use prefix para hooks/stores
├── useCartStore.js
└── useWishlistStore.js

lib/
├── axios.js                       # camelCase para funciones
└── colombiaUtils.js
```

---

## Componentes React

### Estructura

```javascript
'use client';  // Directiva de Next.js
import { useState, useEffect } from 'react';  // Imports en orden
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import api from '@/lib/axios';
import Button from '@/components/ui/Button';

// Props con JSDoc
/**
 * @param {Object} producto
 * @param {number} producto.id
 * @param {string} producto.nombre
 * @param {number} producto.precio
 */
export default function ProductCard({ producto }) {
  // Hooks primero
  const router = useRouter();
  const usuario = useAuthStore((state) => state.usuario);
  const [cantidad, setCantidad] = useState(1);

  // Effects después
  useEffect(() => {
    // lógica
  }, []);

  // Handlers
  const handleAgregarCarrito = () => {
    // lógica
  };

  // Render
  return (
    <div>
      <h2>{producto.nombre}</h2>
      <p>${producto.precio}</p>
      <Button onClick={handleAgregarCarrito}>
        Agregar al Carrito
      </Button>
    </div>
  );
}
```

### Props Drilling vs Context

```javascript
// ❌ Props drilling - Evitar
<Navbar user={user} onLogout={onLogout} isDark={isDark} />
<Sidebar user={user} isDark={isDark} />
<Main user={user} isDark={isDark} />

// ✅ Usar Zustand
const user = useAuthStore((s) => s.usuario);
const isDark = useThemeStore((s) => s.isDark);
```

---

## Controladores (Backend)

### Estructura

```javascript
// ✅ Estructura clara
const crearProducto = async (req, res) => {
  try {
    // 1. Validar
    const { nombre, precio } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ error: "Campos requeridos" });
    }

    // 2. Procesar
    const producto = await prisma.producto.create({
      data: { nombre, precio },
    });

    // 3. Responder
    res.status(201).json({ producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { crearProducto };
```

### Errores

```javascript
// ✅ Errores descriptivos
if (error instanceof ValidationError) {
  return res.status(400).json({
    error: "Validación fallida",
    detalles: error.details,
  });
}

if (!usuario) {
  return res.status(404).json({ error: "Usuario no encontrado" });
}

if (usuario.rol !== "administrador") {
  return res.status(403).json({ error: "Solo administradores" });
}

// ❌ Evitar
if (!usuario) {
  return res.json({ error: "Error" });  // Mal código de estado
}
```

---

## Consultas a BD (Prisma)

### Formato

```javascript
// ✅ Bien formateado
const usuario = await prisma.usuario.findUnique({
  where: { email: "juan@example.com" },
  include: {
    pedidos: true,
    direcciones: true,
  },
});

// ✅ Buscar múltiples
const productos = await prisma.producto.findMany({
  where: {
    activo: true,
    categoriaId: 1,
  },
  include: { imagenes: true, tallas: true },
  orderBy: { creadoEn: "desc" },
  take: 10,
});

// ❌ Evitar
const user = await prisma.user.findUnique({ where: { email } });  // Sin relations
```

---

## Estilos (Tailwind CSS)

### Orden

```javascript
// ✅ Orden lógico: Layout → Spacing → Colors → Typography → Effects
className="
  flex justify-between items-center        // Layout
  gap-4 px-6 py-3                         // Spacing
  bg-white text-black                     // Colors
  text-sm font-bold                       // Typography
  hover:bg-gray-100 transition-all        // Effects
"
```

### Componentes Reutilizables

```javascript
// ✅ Crear componentes para estilos repetidos
const Button = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = 'px-4 py-2 font-bold rounded transition-all';
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

// Uso
<Button variant="primary">Crear</Button>
<Button variant="danger">Eliminar</Button>
```

---

## Comentarios

### Cuándo Usarlos

```javascript
// ✅ Explicar el POR QUÉ, no el QUÉ
const precioFinal = precio * 1.19;  // IVA del 19% para Colombia

// ❌ Comentarios obvios
const nombre = "Juan";  // Asignar nombre

// ✅ Comentarios para lógica compleja
// Calcular descuento por referido + cupón + black friday
const descuentoTotal = (
  creditoReferido +
  descuentoCupon +
  (esBlackFriday ? 0.1 : 0)
) * precioBase;
```

---

## API Responses

### Formato Consistente

```javascript
// ✅ Success
res.status(200).json({
  mensaje: "Operación exitosa",
  data: {
    producto: { id: 1, nombre: "..." },
  },
});

// ✅ Error
res.status(400).json({
  error: "Email ya existe",
  codigo: "EMAIL_DUPLICADO",
});

// ✅ Con paginación
res.json({
  productos: [...],
  total: 100,
  pagina: 1,
  paginas: 10,
  itemsPorPagina: 10,
});
```

---

## Commits de Git

### Mensajes Claros

```bash
# ✅ Bien
git commit -m "feat: agregar sistema de referidos"
git commit -m "fix: corregir error de CORS en /api/admin/products"
git commit -m "docs: actualizar guía de instalación"
git commit -m "refactor: simplificar lógica de carrito"

# ❌ Evitar
git commit -m "cambios"
git commit -m "fix"
git commit -m "actualizar código"
```

### Prefijos

```
feat:     Nueva feature
fix:      Bug fix
docs:     Documentación
style:    Cambios de formato
refactor: Reorganizar código
test:     Agregar tests
chore:    Cambios de build, dependencias
```

---

## Pruebas (Tests)

### Nomenclatura

```javascript
// ✅ Descriptivo
describe('crearProducto', () => {
  it('debe crear un producto con datos válidos', () => {
    // test
  });

  it('debe lanzar error si falta el nombre', () => {
    // test
  });
});

// ❌ Evitar
describe('product', () => {
  it('works', () => {
    // test
  });
});
```

---

## Checklist Pre-Commit

Antes de hacer commit, verifica:

- [ ] ✅ Código limpio sin console.log()
- [ ] ✅ Nombres de variables claros
- [ ] ✅ Funciones pequeñas (< 30 líneas)
- [ ] ✅ Manejo de errores apropiado
- [ ] ✅ Tests pasan (si existen)
- [ ] ✅ No hay archivos .env en git
- [ ] ✅ Commits con mensajes descriptivos
- [ ] ✅ Sin linter warnings

---

**Tiempo de lectura:** 15 minutos
**Nivel:** Todo el equipo

Próxima lectura → [10_GUIA_CONTRIBUCION.md](./10_GUIA_CONTRIBUCION.md)
