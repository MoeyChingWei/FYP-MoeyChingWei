import type { SupportedLanguage } from '../../i18n/config';

export class LanguageService {
  private static API_BASE = '/api';

  /**
   * Fetch user's language preference from backend
   */
  static async getUserLanguage(userId: number, email: string): Promise<SupportedLanguage> {
    const response = await fetch(`${this.API_BASE}/users/me/language?userId=${userId}&email=${encodeURIComponent(email)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch language preference');
    }

    const data = await response.json();
    return data.language;
  }

  /**
   * Update user's language preference on backend
   */
  static async updateUserLanguage(userId: number, email: string, language: SupportedLanguage): Promise<void> {
    const response = await fetch(`${this.API_BASE}/users/me/language`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email, language }),
    });

    if (!response.ok) {
      throw new Error('Failed to update language preference');
    }
  }
}
