// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "No hay token. Inicia sesión primero." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado. Inicia sesión de nuevo." });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "administrador") {
    return res.status(403).json({ error: "Solo el administrador puede hacer esto." });
  }
  next();
};

module.exports = { verificarToken, soloAdmin };