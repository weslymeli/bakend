const express = require("express");
const router  = express.Router();
const { verificarToken }                    = require("../middlewares/auth.middleware");
const { crearPreferencia, webhook }          = require("../controllers/payment.controller");

router.post("/crear",   verificarToken, crearPreferencia);
router.post("/webhook", webhook);

module.exports = router;