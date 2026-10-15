const express = require("express");
const router  = express.Router();
const {
  listarProductos,
  obtenerProducto,
  productosDestacados,
  listarCategorias,
  listarSubcategorias
} = require("../controllers/product.controller");

router.get("/",           listarProductos);
router.get("/destacados", productosDestacados);
router.get("/categorias", listarCategorias);
router.get("/subcategorias", listarSubcategorias);
router.get("/:slug",      obtenerProducto);

module.exports = router;