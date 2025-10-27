import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import packagesRoutes from "./routes/packages.js";

const app = express();
app.use(cors());
app.use(express.json());

// rotas
app.use("/api/auth", authRoutes);
app.use("/api/packages", packagesRoutes);

// servidor local
const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
