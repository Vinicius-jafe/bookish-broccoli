import express from "express";
import { openDb } from "../db.js";

const router = express.Router();

// Função para criar slug automaticamente
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "-") // troca espaços por hífens
    .replace(/[^a-z0-9-]/g, ""); // remove caracteres especiais
}

// Inicializa o banco e cria tabela se não existir
async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
      slug TEXT,
      title TEXT,
      type TEXT,
      region TEXT,
      destination TEXT,
      duration INTEGER,
      priceFrom REAL,
      shortDescription TEXT,
      longDescription TEXT
    )
  `);
}
initDb();

// === LISTAR TODOS OS PACOTES ===
router.get("/", async (req, res) => {
  try {
    const db = await openDb();
    const rows = await db.all("SELECT * FROM packages");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar pacotes:", err);
    res.status(500).json({ error: "Erro ao listar pacotes" });
  }
});

// === ADICIONAR OU ATUALIZAR PACOTE ===
router.post("/", async (req, res) => {
  try {
    const pkg = req.body;
    const db = await openDb();

    // Gera slug automaticamente
    const slug = pkg.slug || slugify(pkg.title || "");

    await db.run(
      `INSERT OR REPLACE INTO packages 
      (id, slug, title, type, region, destination, duration, priceFrom, shortDescription, longDescription)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pkg.id || String(Date.now()),
        slug,
        pkg.title,
        pkg.type,
        pkg.region,
        pkg.destination,
        pkg.duration,
        pkg.priceFrom,
        pkg.shortDescription,
        pkg.longDescription,
      ]
    );

    res.json({ ok: true, slug });
  } catch (err) {
    console.error("Erro ao salvar pacote:", err);
    res.status(500).json({ error: "Erro ao salvar pacote" });
  }
});

// === DELETAR PACOTE ===
router.delete("/:id", async (req, res) => {
  try {
    const db = await openDb();
    await db.run("DELETE FROM packages WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao deletar pacote:", err);
    res.status(500).json({ error: "Erro ao deletar pacote" });
  }
});

export default router;
