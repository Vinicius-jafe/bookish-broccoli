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

// Inicializa o banco e cria/atualiza a tabela se necessário
async function initDb() {
  const db = await openDb();

  // CORREÇÃO: Cria tabela com TODOS os campos necessários
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
      longDescription TEXT,
      slug TEXT,               
      images TEXT,             
      inclusions TEXT,         
      months TEXT,             
      featuredHome INTEGER     
    )
  `);

  // Se a tabela já existia sem as colunas novas, este bloco faria a migração
  // (Mantido por segurança, mas o CREATE TABLE acima já resolve o problema principal)
  try {
    const cols = await db.all("PRAGMA table_info(packages)");
    if (!cols.some(c => c.name === "slug")) await db.exec("ALTER TABLE packages ADD COLUMN slug TEXT;");
    if (!cols.some(c => c.name === "images")) await db.exec("ALTER TABLE packages ADD COLUMN images TEXT;");
    if (!cols.some(c => c.name === "inclusions")) await db.exec("ALTER TABLE packages ADD COLUMN inclusions TEXT;");
    if (!cols.some(c => c.name === "months")) await db.exec("ALTER TABLE packages ADD COLUMN months TEXT;");
    if (!cols.some(c => c.name === "featuredHome")) await db.exec("ALTER TABLE packages ADD COLUMN featuredHome INTEGER DEFAULT 0;");
    console.log("🟢 Colunas verificadas/adicionadas à tabela packages");
  } catch (err) {
    // Este erro deve ser raro com o "IF NOT EXISTS"
    console.error("Erro ao tentar adicionar colunas:", err);
  }
}
initDb();

// Função auxiliar para desserializar os campos JSON
function deserializePackage(p) {
    if (!p) return null;
    return {
        ...p,
        images: JSON.parse(p.images || "[]"),
        inclusions: JSON.parse(p.inclusions || "[]"),
        months: JSON.parse(p.months || "[]"),
        featuredHome: !!p.featuredHome, // Converter 0/1 para booleano
    };
}

// === LISTAR TODOS OS PACOTES ===
router.get("/", async (req, res) => {
  try {
    const db = await openDb();
    const rows = await db.all("SELECT * FROM packages");
    
    // CORREÇÃO: Desserializar os campos JSON para arrays/booleanos
    const data = rows.map(deserializePackage);
    
    res.json(data);
  } catch (err) {
    console.error("Erro ao listar pacotes:", err);
    res.status(500).json({ error: "Erro ao listar pacotes" });
  }
});

// === BUSCAR PACOTE POR SLUG (Melhoria de Performance) ===
router.get("/:slug", async (req, res) => {
  try {
    const db = await openDb();
    const row = await db.get("SELECT * FROM packages WHERE slug = ?", [req.params.slug]);
    
    if (!row) {
      return res.status(404).json({ error: "Pacote não encontrado" });
    }

    // CORREÇÃO: Desserializar o pacote encontrado
    const pkg = deserializePackage(row);
    
    res.json(pkg);
  } catch (err) {
    console.error("Erro ao buscar pacote por slug:", err);
    res.status(500).json({ error: "Erro ao buscar pacote" });
  }
});

// === ADICIONAR OU ATUALIZAR PACOTE ===
router.post("/", async (req, res) => {
  try {
    const pkg = req.body;
    const db = await openDb();

    const slug = pkg.slug || slugify(pkg.title || "");

    // CORREÇÃO: Serializar arrays para JSON string e booleano para INTEGER (0/1)
    const featuredHome = pkg.featuredHome ? 1 : 0;
    const images = JSON.stringify(pkg.images || []);
    const inclusions = JSON.stringify(pkg.inclusions || []);
    const months = JSON.stringify(pkg.months || []);

    await db.run(
      `INSERT OR REPLACE INTO packages 
      (id, slug, title, type, region, destination, duration, priceFrom, shortDescription, longDescription, images, inclusions, months, featuredHome)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        images,
        inclusions,
        months,
        featuredHome,
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