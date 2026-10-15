const cloudinary = require("cloudinary").v2;
const prisma = require("../lib/prisma");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── ACTUALIZAR FOTO DE PERFIL ─────────────────────────
const actualizarAvatar = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    if (!req.file) {
      return res.status(400).json({ error: "No se recibio ninguna imagen." });
    }

    // Sube el archivo a Cloudinary desde el buffer en memoria
    const resultado = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "avatares", transformation: [{ width: 300, height: 300, crop: "fill", gravity: "face" }] },
        (error, result) => error ? reject(error) : resolve(result)
      );
      stream.end(req.file.buffer);
    });

    const usuario = await prisma.usuario.update({
      where: { id: usuarioId },
      data:  { avatarUrl: resultado.secure_url },
    });

    res.json({ mensaje: "Foto de perfil actualizada.", avatarUrl: usuario.avatarUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la foto de perfil." });
  }
};

// ── MIS RESENAS ────────────────────────────────────────
const misResenas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const resenas = await prisma.resena.findMany({
      where: { usuarioId },
      include: {
        producto: {
          include: { imagenes: { where: { esPrincipal: true }, take: 1 } },
        },
      },
      orderBy: { creadoEn: 'desc' },
    });

    res.json({ resenas });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar tus resenas." });
  }
};

module.exports = { actualizarAvatar, misResenas };
