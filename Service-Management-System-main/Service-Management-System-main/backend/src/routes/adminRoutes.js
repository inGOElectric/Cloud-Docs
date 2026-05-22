import express from 'express';
import { login, getDashboardStats } from '../controllers/adminController.js';

const router = express.Router();

// Auth
router.post('/admin/login', login);

// Dashboard
router.get('/admin/dashboard-stats', getDashboardStats);

export default router;