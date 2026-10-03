// middleware/upload.middleware.js
import multer from 'multer';
import path from 'path';
import { sendError } from '../utils/response.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to the private uploads folder
    cb(null, path.join(process.cwd(), 'uploads/profiles'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId_timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `user_${req.params.id}_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

export const uploadProfileImage = (req, res, next) => {
  const uploadSingle = upload.single('profile_image');
  
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'File too large. Maximum size is 5MB.', 400);
      }
      return sendError(res, err.message, 400);
    } else if (err) {
      return sendError(res, err.message, 400);
    }
    next();
  });
};
