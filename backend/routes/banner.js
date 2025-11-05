import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/banners');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save with original name
    cb(null, 'banner' + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get current banner
router.get('/', (req, res) => {
  const bannerDir = path.join(__dirname, '../uploads/banners');
  const files = fs.readdirSync(bannerDir);
  const bannerFile = files.find(file => file.startsWith('banner'));
  
  if (bannerFile) {
    res.json({ 
      success: true, 
      imageUrl: `/uploads/banners/${bannerFile}` 
    });
  } else {
    res.json({ 
      success: false, 
      message: 'No banner image found' 
    });
  }
});

// Function to delete all files in the banners directory except for the one we just uploaded
function deleteExistingBanners(exceptFilename = '') {
  const bannerDir = path.join(__dirname, '../uploads/banners');
  if (!fs.existsSync(bannerDir)) {
    return;
  }
  
  const files = fs.readdirSync(bannerDir);
  files.forEach(file => {
    if (file === exceptFilename) return; // Skip the file we just uploaded
    try {
      fs.unlinkSync(path.join(bannerDir, file));
    } catch (err) {
      console.error(`Error deleting file ${file}:`, err);
    }
  });
}

// Upload new banner
router.post('/', (req, res, next) => {
  upload.single('banner')(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Error uploading file',
        error: process.env.NODE_ENV === 'development' ? err : undefined
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum arquivo enviado' 
      });
    }
    
    try {
      // Ensure the file was saved
      const filePath = path.join(__dirname, '../uploads/banners', req.file.filename);
      if (!fs.existsSync(filePath)) {
        throw new Error('O arquivo não foi salvo corretamente');
      }
      
      // Delete any other banner files (except the one we just uploaded)
      deleteExistingBanners(req.file.filename);
      
      res.json({ 
        success: true, 
        message: 'Banner atualizado com sucesso',
        imageUrl: `/uploads/banners/${req.file.filename}`
      });
    } catch (error) {
      console.error('File processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar o arquivo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});

export default router;
