# 🎯 Gestión de Estado Global - Zustand

## Descripción

**Zustand** es una librería ligera para gestionar estado global en React. Es más simple que Redux pero más potente que Context API.

---

## Instalación

```bash
npm install zustand
```

---

## useAuthStore - Autenticación

```javascript
// store/useAuthStore.js
import { create } from 'zustand';
import api from '@/lib/axios';

const useAuthStore = create((set, get) => ({
  // Estado
  usuario: null,
  token: null,
  estaLogueado: false,

  // Acciones
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { usuario, token } = res.data;

      // Persistir en localStorage
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('token', token);

      // Actualizar estado
      set({ usuario, token, estaLogueado: true });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  register: async (nombre, email, password) => {
    try {
      const res = await api.post('/auth/register', {
        nombre,
        email,
        password,
      });
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

  restaurarSesion: () => {
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (usuario && token) {
      set({
        usuario: JSON.parse(usuario),
        token,
        estaLogueado: true,
      });
    }
  },

  // Getter (para acceder al estado desde fuera)
  getUsuario: () => get().usuario,
  getToken: () => get().token,
}));

export default useAuthStore;
```

### Uso en Componentes

```javascript
'use client';
import useAuthStore from '@/store/useAuthStore';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const usuario = useAuthStore((state) => state.usuario);
  const estaLogueado = useAuthStore((state) => state.estaLogueado);

  const handleLogin = async () => {
    await login('juan@example.com', 'password123');
  };

  return (
    <div>
      {estaLogueado ? (
        <p>Bienvenido, {usuario.nombre}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

---

## useCartStore - Carrito de Compras

```javascript
// store/useCartStore.js
import { create } from 'zustand';
import api from '@/lib/axios';

const useCartStore = create((set, get) => ({
  // Estado
  items: [],
  total: 0,

  // Acciones
  agregarAlCarrito: async (productoId, tallaId, cantidad) => {
    try {
      await api.post('/cart', { productoId, tallaId, cantidad });

      // Recargar carrito
      await get().cargarCarrito();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  cargarCarrito: async () => {
    try {
      const res = await api.get('/cart');
      const { items, total } = res.data;
      set({ items, total });
    } catch (error) {
      console.error('Error cargando carrito:', error);
    }
  },

  actualizarCantidad: async (itemId, cantidad) => {
    try {
      await api.patch(`/cart/${itemId}`, { cantidad });
      await get().cargarCarrito();
      return true;
    } catch (error) {
      return false;
    }
  },

  eliminarDelCarrito: async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await get().cargarCarrito();
      return true;
    } catch (error) {
      return false;
    }
  },

  vaciarCarrito: async () => {
    try {
      await api.delete('/cart');
      set({ items: [], total: 0 });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Getters
  getCantidadItems: () => get().items.length,
  getTotal: () => get().total,
}));

export default useCartStore;
```

### Uso en Componentes

```javascript
'use client';
import useCartStore from '@/store/useCartStore';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const eliminarDelCarrito = useCartStore((state) => state.eliminarDelCarrito);

  return (
    <div>
      <h1>Mi Carrito ({items.length} items)</h1>
      {items.map((item) => (
        <div key={item.id}>
          <p>{item.producto.nombre}</p>
          <p>${item.producto.precio}</p>
          <button onClick={() => eliminarDelCarrito(item.id)}>
            Eliminar
          </button>
        </div>
      ))}
      <h2>Total: ${total}</h2>
    </div>
  );
}
```

---

## useWishlistStore - Lista de Deseados

```javascript
// store/useWishlistStore.js
import { create } from 'zustand';

const useWishlistStore = create((set, get) => ({
  // Estado
  items: JSON.parse(localStorage.getItem('wishlist') || '[]'),

  // Acciones
  agregarAWishlist: (producto) => {
    const items = get().items;
    const existe = items.some((p) => p.id === producto.id);

    if (!existe) {
      const nuevosItems = [...items, producto];
      localStorage.setItem('wishlist', JSON.stringify(nuevosItems));
      set({ items: nuevosItems });
    }
  },

  eliminarDeWishlist: (productoId) => {
    const items = get().items.filter((p) => p.id !== productoId);
    localStorage.setItem('wishlist', JSON.stringify(items));
    set({ items });
  },

  estaEnWishlist: (productoId) => {
    return get().items.some((p) => p.id === productoId);
  },

  limpiarWishlist: () => {
    localStorage.removeItem('wishlist');
    set({ items: [] });
  },
}));

export default useWishlistStore;
```

---

## Patrón Completo: Subscription

Zustand permite subscribirse a cambios:

```javascript
const usuarioActual = useAuthStore.getState().usuario;

// Subscribirse a cambios
const unsubscribe = useAuthStore.subscribe(
  (state) => state.usuario,
  (usuario) => {
    console.log('Usuario cambió:', usuario);
  }
);

// Desuscribirse
unsubscribe();
```

---

## Persistencia

### Con AsyncStorage (React Native)

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      usuario: null,
      setUsuario: (usuario) => set({ usuario }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Con localStorage (Web)

```javascript
// Ya se hace manualmente en nuestros stores
localStorage.setItem('token', token);
localStorage.getItem('token');
```

---

## Debugging

### DevTools de Zustand

```bash
npm install zustand-devtools
```

```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAuthStore = create(
  devtools(
    (set) => ({
      usuario: null,
      setUsuario: (usuario) => set({ usuario }),
    }),
    { name: 'AuthStore' }
  )
);
```

---

## Best Practices

### ✅ Bien Organizado

```javascript
// store/useAuthStore.js
const useAuthStore = create((set, get) => ({
  // Estado al inicio
  usuario: null,
  token: null,

  // Acciones después
  login: async (...) => { },
  logout: () => { },

  // Getters al final
  getUsuario: () => get().usuario,
}));
```

### ✅ Separar por Dominio

```
store/
├── useAuthStore.js        # Autenticación
├── useCartStore.js        # Carrito
├── useWishlistStore.js    # Wishlist
└── useUIStore.js          # Estado de UI (modals, etc)
```

### ✅ Usar Selectors

```javascript
// ❌ Malo - Re-renderiza en cualquier cambio
const usuario = useAuthStore();

// ✅ Bien - Solo re-renderiza si usuario cambia
const usuario = useAuthStore((state) => state.usuario);
```

### ✅ Normalizar Estado

```javascript
// ❌ Anidado innecesariamente
const usuario = {
  id: 1,
  perfil: {
    nombre: 'Juan',
    avatar: { url: '...' },
  },
};

// ✅ Plano
const usuario = {
  id: 1,
  nombre: 'Juan',
  avatarUrl: '...',
};
```

---

## Integración con API

### Pattern: Load + Error + Success

```javascript
const useProductsStore = create((set) => ({
  productos: [],
  loading: false,
  error: null,

  cargarProductos: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get('/products');
      set({ productos: res.data.productos });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));

// Uso
export default function ProductsPage() {
  const { productos, loading, error, cargarProductos } = useProductsStore();

  useEffect(() => {
    cargarProductos();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {productos.map((p) => (
        <div key={p.id}>{p.nombre}</div>
      ))}
    </div>
  );
}
```

---

**Tiempo de lectura:** 15 minutos
**Nivel:** React Developer

Próxima lectura → [09_CONVENCIONES.md](./09_CONVENCIONES.md)
