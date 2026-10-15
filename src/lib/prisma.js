// src/lib/prisma.js
const { PrismaClient } = require("@prisma/client");
const { PrismaPg }     = require("@prisma/adapter-pg");
const { Pool }         = require("pg");

// Pool maneja múltiples conexiones a la BD
// SSL es obligatorio para conectarse a Neon desde internet
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon requiere SSL pero acepta cualquier certificado
  },
});

const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

module.exports = prisma;