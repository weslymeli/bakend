# 🤝 Guía de Contribución

Bienvenido al equipo de Oni Style. Esta guía te ayudará a contribuir de forma efectiva.

---

## Flujo de Trabajo

### 1. Preparación

```bash
# Clona el repo
git clone <url>
cd proyecto-oni-style

# Crea tu rama
git checkout -b feature/tu-feature
# o
git checkout -b fix/tu-bug
# o
git checkout -b docs/actualizar-readme
```

### 2. Desarrollo

```bash
# Instala dependencias
npm install

# Copia .env
cp .env.example .env

# Corre tests (si existen)
npm test

# Inicia servidor en modo watch
npm run dev
```

### 3. Commit

```bash
# Commits pequeños y claros
git add .
git commit -m "feat: agregar paginación a productos"

# Sigue convenciones de commits
# feat:, fix:, docs:, refactor:, style:, test:, chore:
```

### 4. Push y Pull Request

```bash
git push origin feature/tu-feature
```

**En GitHub:**
1. Abre Pull Request
2. Llena la descripción con contexto
3. Referencia issues relacionados: "Fixes #123"
4. Pide review a un compañero

---

## Estructura de una Feature

### Antes de Empezar

1. **Revisa issues existentes** - Evita duplicar trabajo
2. **Crea un issue** si no existe
3. **Asigna el issue** a ti mismo
4. **Crea rama desde main** - Siempre del último código

### Durante el Desarrollo

1. **Tests primero** - Test-Driven Development
2. **Commits pequeños** - Cambios lógicos
3. **Actualiza docs** si cambias API o estructura
4. **No elimines código** de otras features

### Antes del PR

Ejecuta:
```bash
npm run dev      # ¿Todo funciona?
npm test         # ¿Tests pasan?
npm run lint     # ¿Hay warnings? (si existe linter)
```

---

## Tipos de Contribuciones

### 1. Nuevas Features

**Ejemplo: Agregar wishlist**

```
Branch: feature/wishlist
Commits:
  - feat: crear modelo Wishlist en Prisma
  - feat: crear rutas de wishlist en backend
  - feat: crear controllers de wishlist
  - feat: crear useWishlistStore
  - feat: crear componente WishlistButton
  - docs: actualizar API_ENDPOINTS.md
```

### 2. Bug Fixes

**Ejemplo: Corregir error CORS**

```
Branch: fix/cors-admin-products
Commits:
  - fix: mover middlewares CORS antes de rutas
  - fix: reordenar rutas admin
  - test: verificar CORS headers
```

### 3. Documentación

**Ejemplo: Actualizar guía de instalación**

```
Branch: docs/installation-guide
Commits:
  - docs: agregar paso de configuración .env
  - docs: actualizar troubleshooting
```

---

## Estándares de Código

### Backend

```javascript
// ✅ BIEN
const obtenerProductos = async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    
    const productos = await prisma.producto.findMany({
      where: { activo: true },
      skip: (pagina - 1) * limite,
      take: limite,
      include: { imagenes: true },
    });

    res.json({ productos, pagina });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
```

### Frontend

```javascript
'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

// ✅ BIEN
export default function ProductsPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get('/products');
        setProductos(res.data.productos);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {productos.map((p) => (
            <div key={p.id}>{p.nombre}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Processo de Review

### Para el Autor del PR

- Describe qué cambios hiciste
- Por qué los hiciste
- Cómo testeaste
- Capturas de pantalla (si es UI)

### Para el Revisor

```
Revisar:
□ Código sigue convenciones
□ Lógica es correcta
□ Manejo de errores
□ Performance
□ Seguridad
□ Documentación
□ Tests (si aplica)

Comentar:
- Ser constructivo
- Hacer preguntas, no órdenes
- Sugerir mejoras
```

---

## Agregar Nueva Ruta API

### Pasos

1. **Crear Controller**
```javascript
// src/controllers/newFeature.controller.js
const obtenerDatos = async (req, res) => {
  // lógica
};

module.exports = { obtenerDatos };
```

2. **Crear Rutas**
```javascript
// src/routes/newFeature.routes.js
const router = express.Router();
const { verificarToken } = require("../middlewares/auth.middleware");
const { obtenerDatos } = require("../controllers/newFeature.controller");

router.get("/", obtenerDatos);
router.get("/:id", verificarToken, obtenerDatos);

module.exports = router;
```

3. **Registrar en server.js**
```javascript
const newFeatureRoutes = require("./src/routes/newFeature.routes");
app.use("/api/newfeature", newFeatureRoutes);
```

4. **Documentar en [05_API_ENDPOINTS.md](./05_API_ENDPOINTS.md)**

---

## Agregar Modelo a Prisma

### Pasos

1. **Editar schema.prisma**
```prisma
model NuevaTabla {
  id        Int     @id @default(autoincrement())
  nombre    String
  
  usuario   Usuario @relation(fields: [usuarioId], references: [id])
  usuarioId Int
  
  @@map("nueva_tabla")
}
```

2. **Crear migración**
```bash
npx prisma migrate dev --name agregar_nueva_tabla
```

3. **Usar en controller**
```javascript
const nueva = await prisma.nuevaTabla.create({ data: { ... } });
```

4. **Documentar en [04_DATABASE.md](./04_DATABASE.md)**

---

## Testing

### Agregar Test

```javascript
// tests/producto.test.js
const { crearProducto } = require('../src/controllers/product.controller');

describe('crearProducto', () => {
  it('debe crear un producto válido', async () => {
    const req = {
      body: {
        nombre: 'Test Producto',
        precio: 50000,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await crearProducto(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});
```

### Ejecutar Tests

```bash
npm test
npm test --watch
npm test --coverage
```

---

## Seguridad

### Checklist de Seguridad

Antes de mergear, verifica:

- [ ] No hay secretos en código (API keys, passwords)
- [ ] Validaciones de input
- [ ] Autenticación/Autorización correcta
- [ ] SQL Injection imposible (usando Prisma)
- [ ] CORS configurado correctamente
- [ ] Rate limiting donde sea necesario
- [ ] Logging de acciones sensibles

---

## Performance

### Optimizaciones a Considerar

- [ ] Índices en BD para búsquedas frecuentes
- [ ] Lazy loading de imágenes
- [ ] Caching de datos estáticos
- [ ] Paginación en listas grandes
- [ ] Compresión de assets

---

## Troubleshooting Común

### "El servidor no inicia"
```bash
# Puerto en uso
lsof -i :4000
kill -9 <PID>

# Dependencias faltantes
rm -rf node_modules
npm install
```

### "Errores de Prisma"
```bash
# Generar cliente
npx prisma generate

# Ver estado de migraciones
npx prisma migrate status
```

### "Token expirado"
```bash
# Logout y login de nuevo
localStorage.removeItem('token')
localStorage.removeItem('usuario')
```

---

## Preguntas Frecuentes

**P: ¿Qué rama uso?**
A: `main` es producción. Siempre crea rama desde `main`.

**P: ¿Cuántos commits debo tener?**
A: Commits pequeños y lógicos (1-5 por feature pequeña).

**P: ¿Cómo mergeo mi rama?**
A: A través de Pull Request en GitHub, requiere 1 review.

**P: ¿Qué si hay conflictos?**
A: Resuelve en tu rama local, haz commit, y push de nuevo.

**P: ¿Cómo reporto un bug?**
A: Crea un issue con: pasos para reproducir, resultado esperado, resultado actual.

---

## Contacto y Ayuda

- 📧 **Email:** [tu-email@empresa.com]
- 💬 **Slack:** #desarrollo
- 📞 **Lead Dev:** [nombre]

**¡Bienvenido al equipo! 🎉**

---

**Tiempo de lectura:** 15 minutos
**Nivel:** Nuevo Developer

Próxima lectura → [11_DEPLOYMENT.md](./11_DEPLOYMENT.md)
