const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const { verificarToken } = require("../middlewares/auth.middleware");
const { actualizarAvatar, misResenas } = require("../controllers/user.controller");

// Guarda el archivo en memoria (RAM) para subirlo directo a Cloudinary sin guardarlo en disco
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/avatar", verificarToken, upload.single("avatar"), actualizarAvatar);
router.get("/mis-resenas", verificarToken, misResenas);

module.exports = router;
