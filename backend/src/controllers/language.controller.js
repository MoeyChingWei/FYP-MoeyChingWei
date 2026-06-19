import { languageService } from '../services/language.service.js';

export class LanguageController {
  /**
   * GET /api/users/me/language
   * Get current user's language preference
   * Query params: userId, email
   */
  async getUserLanguage(req, res) {
    try {
      const userId = Number(req.query.userId);
      const email = typeof req.query.email === 'string' ? req.query.email.trim() : '';

      if (!Number.isFinite(userId) || !email) {
        return res.status(400).json({
          success: false,
          message: 'userId and email query parameters are required'
        });
      }

      const language = await languageService.getUserLanguage(userId, email);

      return res.status(200).json({ language });
    } catch (error) {
      console.error('Error getting user language:', error);

      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (error.message === 'Not allowed') {
        return res.status(403).json({ success: false, message: 'Not allowed' });
      }

      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  /**
   * PUT /api/users/me/language
   * Update current user's language preference
   * Body: { userId, email, language }
   */
  async updateUserLanguage(req, res) {
    try {
      const { userId, email, language } = req.body;
      const id = Number(userId);

      if (!Number.isFinite(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user id' });
      }

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      if (!language) {
        return res.status(400).json({ success: false, message: 'Language is required' });
      }

      const normalized = email.trim().toLowerCase();
      const updatedLanguage = await languageService.updateUserLanguage(id, normalized, language);

      return res.status(200).json({
        success: true,
        language: updatedLanguage
      });
    } catch (error) {
      console.error('Error updating user language:', error);

      if (error.message && error.message.startsWith('Invalid language')) {
        return res.status(400).json({ success: false, message: error.message });
      }

      if (error.message === 'Not allowed') {
        return res.status(403).json({ success: false, message: 'Not allowed' });
      }

      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

export const languageController = new LanguageController();
