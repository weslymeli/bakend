const prisma = require("../lib/prisma");

const misReferidos = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      include: {
        referidos: {
          include: {
            pedidos: {
              where: { estado: { in: ["pagado", "enviado", "entregado"] } },
            },
          },
        },
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const referidosConDatos = usuario.referidos.map((referido) => ({
      id: referido.id,
      nombre: referido.nombre,
      totalCompras: referido.pedidos.length,
      completado: referido.pedidos.length > 0,
    }));

    res.json({
      codigoReferido: usuario.codigoReferido,
      creditoDisponible: usuario.creditoDisponible,
      referidos: referidosConDatos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar tus referidos." });
  }
};

module.exports = { misReferidos };
