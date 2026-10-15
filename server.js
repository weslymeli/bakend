// server.js — El corazón del Backend de Oni Style
require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const http       = require("http");
const { Server } = require("socket.io");

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000" }
});

// ── MIDDLEWARES ──────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── RUTAS ────────────────────────────────────────────────
const authRoutes    = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");
const cartRoutes    = require("./src/routes/cart.routes");
const orderRoutes   = require("./src/routes/order.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const adminRoutes   = require("./src/routes/admin.routes");
const newsletterRoutes = require("./src/routes/newsletter.routes");
const referralRoutes = require("./src/routes/referral.routes");
const userRoutes = require("./src/routes/user.routes");
const chatRoutes = require("./src/routes/chat.routes");
const adminProductsRoutes = require("./src/routes/adminProducts.routes");

app.use("/api/auth",     authRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/chat",     chatRoutes);
app.use("/api/users", userRoutes);

// ── RUTA DE PRUEBA ───────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor Oni Style funcionando!", estado: "OK" });
});

// ── CHAT EN TIEMPO REAL ──────────────────────────────────
io.on("connection", (socket) => {
  console.log("Cliente conectado al chat:", socket.id);
  socket.on("enviar_mensaje", (datos) => {
    io.emit("nuevo_mensaje", datos);
  });
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// ── ARRANCAR SERVIDOR ────────────────────────────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor Oni Style corriendo en http://localhost:${PORT}`);
});