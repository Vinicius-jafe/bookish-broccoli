import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cria um configurador de upload personalizado
 * @param {string} subfolder - Nome da subpasta dentro de 'uploads/'
 * @param {string[]} allowedMimeTypes - Tipos MIME permitidos (ex: ['image/jpeg', 'image/png'])
 * @param {number} maxSizeMB - Tamanho máximo do arquivo em MB (padrão: 10MB)
 * @returns {multer.Multer} Instância do Multer configurada
 */
const createUploader = (subfolder, allowedMimeTypes, maxSizeMB = 10) => {
  const uploadDir = path.join(__dirname, `../uploads/${subfolder}`);
  
  // Garante que o diretório existe
  const ensureDirExists = async () => {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      console.log(`✅ Diretório de upload configurado: ${uploadDir}`);
    } catch (error) {
      console.error(`❌ Erro ao criar diretório ${uploadDir}:`, error);
      throw error;
    }
  };

  // Configuração do armazenamento
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      await ensureDirExists();
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${subfolder}-${uuidv4()}${ext}`);
    }
  });

  // Filtro de tipos de arquivo
  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(`Tipo de arquivo inválido. Apenas ${allowedMimeTypes.join(', ')} são permitidos.`);
      error.code = 'INVALID_FILE_TYPE';
      cb(error, false);
    }
  };

  // Configuração do multer
  return multer({ 
    storage, 
    fileFilter,
    limits: { 
      fileSize: maxSizeMB * 1024 * 1024,
      files: 1
    }
  });
};

export default createUploader;
