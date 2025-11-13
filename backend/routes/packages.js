// routes/packages.js
import express from "express";
import { openDb } from "../db.js"; // Assumindo que esta função existe
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ----------------------------------------------------
// CONFIGURAÇÃO DO MULTER PARA UPLOAD DE IMAGENS
// ----------------------------------------------------

const UPLOAD_DIR = '/var/www/uploads/packages/';

// Garante que o diretório de uploads existe. 
// Isso é importante, pois alguns serviços de deploy podem não manter a pasta.
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configura o armazenamento (Storage)
const storage = multer.diskStorage({
  // Define o destino
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR); 
  },
  // Define o nome do arquivo
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configura o filtro de arquivos (POLÍTICA: Apenas imagens e tipos específicos)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Aceita o arquivo
  } else {
    // Rejeita o arquivo e retorna um erro, aplicando a política de formato
    cb(new Error('Formato de arquivo inválido. Apenas JPEG, PNG e GIF são permitidos.'), false); 
  }
};

// Inicializa o upload com as configurações e limites (POLÍTICA: Tamanho)
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 1024 * 1024 * 5 // Limite de 5MB por arquivo
    }
});


// ----------------------------------------------------
// FUNÇÕES AUXILIARES (Existentes no seu código)
// ----------------------------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/[^a-z0-9-]/g, ""); 
}

// Inicializa o banco e cria/atualiza a tabela se necessário
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
      longDescription TEXT,
      slug TEXT,          
      images TEXT,          
      inclusions TEXT,      
      months TEXT,          
      featuredHome INTEGER   
    )
  `);
  try {
    const cols = await db.all("PRAGMA table_info(packages)");
    if (!cols.some(c => c.name === "slug")) await db.exec("ALTER TABLE packages ADD COLUMN slug TEXT;");
    if (!cols.some(c => c.name === "images")) await db.exec("ALTER TABLE packages ADD COLUMN images TEXT;");
    if (!cols.some(c => c.name === "inclusions")) await db.exec("ALTER TABLE packages ADD COLUMN inclusions TEXT;");
    if (!cols.some(c => c.name === "months")) await db.exec("ALTER TABLE packages ADD COLUMN months TEXT;");
    if (!cols.some(c => c.name === "featuredHome")) await db.exec("ALTER TABLE packages ADD COLUMN featuredHome INTEGER DEFAULT 0;");
    console.log("Colunas verificadas/adicionadas à tabela packages");
  } catch (err) {
    console.error("Erro ao tentar adicionar colunas:", err);
  }
}
initDb();

function deserializePackage(p) {
    if (!p) return null;
    return {
      ...p,
      images: JSON.parse(p.images || "[]"),
      inclusions: JSON.parse(p.inclusions || "[]"),
      months: JSON.parse(p.months || "[]"),
      featuredHome: !!p.featuredHome, 
    };
}

// ----------------------------------------------------
// ROTAS NOVAS E EXISTENTES
// ----------------------------------------------------

// === ROTA DE UPLOAD DE IMAGEM (NOVA) ===
// Middleware upload.array('images', 5) aplica as políticas de filtro e limite de arquivos.
router.post("/upload-images", upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Nenhum arquivo enviado ou formato inválido." });
    }

    // Retorna os caminhos salvos no servidor para o frontend
    const filePaths = req.files.map(file => file.path); 
    
    res.json({ 
        ok: true, 
        paths: filePaths 
    });
  } catch (error) {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ error: "Erro no upload: " + error.message });
    }
    // Captura o erro do fileFilter
    res.status(500).json({ error: error.message || "Erro interno ao salvar imagens." });
  }
});


// === LISTAR TODOS OS PACOTES ===
router.get("/", async (req, res) => {
  try {
    const db = await openDb();
    const rows = await db.all("SELECT * FROM packages");
    const data = rows.map(deserializePackage);
    res.json(data);
  } catch (err) {
    console.error("Erro ao listar pacotes:", err);
    res.status(500).json({ error: "Erro ao listar pacotes" });
  }
});

// === BUSCAR PACOTE POR SLUG ===
router.get("/:slug", async (req, res) => {
  try {
    const db = await openDb();
    const row = await db.get("SELECT * FROM packages WHERE slug = ?", [req.params.slug]);
    
    if (!row) {
      return res.status(404).json({ error: "Pacote não encontrado" });
    }

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

    const featuredHome = pkg.featuredHome ? 1 : 0;
    const images = JSON.stringify(pkg.images || []); // Espera que o frontend envie os paths
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