// src/routes/admin.routes.js
const express = require("express");
const router  = express.Router();
const { verificarToken, soloAdmin } = require("../middlewares/auth.middleware");
const {
  listarPedidos,
  actualizarEstadoPedido,
  crearProducto,
  editarProducto,
  eliminarProducto,
  actualizarInventario,
  listarUsuarios,
  toggleUsuario,
} = require("../controllers/admin.controller");

// Todas las rutas admin requieren token Y ser administrador
router.use(verificarToken, soloAdmin);

// ── PEDIDOS ───────────────────────────────────────────
router.get("/pedidos",          listarPedidos);
router.patch("/pedidos/:id",    actualizarEstadoPedido);

// ── PRODUCTOS ─────────────────────────────────────────
router.post("/productos",       crearProducto);
router.patch("/productos/:id",  editarProducto);
router.delete("/productos/:id", eliminarProducto);

// ── INVENTARIO ────────────────────────────────────────
router.post("/inventario",      actualizarInventario);

// ── USUARIOS ──────────────────────────────────────────
router.get("/usuarios",         listarUsuarios);
router.patch("/usuarios/:id",   toggleUsuario);

module.exports = router;