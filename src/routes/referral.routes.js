const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/auth.middleware");
const { misReferidos } = require("../controllers/referral.controller");

router.get("/mis-referidos", verificarToken, misReferidos);

module.exports = router;
