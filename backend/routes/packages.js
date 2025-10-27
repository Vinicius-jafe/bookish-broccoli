import express from "express";
import { openDb } from "../db.js";

const router = express.Router();

// cria tabela se não existir
async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
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

// Listar todos
router.get("/", async (req, res) => {
  const db = await openDb();
  const rows = await db.all("SELECT * FROM packages");
  res.json(rows);
});

// Adicionar / atualizar
router.post("/", async (req, res) => {
  const pkg = req.body;
  const db = await openDb();

  await db.run(
    `INSERT OR REPLACE INTO packages (id, title, type, region, destination, duration, priceFrom, shortDescription, longDescription)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pkg.id || String(Date.now()),
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
  res.json({ ok: true });
});

// Deletar
router.delete("/:id", async (req, res) => {
  const db = await openDb();
  await db.run("DELETE FROM packages WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

export default router;
