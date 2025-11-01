// server.js
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.js";
import packagesRoutes from "./routes/packages.js";

const app = express();
app.use(cors());
app.use(express.json());

// Configura o Express para servir arquivos estáticos da pasta 'uploads'.
// Isso é crucial para que as imagens carregadas sejam acessíveis via URL após o deploy.
// O path.resolve() garante que o caminho é absoluto, o que é robusto para diferentes ambientes (local/deploy).
// A URL de acesso será: [SEU_DOMINIO]/uploads/nome-do-arquivo.jpg
app.use('/uploads', express.static(path.resolve('uploads')));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/packages", packagesRoutes);

// Porta dinâmica (para ambientes de deploy como Render, Heroku, etc.) ou 4000 localmente
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});