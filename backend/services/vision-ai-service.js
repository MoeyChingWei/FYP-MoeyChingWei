import OpenAI from 'openai';
import logger from './simple-logger.js';

class VisionAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.VISION_MODEL || 'gpt-4-turbo';

    if (!this.apiKey) {
      logger.warn('VisionAIService', 'OPENAI_API_KEY not configured - vision analysis disabled');
      this.enabled = false;
      return;
    }

    this.client = new OpenAI({
      apiKey: this.apiKey,
      timeout: 30000,
    });

    this.enabled = true;
    logger.success('VisionAIService', `Initialized with model: ${this.model}`);
  }

  /**
   * Check if vision service is available
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Check if file is an image that can be analyzed
   */
  isImageFile(mimeType, fileName) {
    const imageMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (mimeType && imageMimeTypes.includes(mimeType.toLowerCase())) {
      return true;
    }

    if (fileName) {
      const lowerName = fileName.toLowerCase();
      return imageExtensions.some(ext => lowerName.endsWith(ext));
    }

    return false;
  }

  /**
   * Analyze an image using OpenAI Vision API
   * @param {string} imageUrl - Public URL to the image
   * @param {string} fileName - Original file name for context
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeImage(imageUrl, fileName = 'image') {
    if (!this.enabled) {
      return {
        success: false,
        error: 'Vision service not available - OPENAI_API_KEY not configured',
      };
    }

    const startTime = Date.now();

    try {
      logger.debug('VisionAPI', `Analyzing image: ${fileName}`, { url: imageUrl });

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and provide a detailed description. Include:\n1. Main subject or objects\n2. Scene/setting\n3. Any text visible in the image\n4. Colors and composition\n5. Any relevant details for business/procurement context\n\nBe concise but informative.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      const duration = Date.now() - startTime;
      logger.logAPICall('OpenAI Vision', 'chat.completions', duration, true);

      const analysis = response.choices[0].message.content;

      return {
        success: true,
        analysis,
        model: this.model,
        usage: {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logAPICall('OpenAI Vision', 'chat.completions', duration, false);

      logger.error('VisionAPI', `Analysis failed for ${fileName}: ${error.message}`, {
        error: error.message,
        code: error.code,
        status: error.status,
      });

      return {
        success: false,
        error: error.message,
        reason: 'API_ERROR',
      };
    }
  }

  /**
   * Analyze multiple images in batch
   * @param {Array<Object>} images - Array of {url, fileName}
   * @returns {Promise<Array>} Array of analysis results
   */
  async analyzeImages(images) {
    if (!this.enabled) {
      return images.map(() => ({
        success: false,
        error: 'Vision service not available',
      }));
    }

    const results = await Promise.allSettled(
      images.map(img => this.analyzeImage(img.url, img.fileName))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        logger.error('VisionAPI', `Batch analysis failed for ${images[index].fileName}`, {
          error: result.reason.message,
        });
        return {
          success: false,
          error: result.reason.message,
        };
      }
    });
  }

  /**
   * Generate a brief summary for an image (shorter than full analysis)
   */
  async generateImageSummary(imageUrl, fileName = 'image') {
    if (!this.enabled) {
      return {
        success: false,
        error: 'Vision service not available',
      };
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this image in one or two sentences.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 100,
      });

      return {
        success: true,
        summary: response.choices[0].message.content,
      };
    } catch (error) {
      logger.error('VisionAPI', `Summary generation failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new VisionAIService();
