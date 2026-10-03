// middleware/upload.middleware.js
import multer from 'multer';
import path from 'path';
import { sendError } from '../utils/response.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'document') {
      cb(null, path.join(process.cwd(), 'uploads/documents'));
    } else {
      cb(null, path.join(process.cwd(), 'uploads/profiles'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.fieldname === 'document') {
      cb(null, `doc_${req.params.projectId}_${uniqueSuffix}${ext}`);
    } else {
      cb(null, `user_${req.params.id}_${uniqueSuffix}${ext}`);
    }
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'document') {
    const allowed = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain', 
      'image/jpeg', 
      'image/png'
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid document format. Allowed: PDF, DOC/X, TXT, JPG, PNG.'));
  } else {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

export const uploadProfileImage = (req, res, next) => {
  const uploadSingle = upload.single('profile_image');
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return sendError(res, 'File too large. Maximum size is 5MB.', 400);
      return sendError(res, err.message, 400);
    } else if (err) {
      return sendError(res, err.message, 400);
    }
    next();
  });
};

export const uploadDocument = (req, res, next) => {
  const uploadSingle = upload.single('document');
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return sendError(res, err.message, 400);
    } else if (err) {
      return sendError(res, err.message, 400);
    }
    next();
  });
};
