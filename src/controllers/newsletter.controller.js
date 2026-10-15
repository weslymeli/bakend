// src/controllers/newsletter.controller.js
// Resend puede exportar como default (ESM) o como módulo (CJS).
const ResendModule = require("resend");
const Resend = ResendModule?.Resend || ResendModule?.default || ResendModule;
const prisma = require("../lib/prisma");

const resend = new Resend(process.env.RESEND_API_KEY);

// Plantilla del correo — diseño luxury/premium, oscuro con acento rojo
const plantillaCorreo = (email) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif; }
    .contenedor { max-width: 560px; margin: 0 auto; background-color: #0a0a0a; }
    .header { padding: 48px 40px 24px; text-align: center; }
    .logo { font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 4px; margin: 0; }
    .logo span { color: #e63946; }
    .linea { width: 40px; height: 2px; background-color: #e63946; margin: 24px auto; border: none; }
    .hero-img { width: 100%; height: 280px; object-fit: cover; display: block; }
    .contenido { padding: 40px; text-align: center; }
    .titulo { font-size: 28px; color: #ffffff; font-weight: bold; margin: 0 0 16px; letter-spacing: 1px; }
    .texto { font-size: 15px; color: #888888; line-height: 1.7; margin: 0 0 32px; }
    .boton { display: inline-block; background-color: #ffffff; color: #0a0a0a; text-decoration: none;
      padding: 16px 40px; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
    .beneficios { padding: 0 40px 40px; }
    .beneficio { display: flex; align-items: center; padding: 16px 0; border-top: 1px solid #1a1a1a; }
    .beneficio-texto { color: #cccccc; font-size: 14px; margin: 0; }
    .footer { padding: 32px 40px; text-align: center; border-top: 1px solid #1a1a1a; }
    .footer-texto { font-size: 11px; color: #555555; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <div class="contenedor">
    <div class="header">
      <p class="logo">ONI<span>.</span></p>
      <hr class="linea"/>
    </div>

    <img class="hero-img" src="https://res.cloudinary.com/sppugtf0/image/upload/v1785208645/copy_of_vino-li-v5nskvo805c-unsplash_w9udo1.jpg" alt="Oni Style"/>

    <div class="contenido">
      <p class="titulo">Bienvenido a la familia ONI.</p>
      <p class="texto">
        Acabas de desbloquear acceso exclusivo a nuestros drops limitados, preventas
        anticipadas y ofertas reservadas solo para nuestra comunidad.
      </p>
      <a href="http://localhost:3000/productos" class="boton">Explorar coleccion</a>
    </div>

    <div class="beneficios">
      <div class="beneficio"><p class="beneficio-texto">✓ Acceso anticipado a nuevos drops</p></div>
      <div class="beneficio"><p class="beneficio-texto">✓ Descuentos exclusivos para suscriptores</p></div>
      <div class="beneficio"><p class="beneficio-texto">✓ Contenido detras de camaras de cada coleccion</p></div>
    </div>

    <div class="footer">
      <p class="footer-texto">
        Recibiste este correo porque te suscribiste en oni-style.com<br/>
        © 2026 Oni Style — Urban Streetwear Redefined
      </p>
    </div>
  </div>
</body>
</html>
`;

// ── SUSCRIBIR AL NEWSLETTER ────────────────────────────
const suscribir = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Ingresa un correo valido." });
    }

    // Verifica si ya esta suscrito
    const existente = await prisma.suscriptor.findUnique({ where: { email } });

    if (existente) {
      return res.status(409).json({ error: "Este correo ya esta suscrito." });
    }

    // Guarda el suscriptor en la base de datos
    await prisma.suscriptor.create({ data: { email } });

    // Envia el correo de bienvenida y loguea la respuesta de Resend para depuración
    const sendResponse = await resend.emails.send({
      from: "ONI Style <onboarding@resend.dev>",
      to: email,
      subject: "Bienvenido a ONI Style — Acceso exclusivo desbloqueado",
      html: plantillaCorreo(email),
    });

    console.log('Resend send response:', sendResponse);

    // Devuelve el id de mensaje de Resend en la respuesta para facilitar debugging
    res.status(201).json({ mensaje: "Suscripcion exitosa. Revisa tu correo.", resend: { id: sendResponse?.id } });

  } catch (error) {
    console.error('Error en suscribir:', error?.response?.data || error);
    res.status(500).json({ error: "Error al procesar la suscripcion.", details: error?.response?.data || error?.message });
  }
};

module.exports = { suscribir };