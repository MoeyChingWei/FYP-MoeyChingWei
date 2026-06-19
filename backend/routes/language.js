import { Router } from 'express';
import { languageController } from '../src/controllers/language.controller.js';
import { authenticateToken } from '../src/middleware/auth.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/users/me/language
router.get('/users/me/language', (req, res) => {
  languageController.getUserLanguage(req, res);
});

// PUT /api/users/me/language
router.put('/users/me/language', (req, res) => {
  languageController.updateUserLanguage(req, res);
});

export default router;
