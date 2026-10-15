# 🔐 Sistema de Autenticación

## Descripción General

Oni Style utiliza **JWT (JSON Web Tokens)** para autenticación stateless. Los tokens tienen validez de **7 días** y pueden renovarse.

---

## Flujo de Autenticación

```
USUARIO
  │
  ├─ Ingresa email + password
  │
  └─> FRONTEND
       │
       POST /api/auth/register o /api/auth/login
       │
       └─> BACKEND
            │
            1. Hash password con bcryptjs
            2. Valida en BD
            3. Genera JWT con: user_id, rol, email
            4. Retorna token
            │
            └─> FRONTEND
                 │
                 1. Guarda token en localStorage
                 2. Guarda en Zustand (useAuthStore)
                 3. Redirige a /
                 │
                 └─> FUTURAS REQUESTS
                      │
                      Header: Authorization: Bearer <TOKEN>
                      │
                      └─> BACKEND verifica JWT
                           ├─ Válido → Acceso permitido
                           ├─ Expirado → Renew token
                           └─ Inválido → 401 Unauthorized
```

---

## JWT Structure

### Payload
```json
{
  "sub": 1,           // user_id
  "email": "juan@example.com",
  "rol": "cliente",   // "cliente" o "administrador"
  "iat": 1693564800,  // Issued at
  "exp": 1694169600   // Expires (7 días después)
}
```

### Cómo se ve un token
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoianVhbkBleGFtcGxlLmNvbSIsInJvbCI6ImNsaWVudGUiLCJpYXQiOjE2OTM1NjQ4MDAsImV4cCI6MTY5NDE2OTYwMH0.xyz...
```

---

## Implementación Backend

### Generación de Token

```javascript
// src/controllers/auth.controller.js
const jwt = require("jsonwebtoken");

const generarToken = (usuario) => {
  return jwt.sign(
    {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });

  const esValido = await bcryptjs.compare(password, usuario.password);
  if (!esValido) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = generarToken(usuario);

  res.json({
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
    token,
  });
};
```

### Middleware de Verificación

```javascript
// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];  // "Bearer TOKEN" → TOKEN

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Adjunta user al request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.user?.rol !== "administrador") {
    return res.status(403).json({ error: "Solo administradores pueden acceder" });
  }
  next();
};

module.exports = { verificarToken, soloAdmin };
```

### Uso en Rutas

```javascript
// src/routes/admin.routes.js
const router = express.Router();
const { verificarToken, soloAdmin } = require("../middlewares/auth.middleware");
const { listarPedidos } = require("../controllers/admin.controller");

// Requiere autenticación Y ser administrador
router.get("/pedidos", verificarToken, soloAdmin, listarPedidos);

module.exports = router;
```

---

## Encriptación de Contraseña

### Guardar (Hash)
```javascript
const bcryptjs = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

// En registro
const usuario = await prisma.usuario.create({
  data: {
    nombre: req.body.nombre,
    email: req.body.email,
    password: await hashPassword(req.body.password),  // ← Hasheada
    rol: "cliente",
  },
});
```

### Verificar (Comparar)
```javascript
const esValida = await bcryptjs.compare(passwordDelUsuario, passwordHasheada);

if (!esValida) {
  return res.status(401).json({ error: "Contraseña incorrecta" });
}
```

---

## Implementación Frontend

### Zustand Store

```javascript
// store/useAuthStore.js
import { create } from 'zustand';
import api from '@/lib/axios';

const useAuthStore = create((set) => ({
  usuario: null,
  token: null,
  estaLogueado: false,

  // Login
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { usuario, token } = res.data;

      // Guardar en localStorage
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('token', token);

      // Actualizar store
      set({ usuario, token, estaLogueado: true });

      return true;
    } catch (error) {
      console.error('Login fallido:', error);
      return false;
    }
  },

  // Registro
  register: async (nombre, email, password) => {
    try {
      const res = await api.post('/auth/register', { nombre, email, password });
      const { usuario, token } = res.data;

      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('token', token);

      set({ usuario, token, estaLogueado: true });

      return true;
    } catch (error) {
      console.error('Registro fallido:', error);
      return false;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    set({ usuario: null, token: null, estaLogueado: false });
  },

  // Restaurar sesión desde localStorage
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
}));

export default useAuthStore;
```

### Axios Interceptor

```javascript
// lib/axios.js
import axios from 'axios';
import useAuthStore from '@/store/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

// Interceptor de request - Agregar token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response - Manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expirado
    if (error.response?.status === 401) {
      const store = useAuthStore.getState();
      store.logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Componente de Login

```javascript
// app/auth/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      router.push('/'); // Redirige a home
    } else {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

### Ruta Protegida

```javascript
// app/admin/page.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function AdminPage() {
  const router = useRouter();
  const { usuario, estaLogueado } = useAuthStore();

  useEffect(() => {
    // Restaurar sesión al cargar
    useAuthStore.getState().restaurarSesion();
  }, []);

  useEffect(() => {
    // Proteger ruta
    if (estaLogueado && usuario?.rol !== 'administrador') {
      router.push('/');
    }
  }, [estaLogueado, usuario, router]);

  return <div>Panel Admin</div>;
}
```

---

## Seguridad

### ✅ Implementado

| Seguridad | Descripción |
|-----------|------------|
| **HTTPS** | Usar en producción (SSL/TLS) |
| **JWT Secret** | Guardado en .env, único y fuerte |
| **Bcrypt** | Password hasheado con salt 10 |
| **CORS** | Solo origen autorizado |
| **HttpOnly Cookie** | Token no accesible desde JS (opcional) |
| **Rol-based Access** | Admin vs Cliente |

### ⚠️ Recomendaciones Adicionales

```javascript
// 1. Rate limiting en login
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
});
router.post('/login', loginLimiter, login);

// 2. Refresh tokens (implementar)
const generarRefreshToken = (usuario) => {
  return jwt.sign(
    { sub: usuario.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );
};

// 3. Verificación de email (implementar)
// 4. 2FA - Two Factor Authentication (implementar)
// 5. Session invalidation on password change
```

---

## Troubleshooting

### Error: "Token inválido"
```
Causa: Token malformado o secret incorrecto
Solución: Verificar JWT_SECRET en .env es igual en backend
```

### Error: "Token expirado"
```
Causa: Token tiene más de 7 días
Solución: Usuario debe hacer login de nuevo
Mejor: Implementar refresh token
```

### Error: "No autorizado"
```
Causa: Falta header Authorization
Solución: Verificar que axios agrega Bearer token
```

### Error: "Solo administradores"
```
Causa: Usuario logueado pero no es admin
Solución: Usar rol "administrador" en BD
```

---

**Tiempo de lectura:** 20 minutos
**Nivel:** Full-Stack Developer

Próxima lectura → [07_FRONTEND_GUIDE.md](./07_FRONTEND_GUIDE.md)
