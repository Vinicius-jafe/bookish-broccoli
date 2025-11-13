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

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, 'uploads', 'banners'),
  path.join(__dirname, 'uploads', 'packages')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

const app = express();

// ==============================
// CORS seguro
// ===============================
const allowedOrigins = [
  "https://bellarenda.vps-kinghost.net", // domínio de produção (HTTPS)
  "http://localhost:3000",              // para desenvolvimento local
  "http://localhost:4000",              // API local
  "http://177.153.60.151",              // IP sem porta (HTTP)
  "https://177.153.60.151",             // IP sem porta (HTTPS)
  "http://177.153.60.151:3000",         // Frontend no IP com porta 3000
  "https://177.153.60.151:3000"         // Frontend HTTPS no IP com porta 3000
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if the origin is in the allowed list or matches patterns
      if (allowedOrigins.includes(origin) || 
          origin.endsWith('.vps-kinghost.net') || 
          origin.includes('localhost')) {
        return callback(null, true);
      }
      
      console.error(`Origem não permitida pelo CORS: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
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
// Handle both /uploads and /api/uploads paths for backward compatibility
const uploadsPath = '/var/www/uploads';
app.use('/uploads', express.static(uploadsPath));
app.use('/api/uploads', express.static(uploadsPath));

// Log static file serving configuration
console.log('Serving static files from:', uploadsPath);
console.log('Available routes:');
console.log(`- /uploads/* -> ${uploadsPath}/*`);
console.log(`- /api/uploads/* -> ${uploadsPath}/*`);

// ===============================
// Rotas principais
// ===============================
// API Root Route
app.get('/api', (req, res) => {
  res.json({
    name: "API Bellare Viagens",
    version: "1.0.0",
    status: "ok",
    endpoints: {
      auth: "/api/auth",
      packages: "/api/packages",
      banner: "/api/banner"
    }
  });
});

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
