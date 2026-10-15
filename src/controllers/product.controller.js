// src/controllers/product.controller.js
const prisma = require("../lib/prisma");

// ── LISTAR TODOS LOS PRODUCTOS ────────────────────────
const listarProductos = async (req, res) => {
  try {
    const { categoria, subcategoria, precioMin, precioMax, orden, busqueda } = req.query;

    const where = { activo: true };

    if (categoria) {
      where.categoria = { slug: categoria };
    }
    
    if (subcategoria) {
  where.subcategoria = { slug: subcategoria };
}

    if (busqueda) {
      where.nombre = { contains: busqueda, mode: "insensitive" };
    }

    if (precioMin || precioMax) {
      where.precio = {};
      if (precioMin) where.precio.gte = parseFloat(precioMin);
      if (precioMax) where.precio.lte = parseFloat(precioMax);
    }

    const orderBy =
      orden === "precio_asc"  ? { precio: "asc"  } :
      orden === "precio_desc" ? { precio: "desc" } :
      orden === "nombre"      ? { nombre: "asc"  } :
      { creadoEn: "desc" };

    const productos = await prisma.producto.findMany({
      where,
      orderBy,
      include: {
        categoria:  { select: { nombre: true, slug: true } },
        imagenes:   { where: { esPrincipal: true }, take: 1 },
        inventario: true,
      },
    });

    const productosConStock = productos.map(prod => ({
      ...prod,
      agotado: prod.inventario.every(inv => inv.cantidad === 0),
    }));

    res.json({ productos: productosConStock, total: productosConStock.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar los productos." });
  }
};

// ── DETALLE DE UN PRODUCTO ───────────────────────────
const obtenerProducto = async (req, res) => {
  try {
    const { slug } = req.params;

    const producto = await prisma.producto.findUnique({
      where:   { slug },
      include: {
        categoria:  true,
        imagenes:   { orderBy: { orden: "asc" } },
        tallas:     true,
        inventario: true,
        resenas:    {
          where:   { aprobada: true },
          include: { usuario: { select: { nombre: true } } },
        },
      },
    });

    if (!producto || !producto.activo) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json({ producto });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar el producto." });
  }
};

// ── PRODUCTOS DESTACADOS ─────────────────────────────
const productosDestacados = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      where:   { activo: true, destacado: true },
      take:    4,
      include: { imagenes: { where: { esPrincipal: true }, take: 1 } },
      orderBy: { creadoEn: "desc" },
    });

    res.json({ productos });

  } catch (error) {
    res.status(500).json({ error: "Error al cargar destacados." });
  }
};

// ── CATEGORÍAS ───────────────────────────────────────
const listarCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { activa: true },
    });

    res.json({ categorias });

  } catch (error) {
    res.status(500).json({ error: "Error al cargar categorías." });
  }
};
// ── LISTAR SUBCATEGORIAS DE UNA CATEGORIA ────────────
const listarSubcategorias = async (req, res) => {
  try {
    const { categoria } = req.query;

    const where = {};
    if (categoria) {
      where.categoria = { slug: categoria };
    }

    const subcategorias = await prisma.subcategoria.findMany({
      where,
      orderBy: { nombre: "asc" },
    });

    res.json({ subcategorias });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar subcategorias." });
  }
};
module.exports = { listarProductos, obtenerProducto, productosDestacados, listarCategorias, listarSubcategorias };
