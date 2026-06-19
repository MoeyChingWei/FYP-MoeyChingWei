import prisma from '../../config/prisma.js';

export class LanguageService {
  /**
   * Get user's preferred language
   */
  async getUserLanguage(userId, email) {
    const normalized = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferredLanguage: true, email: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.email.toLowerCase() !== normalized) {
      throw new Error('Not allowed');
    }

    return user.preferredLanguage;
  }

  /**
   * Update user's preferred language
   */
  async updateUserLanguage(userId, email, language) {
    const validLanguages = ['en', 'zh', 'ms'];

    if (!validLanguages.includes(language)) {
      throw new Error(`Invalid language: ${language}. Must be one of: ${validLanguages.join(', ')}`);
    }

    const normalized = email.toLowerCase();

    // Verify user exists and email matches
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.email.toLowerCase() !== normalized) {
      throw new Error('Not allowed');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { preferredLanguage: language },
      select: { preferredLanguage: true },
    });

    return updated.preferredLanguage;
  }
}

export const languageService = new LanguageService();
