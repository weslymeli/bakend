# 🎨 Guía Frontend - Next.js y React

## Descripción

Frontend es una aplicación **Next.js 14+** usando el **App Router**. Utiliza **React Hooks**, **Zustand** para estado global y **Tailwind CSS** para estilos.

---

## Estructura App Router

```
app/                          # Rutas de Next.js
├── layout.js                 # Layout base (HTML, nav, footer)
├── page.js                   # / (home)
├── globals.css               # Estilos globales
│
├── admin/                    # /admin
│   └── page.js
│
├── auth/                     # /auth
│   └── page.js
│
├── productos/                # /productos
│   ├── page.js              # Catálogo
│   └── [slug]/              # /productos/nombre-producto
│       └── page.js
│
└── [ruta]/
    └── page.js
```

---

## Componentes Principales

### Layout Global

```javascript
// app/layout.js
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### Navbar

```javascript
// components/layout/Navbar.jsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function Navbar() {
  const router = useRouter();
  const { estaLogueado, usuario, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-black text-white">
      <div className="flex justify-between items-center p-4">
        <Link href="/" className="font-bold text-2xl">
          ONI Style
        </Link>

        <div className="flex gap-4">
          <Link href="/productos">Productos</Link>
          <Link href="/carrito">Carrito</Link>

          {estaLogueado ? (
            <>
              <span>Hola, {usuario?.nombre}</span>
              <Link href="/perfil">Mi Cuenta</Link>
              {usuario?.rol === 'administrador' && (
                <Link href="/admin">Admin</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link href="/auth/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
```

---

## Páginas Principales

### Home

```javascript
// app/page.js
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductsSection from '@/components/home/ProductsSection';

export default function HomePage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await api.get('/products?destacado=true');
        setProductos(res.data.productos);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <div>
      <HeroCarousel />
      <CategoryGrid />
      <ProductsSection productos={productos} loading={loading} />
    </div>
  );
}
```

### Catálogo de Productos

```javascript
// app/productos/page.js
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/products/ProductCard';
import FilterDrawer from '@/components/products/FilterDrawer';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    categoria: null,
    minPrecio: 0,
    maxPrecio: 500000,
  });

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const params = new URLSearchParams();
        if (filtros.categoria) params.append('categoria', filtros.categoria);
        params.append('minPrecio', filtros.minPrecio);
        params.append('maxPrecio', filtros.maxPrecio);

        const res = await api.get(`/products?${params}`);
        setProductos(res.data.productos);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    cargarProductos();
  }, [filtros]);

  return (
    <div className="flex gap-4">
      <FilterDrawer filtros={filtros} setFiltros={setFiltros} />
      <div className="grid grid-cols-3 gap-4 flex-1">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  );
}
```

### Detalle de Producto

```javascript
// app/productos/[slug]/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import useCartStore from '@/store/useCartStore';
import RelatedProducts from '@/components/products/RelatedProducts';

export default function ProductPage({ params }) {
  const router = useRouter();
  const { slug } = params;
  const [producto, setProducto] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const agregarAlCarrito = useCartStore((s) => s.agregarAlCarrito);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProducto(res.data.producto);
        if (res.data.producto.tallas?.[0]) {
          setTallaSeleccionada(res.data.producto.tallas[0].id);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    cargarProducto();
  }, [slug]);

  const handleAgregarCarrito = async () => {
    if (!tallaSeleccionada) {
      alert('Selecciona una talla');
      return;
    }

    try {
      await agregarAlCarrito(producto.id, tallaSeleccionada, cantidad);
      alert('Agregado al carrito!');
      router.push('/carrito');
    } catch (error) {
      alert('Error al agregar al carrito');
    }
  };

  if (!producto) return <div>Cargando...</div>;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Imágenes */}
      <div>
        <img
          src={producto.imagenes?.[0]?.url}
          alt={producto.nombre}
          className="w-full"
        />
      </div>

      {/* Detalles */}
      <div>
        <h1 className="text-3xl font-bold">{producto.nombre}</h1>
        <p className="text-2xl font-bold">${producto.precio}</p>
        <p className="text-gray-600">{producto.descripcion}</p>

        {/* Seleccionar talla */}
        <div className="my-4">
          <label>Talla:</label>
          <div className="flex gap-2">
            {producto.tallas?.map((t) => (
              <button
                key={t.id}
                onClick={() => setTallaSeleccionada(t.id)}
                className={`px-4 py-2 border ${
                  tallaSeleccionada === t.id ? 'bg-black text-white' : ''
                }`}
              >
                {t.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad */}
        <div className="my-4">
          <label>Cantidad:</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value))}
            min="1"
            className="px-2 py-1 border"
          />
        </div>

        {/* Botón agregar */}
        <button
          onClick={handleAgregarCarrito}
          className="w-full bg-black text-white py-3"
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}
```

---

## Estilos con Tailwind

### Configuración

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'oni-dark': '#000000',
        'oni-gray': '#333333',
        'oni-muted': '#999999',
        'oni-accent': '#FF6B35',
      },
    },
  },
};
```

### Uso en Componentes

```javascript
<div className="bg-oni-dark text-white">
  <h1 className="text-oni-accent text-3xl font-bold">
    Oni Style
  </h1>
  <p className="text-oni-muted">
    Ropa sostenible y urbana
  </p>
</div>
```

---

## Optimizaciones

### Image Optimization

```javascript
import Image from 'next/image';

export default function ProductCard({ producto }) {
  return (
    <Image
      src={producto.imagenes?.[0]?.url}
      alt={producto.nombre}
      width={300}
      height={300}
      priority={false}  // Lazy load
    />
  );
}
```

### Lazy Loading de Componentes

```javascript
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(
  () => import('@/components/chat/ChatWidget'),
  { loading: () => <p>Cargando chat...</p> }
);

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
```

---

## Rutas y Navegación

### Link

```javascript
import Link from 'next/link';

// Navegación a página estática
<Link href="/sobre-nosotros">
  Sobre Nosotros
</Link>

// Navegación a ruta dinámica
<Link href={`/productos/${producto.slug}`}>
  Ver Producto
</Link>
```

### useRouter

```javascript
'use client';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async () => {
    // ... login logic
    router.push('/');  // Redirige a home
    router.replace('/');  // Sin historial
    router.back();  // Volver atrás
  };
}
```

---

**Tiempo de lectura:** 20 minutos
**Nivel:** React Developer

Próxima lectura → [08_ESTADO_GLOBAL.md](./08_ESTADO_GLOBAL.md)
