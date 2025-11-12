// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import authRoutes from "./routes/auth.js";
import packagesRoutes from "./routes/packages.js";
import bannerRoutes from "./routes/banner.js";

// ===============================
// Configuração de diretórios
// ===============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante que a pasta de uploads exista
const uploadsDir = path.join(__dirname, "uploads", "banners");
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// ==============================
// CORS seguro
// ===============================
const allowedOrigins = [
  "https://bellarenda.vps-kinghost.net", // domínio de produção (HTTPS)
  "http://localhost:3000",              // opcional para testes locais
  
  // FIX: Adicionar o IP do servidor (sem porta) para lidar com requisições que usam o IP como origem
  // O frontend pode estar rodando na porta padrão (80/443) e chamando a API pela porta 4000
  "http://177.153.60.151",
  "https://177.153.60.151",
  // Se o frontend estiver rodando em uma porta específica no IP, adicione-a aqui:
  "http://177.153.60.151:*"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Nota: `!origin` permite requisições do mesmo domínio ou ferramentas como Postman
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Origem não permitida pelo CORS: ${origin}`);
        callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Cache-Control",
      "Pragma"
    ],
    credentials: true
  })
);

// ===============================
// Middlewares básicos
// ===============================

// Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Parser de JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir arquivos estáticos (imagens, uploads, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// Rotas principais
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/banner", bannerRoutes);

// ===============================
// Rota raiz e saúde
// ===============================
app.get("/", (req, res) => {
  res.json({
    name: "API Bellare Viagens",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      packages: "/api/packages",
      banner: "/api/banner"
    }
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ===============================
// Erros e exceções
// ===============================
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.originalUrl,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error("Erro não tratado:", {
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🔒" : err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor"
        : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

// ===============================
// Inicialização do servidor
// ===============================
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em modo ${NODE_ENV} na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}\n`);
});

// ===============================
// Encerramento e falhas
// ===============================
process.on("unhandledRejection", (err) => {
  console.error("Erro não tratado (unhandledRejection):", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Exceção não capturada (uncaughtException):", err);
  process.exit(1);
});

const shutdown = () => {
  console.log("\n🛑 Encerrando o servidor...");
  server.close(() => {
    console.log("✅ Servidor encerrado com sucesso");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
