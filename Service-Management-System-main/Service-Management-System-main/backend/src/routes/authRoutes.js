import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login', authController.login);
router.post('/staff/login', authController.staffLogin);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;