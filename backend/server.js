// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import authRoutes from "./routes/auth.js";
import packagesRoutes from "./routes/packages.js";
import bannerRoutes from "./routes/banner.js";

// Configuração do __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'banners');
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Configuração do CORS
app.use(cors({
  origin: '*', // Permite todas as origens (em produção, substitua por suas origens específicas)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cache-Control', 'Pragma'],
  credentials: true,
  exposedHeaders: ['Cache-Control', 'Pragma']
}));

// Middleware para adicionar headers CORS manualmente (backup)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/banner", bannerRoutes);

// Servir arquivos estáticos do diretório de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    name: 'API Bellare Viagens',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      packages: '/api/packages',
      rdstation: '/api/rdstation'
    }
  });
});

// Middleware para lidar com rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🔒' : err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Configuração da porta
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Inicia o servidor
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em modo ${NODE_ENV} na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}\n`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado (unhandledRejection):', err);
  // Encerra o processo com falha
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Exceção não capturada (uncaughtException):', err);
  // Encerra o processo com falha
  process.exit(1);
});

// Encerramento gracioso
const shutdown = () => {
  console.log('\n🛑 Encerrando o servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);