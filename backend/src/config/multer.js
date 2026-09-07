const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const photosDir = path.join(process.cwd(), 'uploads', 'photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photosDir);
  },
  filename: (req, file, cb) => {
    // Sanitize original filename: remove special chars/spaces/tildes
    // to avoid OS and filesystem encoding issues with Spanish characters
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `user_${req.user?.id || 'unknown'}_${Date.now()}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // Fix: multer 2.x encodes originalname in latin1 from some clients
  // Decode the filename correctly to handle special characters
  if (file.originalname) {
    try {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch (e) {
      // keep original if decode fails
    }
  }

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // multer 2.x: pass error as first arg to reject
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Solo se aceptan imágenes JPG, PNG o WebP.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,                   // solo 1 archivo a la vez
  },
});

module.exports = upload;
