const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const { verificarToken, soloAdmin } = require("../middlewares/auth.middleware");
const {
  listarTodos, crearProductoCompleto, editarProducto, editarProductoCompleto,
  actualizarStock, agregarImagen, eliminarImagen, eliminarProducto,
} = require("../controllers/adminProducts.controller");

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(verificarToken, soloAdmin);

router.get("/",                    listarTodos);
router.post("/",                   upload.array("imagenes", 5), crearProductoCompleto);
router.patch("/:id",                editarProducto);
router.patch("/:id/completo",       upload.array("imagenes", 5), editarProductoCompleto);
router.delete("/:id",               eliminarProducto);
router.patch("/stock/:tallaId",     actualizarStock);
router.post("/:id/imagen",          upload.single("imagen"), agregarImagen);
router.delete("/imagen/:imagenId",  eliminarImagen);

module.exports = router;