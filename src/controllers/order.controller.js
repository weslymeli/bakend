// src/controllers/order.controller.js
const prisma = require("../lib/prisma");

const crearPedido = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { direccion, codigoDescuento, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "El carrito esta vacio." });
    }

    // Busca si el usuario ya tiene una direccion guardada
    let direccionGuardada = await prisma.direccion.findFirst({
      where: { usuarioId },
      orderBy: { id: 'desc' },
    });

    if (!direccionGuardada && direccion) {
      direccionGuardada = await prisma.direccion.create({
        data: {
          usuarioId,
          nombreDest:     direccion.nombreDest,
          direccion:      direccion.direccion,
          barrio:         direccion.barrio || "",
          ciudad:         direccion.ciudad,
          departamento:   direccion.departamento,
          telefono:       direccion.telefono,
          predeterminada: true,
        },
      });
    }

    if (!direccionGuardada) {
      return res.status(400).json({ error: "Necesitamos tu direccion de envio para continuar." });
    }

    const direccionId = direccionGuardada.id;

    // Valida cada producto contra la base de datos real (nunca confies en el precio del frontend)
    let subtotal = 0;
    const detalles = [];

    for (const item of items) {
      const producto = await prisma.producto.findUnique({ where: { id: item.productoId } });
      if (!producto || !producto.activo) {
        return res.status(400).json({ error: `El producto ${item.productoId} ya no esta disponible.` });
      }

      const talla = await prisma.talla.findFirst({
        where: { productoId: item.productoId, nombre: item.talla },
      });
      if (!talla) {
        return res.status(400).json({ error: `Talla invalida para ${producto.nombre}.` });
      }

      const inventario = await prisma.inventario.findFirst({
        where: { productoId: item.productoId, tallaId: talla.id },
      });
      if (!inventario || inventario.cantidad < item.cantidad) {
        return res.status(400).json({ error: `Sin stock suficiente de ${producto.nombre} talla ${item.talla}.` });
      }

      const subtotalItem = Number(producto.precio) * item.cantidad;
      subtotal += subtotalItem;

      detalles.push({
        productoId: producto.id,
        tallaId:    talla.id,
        cantidad:   item.cantidad,
        precioUnit: producto.precio,
        subtotal:   subtotalItem,
      });
    }

    let descuento = 0;
    let codigoId  = null;

    if (codigoDescuento) {
      const codigo = await prisma.codigoDescuento.findUnique({ where: { codigo: codigoDescuento } });
      if (codigo && codigo.activo) {
        descuento = codigo.tipo === "porcentaje"
          ? subtotal * (Number(codigo.valor) / 100)
          : Number(codigo.valor);
        codigoId = codigo.id;
        await prisma.codigoDescuento.update({
          where: { id: codigo.id },
          data:  { usosActuales: { increment: 1 } },
        });
      }
    }

    const costoEnvio = subtotal >= 100000 ? 0 : 12900;
    const total       = subtotal - descuento + costoEnvio;

    const pedido = await prisma.pedido.create({
      data: {
        usuarioId,
        direccionId,
        codigoDescId: codigoId,
        subtotal,
        descuento,
        costoEnvio,
        total,
        estado:   "pendiente",
        detalles: { create: detalles },
      },
    });

    // Descuenta el stock inmediatamente al crear el pedido
    for (const item of items) {
      const talla = await prisma.talla.findFirst({
        where: { productoId: item.productoId, nombre: item.talla },
      });
      await prisma.inventario.updateMany({
        where: { productoId: item.productoId, tallaId: talla.id },
        data:  { cantidad: { decrement: item.cantidad } },
      });
    }

    res.status(201).json({
      mensaje:  "Pedido creado. Procede al pago.",
      pedidoId: pedido.id,
      total,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el pedido." });
  }
};
// ── VER MIS PEDIDOS (usuario logueado) ────────────────
const misPedidos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const pedidos = await prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        detalles: {
          include: {
            producto: { include: { imagenes: { where: { esPrincipal: true }, take: 1 } } },
            talla: true,
          },
        },
      },
      orderBy: { creadoEn: 'desc' },
    });

    res.json({ pedidos });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar tus pedidos." });
  }
};

module.exports = { crearPedido, misPedidos };