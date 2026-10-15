// src/controllers/chat.controller.js
const Groq = require("groq-sdk");
const prisma = require("../lib/prisma");

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY || process.env.grok_chat || process.env.GROQ_KEY;

  if (!apiKey || !apiKey.trim()) {
    return null;
  }

  return new Groq({ apiKey });
};

const groq = getGroqClient();

// Personalidad y conocimiento de la marca — esto es lo que hace que la IA
// hable como vendedor de Oni Style y no como un chatbot generico
const SYSTEM_PROMPT = `
Eres el asistente virtual de ONI Style, una marca de streetwear urbano premium
(estilo Represent, Fear of God, Cole Buxton). Tu tono es directo, seguro, con
personalidad de marca — nunca robotico ni generico.

INFORMACION DE LA TIENDA:
- Envios: solo a Colombia. Tiempo de entrega 3 a 6 dias habiles.
- Envio gratis en compras mayores a $100.000 COP. Si no, cuesta $12.900 COP.
- Devoluciones: 30 dias desde que llega el pedido, sin uso y con etiquetas.
- Metodos de pago: tarjetas credito/debito, PSE, Efecty, Bancolombia (via MercadoPago).
- Categorias: Hombre, Mujer, Accesorios. Subcategorias: Tenis, Jeans, Sudaderas, Camisetas.
- Tallas disponibles: XS, S, M, L, XL, XXL segun el producto.
- Los drops son de edicion limitada — una vez agotados, no siempre se reponen.

TU MISION:
- Responde siempre en espanol, de forma breve y directa (maximo 3-4 lineas).
- Genera urgencia y deseo de compra de forma sutil cuando sea natural (ej:
  mencionar que un producto es edicion limitada, o que el envio gratis aplica
  facil si agregan un producto mas).
- Si preguntan por tallas, invitalos a revisar la Guia de Tallas del sitio.
- Si preguntan por su pedido especifico o algo que no sabes, dirigelos a
  contactar por WhatsApp para atencion personalizada.
- Nunca inventes informacion que no tengas (precios exactos, stock exacto).
- Manten siempre un tono aspiracional, seguro, cercano — como el amigo que
  sabe de moda urbana, no como un robot de soporte.
`;

const enviarMensaje = async (req, res) => {
  try {
    const { mensaje, historial = [] } = req.body;

    if (!mensaje || !mensaje.trim()) {
      return res.status(400).json({ error: "El mensaje no puede estar vacio." });
    }

    if (!groq) {
      return res.status(503).json({
        error: "El asistente virtual no está disponible en este momento."
      });
    }

    // Arma el historial de conversacion para que la IA tenga contexto
    const mensajes = [
      { role: "system", content: SYSTEM_PROMPT },
      ...historial.slice(-6).map(h => ({
        role: h.tipo === "cliente" ? "user" : "assistant",
        content: h.texto,
      })),
      { role: "user", content: mensaje },
    ];

    const respuesta = await groq.chat.completions.create({
      messages: mensajes,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 200,
    });

    const textoRespuesta = respuesta.choices[0]?.message?.content
      || "Disculpa, no pude procesar tu mensaje. Intenta de nuevo.";

    res.json({ respuesta: textoRespuesta });

  } catch (error) {
    console.error("Error del chat IA:", error);
    res.status(500).json({
      error: "Nuestro asistente esta ocupado. Intenta de nuevo en un momento."
    });
  }
};

module.exports = { enviarMensaje, getGroqClient };