// src/controllers/admin.controller.js
const prisma = require("../lib/prisma");

// ── VER TODOS LOS PEDIDOS ─────────────────────────────
const listarPedidos = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        usuario:  { select: { nombre: true, email: true } },
        direccion: true,
        detalles: { include: { producto: true, talla: true } },
      },
      orderBy: { creadoEn: "desc" },
    });

    res.json({ pedidos });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los pedidos." });
  }
};

// ── ACTUALIZAR ESTADO DE PEDIDO ───────────────────────
const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id }     = req.params;
    const { estado } = req.body;

    const estadosValidos = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado no válido." });
    }

    const pedido = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data:  { estado },
    });

    res.json({ mensaje: "Estado actualizado.", pedido });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el pedido." });
  }
};

// ── CREAR PRODUCTO ────────────────────────────────────
const crearProducto = async (req, res) => {
  try {
    const {
      nombre, slug, descripcion, precio,
      precioAntes, badge, destacado, categoriaId,
    } = req.body;

    const producto = await prisma.producto.create({
      data: {
        nombre,
        slug,
        descripcion,
        precio:      parseFloat(precio),
        precioAntes: precioAntes ? parseFloat(precioAntes) : null,
        badge:       badge || null,
        destacado:   destacado || false,
        categoriaId: parseInt(categoriaId),
      },
    });

    res.status(201).json({ mensaje: "Producto creado.", producto });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto." });
  }
};

// ── EDITAR PRODUCTO ───────────────────────────────────
const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datos  = req.body;

    if (datos.precio)      datos.precio      = parseFloat(datos.precio);
    if (datos.precioAntes) datos.precioAntes = parseFloat(datos.precioAntes);
    if (datos.categoriaId) datos.categoriaId = parseInt(datos.categoriaId);

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data:  datos,
    });

    res.json({ mensaje: "Producto actualizado.", producto });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar el producto." });
  }
};

// ── ELIMINAR PRODUCTO ─────────────────────────────────
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.producto.delete({
      where: { id: parseInt(id) },
    });

    res.json({ mensaje: "Producto eliminado." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto." });
  }
};

// ── ACTUALIZAR INVENTARIO ─────────────────────────────
const actualizarInventario = async (req, res) => {
  try {
    const { productoId, tallaId, cantidad } = req.body;

    const inventario = await prisma.inventario.upsert({
      where:  { productoId_tallaId: { productoId, tallaId } },
      update: { cantidad },
      create: { productoId, tallaId, cantidad },
    });

    res.json({ mensaje: "Inventario actualizado.", inventario });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar inventario." });
  }
};

// ── VER TODOS LOS USUARIOS ────────────────────────────
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id:           true,
        nombre:       true,
        email:        true,
        rol:          true,
        activo:       true,
        creadoEn:     true,
      },
      orderBy: { creadoEn: "desc" },
    });

    res.json({ usuarios });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar usuarios." });
  }
};

// ── ACTIVAR / DESACTIVAR USUARIO ──────────────────────
const toggleUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
    });

    const actualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data:  { activo: !usuario.activo },
    });

    res.json({
      mensaje: `Usuario ${actualizado.activo ? "activado" : "desactivado"}.`,
      activo:  actualizado.activo,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el usuario." });
  }
};

module.exports = {
  listarPedidos,
  actualizarEstadoPedido,
  crearProducto,
  editarProducto,
  eliminarProducto,
  actualizarInventario,
  listarUsuarios,
  toggleUsuario,
};