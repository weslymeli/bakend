// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const prisma  = require("../lib/prisma");

// ── REGISTRO ──────────────────────────────────────────────────────
const registrar = async (req, res) => {
  try {
    const { nombre, email, password, codigoReferido: codigoDeInvitacion } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña son obligatorios." });
    }

    const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });

    if (usuarioExiste) {
      return res.status(409).json({ error: "Este correo ya está registrado. Usa otro." });
    }

    const passwordEncriptada = await bcrypt.hash(password, 12);

    let referidoPorId = null;
    if (codigoDeInvitacion) {
      const invitador = await prisma.usuario.findUnique({
        where: { codigoReferido: codigoDeInvitacion },
      });
      if (invitador) referidoPorId = invitador.id;
    }

    const nuevoUsuario = await prisma.usuario.create({
      data: { nombre, email, password: passwordEncriptada, referidoPorId },
    });

    const codigoPropio = `${nombre.split(' ')[0].toUpperCase()}${nuevoUsuario.id}`;
    await prisma.usuario.update({
      where: { id: nuevoUsuario.id },
      data: { codigoReferido: codigoPropio },
    });

    res.status(201).json({
      mensaje: "Cuenta creada con éxito. ¡Bienvenido a Oni Style!",
      usuario: { id: nuevoUsuario.id, nombre, email },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor. Intenta de nuevo." });
  }
};

// ── LOGIN ────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios." });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      mensaje: "Sesión iniciada correctamente.",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        creadoEn: usuario.creadoEn,
        codigoReferido: usuario.codigoReferido,
        creditoDisponible: usuario.creditoDisponible,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor." });
  }
};

module.exports = { registrar, login };