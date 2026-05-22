import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { config } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// BASE UPLOAD ROOT
// --------------------------------------------------
const uploadRoot = path.join(__dirname, '../../', config.uploadPath);

// Ensure base upload directory exists
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

// --------------------------------------------------
// SERVICE JOB UPLOADS (existing behavior)
// --------------------------------------------------
const serviceJobsDir = path.join(uploadRoot, 'service-jobs');

if (!fs.existsSync(serviceJobsDir)) {
  fs.mkdirSync(serviceJobsDir, { recursive: true });
}

const serviceJobStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, serviceJobsDir);
  },
  filename: (req, file, cb) => {
    const serviceJobId = req.params.id || 'temp';
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${serviceJobId}-${safeName}`);
  },
});

const serviceJobFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only images allowed.'), false);
};

export const uploadServiceJobImage = multer({
  storage: serviceJobStorage,
  fileFilter: serviceJobFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// --------------------------------------------------
// JOBCARD MEDIA UPLOADS (new behavior)
// --------------------------------------------------
const jobCardStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const jobCardId = req.params.id;
    const dir = path.join(uploadRoot, 'job-cards', jobCardId);

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const jobCardFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime',
  ];

  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only images and MP4 videos allowed.'), false);
};

export const uploadJobCardMedia = multer({
  storage: jobCardStorage,
  fileFilter: jobCardFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// --------------------------------------------------
// HELPERS (shared)
// --------------------------------------------------
export const getRelativePath = (...segments) =>
  path.join(config.uploadPath, ...segments).replace(/\\/g, '/');

export const getAbsolutePath = (...segments) =>
  path.join(uploadRoot, ...segments);

export const deleteFile = (relativePath) => {
  const fullPath = path.join(__dirname, '../../', relativePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
};
