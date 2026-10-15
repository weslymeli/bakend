const express = require("express");
const router  = express.Router();
const { verificarToken }                              = require("../middlewares/auth.middleware");
const { verCarrito, agregarAlCarrito, eliminarDelCarrito } = require("../controllers/cart.controller");

router.use(verificarToken);

router.get("/",          verCarrito);
router.post("/agregar",  agregarAlCarrito);
router.delete("/eliminar", eliminarDelCarrito);

module.exports = router;