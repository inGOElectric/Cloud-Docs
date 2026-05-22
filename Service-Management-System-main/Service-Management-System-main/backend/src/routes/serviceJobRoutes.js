import express from 'express';
import {
  getAllServiceJobs,
  getServiceJobById,
  getServiceJobsByVehicleId,
  createServiceJob,
  updateServiceJob,
  deleteServiceJob,
  addImageToServiceJob,
  deleteImageFromServiceJob,
} from '../controllers/serviceJobController.js';
import { upload } from '../config/multer.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protect all service job routes
router.use('/service-jobs', authenticateToken);

router.get('/service-jobs', getAllServiceJobs);
router.get('/service-jobs/vehicle/:vehicleId', getServiceJobsByVehicleId);
router.get('/service-jobs/:id', getServiceJobById);
router.post('/service-jobs', createServiceJob);
router.put('/service-jobs/:id', updateServiceJob);
router.delete('/service-jobs/:id', deleteServiceJob);
router.post('/service-jobs/:id/images', upload.single('image'), addImageToServiceJob);
router.delete('/service-jobs/:id/images/:imageId', deleteImageFromServiceJob);

export default router;

