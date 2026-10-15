// src/controllers/adminProducts.controller.js
const cloudinary = require("cloudinary").v2;
const prisma = require("../lib/prisma");

const TALLAS_VALIDAS = {
  superior: new Set(["XS", "S", "M", "L", "XL", "XXL"]),
  jean: new Set(["28", "30", "32", "34", "36", "38", "40", "42"]),
  tenis: new Set(["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]),
  accesorio: new Set(["UNICA"]),
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Sube un archivo (buffer) a Cloudinary y devuelve la URL
function subirACloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "productos" },
      (error, result) => error ? reject(error) : resolve(result)
    );
    stream.end(buffer);
  });
}

function parsePrice(value, field = "precio") {
  const raw = String(value).replace(/\s/g, '');
  const parsed = Number(raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 999999999.99) throw new Error(`${field} debe ser un monto COP valido.`);
  return Math.round(parsed * 100) / 100;
}

function parseTallas(tallas) {
  const parsed = typeof tallas === 'string' ? JSON.parse(tallas || '[]') : (tallas || []);
  const usadas = new Set();
  return parsed.map(t => {
    const tipo = String(t.tipo || 'superior').toLowerCase();
    const nombre = String(t.nombre || '').trim().toUpperCase();
    const cantidad = Number(t.cantidad);
    if (!TALLAS_VALIDAS[tipo] || !TALLAS_VALIDAS[tipo].has(nombre) || !Number.isInteger(cantidad) || cantidad < 0) throw new Error(`Talla o stock invalido: ${t.nombre || 'vacia'}.`);
    if (usadas.has(`${tipo}:${nombre}`)) throw new Error(`La talla ${nombre} esta repetida.`);
    usadas.add(`${tipo}:${nombre}`);
    return { id: t.id ? Number(t.id) : null, tipo, nombre, cantidad };
  });
}

// ── LISTAR TODOS LOS PRODUCTOS (para el admin, incluye inactivos) ──
const listarTodos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true,
        subcategoria: true,
        imagenes: { orderBy: { orden: 'asc' } },
        tallas: true,
        inventario: true,
      },
      orderBy: { creadoEn: 'desc' },
    });
    res.json({ productos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los productos." });
  }
};

// ── CREAR PRODUCTO COMPLETO ──
const crearProductoCompleto = async (req, res) => {
  try {
    const { nombre, slug, descripcion, precio, precioAntes, badge, destacado, categoriaId, subcategoriaId, tallas } = req.body;
    const tallasParsed = parseTallas(tallas);
    const producto = await prisma.producto.create({ data: { nombre, slug, descripcion: descripcion || null, precio: parsePrice(precio), precioAntes: precioAntes ? parsePrice(precioAntes, 'precioAntes') : null, badge: badge || null, destacado: destacado === 'true' || destacado === true, categoriaId: parseInt(categoriaId), subcategoriaId: subcategoriaId ? parseInt(subcategoriaId) : null } });
    for (const t of tallasParsed) {
      const tallaCreada = await prisma.talla.create({ data: { nombre: t.nombre, tipo: t.tipo, productoId: producto.id } });
      await prisma.inventario.create({ data: { productoId: producto.id, tallaId: tallaCreada.id, cantidad: t.cantidad } });
    }
    if (req.files?.length) for (let i = 0; i < req.files.length; i++) {
      const resultado = await subirACloudinary(req.files[i].buffer);
      await prisma.imagenProducto.create({ data: { productoId: producto.id, url: resultado.secure_url, esPrincipal: i === 0, orden: i } });
    }
    res.status(201).json({ mensaje: 'Producto creado con exito.', productoId: producto.id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || 'Error al crear el producto.' });
  }
};

// ── EDITAR PRODUCTO (datos basicos) ──
const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, precioAntes, badge, destacado, activo } = req.body;

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: {
        ...(nombre && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(precio !== undefined && { precio: parsePrice(precio) }),
        ...(precioAntes !== undefined && { precioAntes: precioAntes ? parsePrice(precioAntes, "precioAntes") : null }),
        ...(badge !== undefined && { badge: badge || null }),
        ...(destacado !== undefined && { destacado: destacado === 'true' || destacado === true }),
        ...(activo !== undefined && { activo: activo === 'true' || activo === true }),
      },
    });

    res.json({ mensaje: "Producto actualizado.", producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto." });
  }
};

const editarProductoCompleto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, precio, precioAntes, badge, destacado, activo, tallas } = req.body;
    if (!Number.isInteger(id) || !nombre?.trim()) return res.status(400).json({ error: "Producto o nombre invalido." });
    const tallasParsed = parseTallas(tallas);
    const precioCop = parsePrice(precio);
    const precioAntesCop = precioAntes ? parsePrice(precioAntes, "precioAntes") : null;
    await prisma.$transaction(async tx => {
      await tx.producto.update({ where: { id }, data: { nombre: nombre.trim(), descripcion: descripcion || null, precio: precioCop, precioAntes: precioAntesCop, badge: badge || null, destacado: destacado === 'true' || destacado === true, activo: activo === 'true' || activo === true } });
      const existentes = await tx.talla.findMany({ where: { productoId: id }, select: { id: true } });
      const idsEnviados = new Set(tallasParsed.filter(t => t.id).map(t => t.id));
      for (const talla of tallasParsed) {
        if (talla.id && existentes.some(e => e.id === talla.id)) {
          await tx.talla.update({ where: { id: talla.id }, data: { nombre: talla.nombre, tipo: talla.tipo } });
          await tx.inventario.upsert({ where: { productoId_tallaId: { productoId: id, tallaId: talla.id } }, update: { cantidad: talla.cantidad }, create: { productoId: id, tallaId: talla.id, cantidad: talla.cantidad } });
        } else {
          const creada = await tx.talla.create({ data: { productoId: id, nombre: talla.nombre, tipo: talla.tipo } });
          await tx.inventario.create({ data: { productoId: id, tallaId: creada.id, cantidad: talla.cantidad } });
        }
      }
      for (const existente of existentes) if (!idsEnviados.has(existente.id)) await tx.inventario.updateMany({ where: { productoId: id, tallaId: existente.id }, data: { cantidad: 0 } });
    });
    if (req.files?.length) {
      const total = await prisma.imagenProducto.count({ where: { productoId: id } });
      for (let i = 0; i < req.files.length; i++) {
        const resultado = await subirACloudinary(req.files[i].buffer);
        await prisma.imagenProducto.create({ data: { productoId: id, url: resultado.secure_url, esPrincipal: total === 0 && i === 0, orden: total + i } });
      }
    }
    res.json({ mensaje: "Producto actualizado con exito." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || "Error al actualizar el producto." });
  }
};

// ── ACTUALIZAR STOCK DE UNA TALLA ESPECIFICA ──
const actualizarStock = async (req, res) => {
  try {
    const { tallaId } = req.params;
    const { cantidad } = req.body;

    const inventario = await prisma.inventario.findFirst({ where: { tallaId: parseInt(tallaId) } });
    if (!inventario) return res.status(404).json({ error: "Inventario no encontrado." });

    await prisma.inventario.update({
      where: { id: inventario.id },
      data: { cantidad: parseInt(cantidad) },
    });

    res.json({ mensaje: "Stock actualizado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el stock." });
  }
};

// ── AGREGAR IMAGEN A UN PRODUCTO EXISTENTE ──
const agregarImagen = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) return res.status(400).json({ error: "No se recibio ninguna imagen." });

    const resultado = await subirACloudinary(req.file.buffer);

    const totalImagenes = await prisma.imagenProducto.count({ where: { productoId: parseInt(id) } });

    const imagen = await prisma.imagenProducto.create({
      data: {
        productoId: parseInt(id),
        url: resultado.secure_url,
        esPrincipal: totalImagenes === 0,
        orden: totalImagenes,
      },
    });

    res.status(201).json({ mensaje: "Imagen agregada.", imagen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al subir la imagen." });
  }
};

// ── ELIMINAR IMAGEN ──
const eliminarImagen = async (req, res) => {
  try {
    const { imagenId } = req.params;
    await prisma.imagenProducto.delete({ where: { id: parseInt(imagenId) } });
    res.json({ mensaje: "Imagen eliminada." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la imagen." });
  }
};

// ── ELIMINAR PRODUCTO ──
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.producto.update({ where: { id: parseInt(id) }, data: { activo: false } });
    res.json({ mensaje: "Producto desactivado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto." });
  }
};

module.exports = {
  listarTodos, crearProductoCompleto, editarProducto, editarProductoCompleto,
  actualizarStock, agregarImagen, eliminarImagen, eliminarProducto,
};