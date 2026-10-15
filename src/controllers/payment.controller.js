// src/controllers/payment.controller.js
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const prisma = require("../lib/prisma");

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// ── CREAR PREFERENCIA DE PAGO ─────────────────────────
const crearPreferencia = async (req, res) => {
  try {
    const { pedidoId } = req.body;
    const usuarioId    = req.usuario.id;

    const pedido = await prisma.pedido.findUnique({
      where:   { id: pedidoId },
      include: { detalles: { include: { producto: true } } },
    });

    if (!pedido || pedido.usuarioId !== usuarioId) {
      return res.status(404).json({ error: "Pedido no encontrado." });
    }

    const items = [{
      id: `pedido-${pedido.id}`,
      title: `Pedido ONI STYLE #${pedido.id}`,
      quantity: 1,
      unit_price: Number(pedido.total),
      currency_id: "COP",
    }];

    const preference = new Preference(mpClient);
    const respuesta  = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago/exitoso`,
          failure: `${process.env.FRONTEND_URL}/pago/fallido`,
          pending: `${process.env.FRONTEND_URL}/pago/pendiente`,
        },
        auto_return:          "approved",
        external_reference:   String(pedidoId),
        statement_descriptor: "ONI STYLE",
      },
    });

    res.json({ init_point: respuesta.init_point });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el pago." });
  }
};

// ── WEBHOOK — MercadoPago avisa cuando el pago es aprobado ──
const webhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const payment = new Payment(mpClient);
      const pago    = await payment.get({ id: data.id });

      if (pago.status === "approved") {
        const pedidoId = parseInt(pago.external_reference);
        const pedido = await prisma.pedido.findUnique({
          where: { id: pedidoId },
          include: { usuario: true },
        });

        const importeValido = pedido && Math.abs(Number(pago.transaction_amount) - Number(pedido.total)) < 0.01;
        if (importeValido && pedido.estado !== "pagado") {
          await prisma.$transaction(async (tx) => {
            await tx.pedido.update({
              where: { id: pedidoId },
              data: {
                estado:         "pagado",
                referenciaPago: String(pago.id),
                metodoPago:     pago.payment_type_id,
              },
            });

            if (pedido.usuario.referidoPorId) {
              const comision = Number(pedido.total) * 0.10;
              await tx.usuario.update({
                where: { id: pedido.usuario.referidoPorId },
                data: { creditoDisponible: { increment: comision } },
              });
            }
          });
        } else if (pedido && !importeValido) {
          console.error(`Importe de pago invalido para pedido ${pedidoId}.`);
        }
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { crearPreferencia, webhook };