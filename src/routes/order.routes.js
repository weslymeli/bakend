const express = require("express");
const router  = express.Router();
const { verificarToken } = require("../middlewares/auth.middleware");
const { crearPedido, misPedidos } = require("../controllers/order.controller");

router.use(verificarToken);

router.post("/", crearPedido);
router.get("/mis-pedidos", misPedidos);

module.exports = router;