// src/controllers/cart.controller.js
const prisma = require("../lib/prisma");

// El carrito vive en memoria mientras el servidor está corriendo
// Estructura: { 1: [{productoId:3, tallaId:2, cantidad:1}], 2: [...] }
const carritosTemporal = {};

const verCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const items     = carritosTemporal[usuarioId] || [];

    if (items.length === 0) {
      return res.json({ items: [], subtotal: 0 });
    }

    const itemsConDetalle = await Promise.all(items.map(async item => {
      const producto = await prisma.producto.findUnique({
        where:   { id: item.productoId },
        include: { imagenes: { where: { esPrincipal: true }, take: 1 } },
      });
      const talla = await prisma.talla.findUnique({ where: { id: item.tallaId } });
      return { ...item, producto, talla, subtotalItem: producto.precio * item.cantidad };
    }));

    const subtotal = itemsConDetalle.reduce((acc, i) => acc + Number(i.subtotalItem), 0);

    res.json({ items: itemsConDetalle, subtotal: subtotal.toFixed(2) });

  } catch (error) {
    res.status(500).json({ error: "Error al cargar el carrito." });
  }
};

const agregarAlCarrito = async (req, res) => {
  try {
    const usuarioId                       = req.usuario.id;
    const { productoId, tallaId, cantidad = 1 } = req.body;

    const stock = await prisma.inventario.findUnique({
      where: { productoId_tallaId: { productoId, tallaId } },
    });

    if (!stock || stock.cantidad < cantidad) {
      return res.status(400).json({ error: "No hay suficiente stock disponible." });
    }

    if (!carritosTemporal[usuarioId]) carritosTemporal[usuarioId] = [];

    const itemExistente = carritosTemporal[usuarioId].find(
      i => i.productoId === productoId && i.tallaId === tallaId
    );

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      carritosTemporal[usuarioId].push({ productoId, tallaId, cantidad });
    }

    res.json({ mensaje: "Producto agregado al carrito." });

  } catch (error) {
    res.status(500).json({ error: "Error al agregar al carrito." });
  }
};

const eliminarDelCarrito = async (req, res) => {
  try {
    const usuarioId            = req.usuario.id;
    const { productoId, tallaId } = req.body;

    carritosTemporal[usuarioId] = (carritosTemporal[usuarioId] || []).filter(
      i => !(i.productoId === productoId && i.tallaId === tallaId)
    );

    res.json({ mensaje: "Producto eliminado del carrito." });

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar del carrito." });
  }
};

module.exports = { verCarrito, agregarAlCarrito, eliminarDelCarrito, carritosTemporal };