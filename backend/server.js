import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import packagesRoutes from "./routes/packages.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/packages", packagesRoutes);

// Porta dinâmica (Render) ou 4000 localmente
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

