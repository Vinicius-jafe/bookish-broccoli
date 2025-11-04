import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads', 'banners');

try {
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
    console.log('Created uploads directory');
  }

  // Create banners directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created banners directory');
  }

  console.log('Upload directories are ready');
  console.log(`Upload directory path: ${uploadsDir}`);
} catch (error) {
  console.error('Error setting up upload directories:', error);
  process.exit(1);
}
