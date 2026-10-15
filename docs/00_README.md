# 📚 Documentación Técnica - Oni Style

## 📖 Índice de Documentación

Esta documentación está organizada en los siguientes módulos:

### 1. **Inicio Rápido**
- [00_README.md](./00_README.md) ← **Estás aquí**
- [01_INSTALACION.md](./01_INSTALACION.md) - Configuración inicial del proyecto

### 2. **Arquitectura y Diseño**
- [02_ARQUITECTURA.md](./02_ARQUITECTURA.md) - Diseño técnico general
- [03_ESTRUCTURA_CARPETAS.md](./03_ESTRUCTURA_CARPETAS.md) - Organización del código

### 3. **Backend**
- [04_DATABASE.md](./04_DATABASE.md) - Esquema de BD y modelos Prisma
- [05_API_ENDPOINTS.md](./05_API_ENDPOINTS.md) - Documentación de todas las rutas
- [06_AUTENTICACION.md](./06_AUTENTICACION.md) - Sistema de auth y JWT

### 4. **Frontend**
- [07_FRONTEND_GUIDE.md](./07_FRONTEND_GUIDE.md) - Estructura Next.js y componentes
- [08_ESTADO_GLOBAL.md](./08_ESTADO_GLOBAL.md) - Zustand stores y gestión de estado

### 5. **Estándares y Guías**
- [09_CONVENCIONES.md](./09_CONVENCIONES.md) - Estándares de código
- [10_GUIA_CONTRIBUCION.md](./10_GUIA_CONTRIBUCION.md) - Para nuevos desarrolladores

### 6. **Operaciones**
- [11_DEPLOYMENT.md](./11_DEPLOYMENT.md) - Guía de despliegue en producción
- [12_TROUBLESHOOTING.md](./12_TROUBLESHOOTING.md) - Solución de problemas comunes
- [13_VARIABLES_ENTORNO.md](./13_VARIABLES_ENTORNO.md) - Configuración de .env

---

## 🎯 Descripción General del Proyecto

**Oni Style** es una plataforma de e-commerce full-stack especializada en ropa urbana sostenible.

### Stack Tecnológico

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Lenguaje:** JavaScript (CommonJS)
- **Base de Datos:** PostgreSQL (Neon)
- **ORM:** Prisma 7.8.0
- **Autenticación:** JWT (jsonwebtoken)
- **Encriptación:** bcryptjs
- **Uploads:** Cloudinary + Multer
- **Pagos:** Mercado Pago
- **Email:** Resend
- **Chat en Tiempo Real:** Socket.io
- **IA:** Groq SDK

**Frontend:**
- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** JavaScript (ES6+)
- **Estilos:** Tailwind CSS
- **Gestión de Estado:** Zustand
- **HTTP Client:** Axios
- **Animaciones:** Framer Motion
- **Notificaciones:** Sonner
- **Iconos:** Lucide React

### Características Principales

✅ **E-commerce completo** - Catálogo, carrito, checkout, órdenes
✅ **Autenticación** - Registro, login, recuperación de contraseña
✅ **Panel de administración** - Gestión de productos, pedidos, usuarios
✅ **Sistema de referidos** - Programa de afiliados con crédito disponible
✅ **Chat en tiempo real** - Soporte al cliente con Socket.io
✅ **Procesamiento de pagos** - Integración con Mercado Pago
✅ **Gestión de inventario** - Control de stock por talla
✅ **Sistema de newsletter** - Email marketing con Resend
✅ **Rastreo de pedidos** - Seguimiento en tiempo real
✅ **IA integrada** - Chatbot con Groq para soporte

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Idioma Backend** | JavaScript (Node.js) |
| **Idioma Frontend** | JavaScript (React/Next.js) |
| **Rutas API** | 10+ módulos |
| **Modelos BD** | 15+ tablas |
| **Componentes Frontend** | 40+ componentes |
| **Dependencias Totales** | 25+ librerías principales |

---

## 🚀 Inicio Rápido

### Para Desarrolladores Nuevos:
```bash
# 1. Leer esta documentación (10 mins)
# 2. Seguir INSTALACION.md (15 mins)
# 3. Leer ARQUITECTURA.md (15 mins)
# 4. Hacer el primer cambio siguiendo CONVENCIONES.md
```

### Para Desarrolladores Experimentados:
```bash
# Clona el repo, instala dependencias, copia .env, corre npm run dev
# Consulta API_ENDPOINTS.md cuando sea necesario
```

---

## 📞 Contacto y Soporte

- **Líder de Proyecto:** [Asignar contacto]
- **Líder Backend:** [Asignar contacto]
- **Líder Frontend:** [Asignar contacto]
- **DevOps/Infraestructura:** [Asignar contacto]

---

## 📝 Versión

**Versión Actual:** 1.0.0
**Última Actualización:** 2026-09-01
**Estado:** En Desarrollo Activo

---

**⚠️ NOTA IMPORTANTE:** Esta documentación debe mantenerse actualizada con cada cambio significativo en la arquitectura o funcionalidad.

Próxima lectura recomendada → [01_INSTALACION.md](./01_INSTALACION.md)
