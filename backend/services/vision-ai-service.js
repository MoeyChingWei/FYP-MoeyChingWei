import logger from './simple-logger.js';

class VisionAIService {
  constructor() {
    this.provider = process.env.VISION_PROVIDER || 'openai'; // 'openai' or 'google'
    this.enabled = false;

    if (this.provider === 'google') {
      this.initializeGoogleVision();
    } else if (this.provider === 'openai') {
      this.initializeOpenAI();
    } else {
      logger.warn('VisionAIService', 'No valid vision provider configured - vision analysis disabled');
    }
  }

  async initializeGoogleVision() {
    try {
      // Dynamic import for Google Vision
      const vision = await import('@google-cloud/vision');

      // Check if credentials are configured
      const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (!credPath) {
        logger.warn('VisionAIService', 'GOOGLE_APPLICATION_CREDENTIALS not configured - vision analysis disabled');
        return;
      }

      this.client = new vision.ImageAnnotatorClient();
      this.enabled = true;
      logger.success('VisionAIService', 'Initialized with Google Cloud Vision API');
    } catch (error) {
      logger.error('VisionAIService', `Failed to initialize Google Vision: ${error.message}`);
      logger.warn('VisionAIService', 'Install @google-cloud/vision: npm install @google-cloud/vision');
    }
  }

  async initializeOpenAI() {
    try {
      const OpenAI = (await import('openai')).default;

      this.apiKey = process.env.OPENAI_API_KEY;
      this.model = process.env.VISION_MODEL || 'gpt-4-turbo';

      if (!this.apiKey) {
        logger.warn('VisionAIService', 'OPENAI_API_KEY not configured - vision analysis disabled');
        return;
      }

      this.client = new OpenAI({
        apiKey: this.apiKey,
        timeout: 30000,
      });

      this.enabled = true;
      logger.success('VisionAIService', `Initialized with OpenAI Vision (${this.model})`);
    } catch (error) {
      logger.error('VisionAIService', `Failed to initialize OpenAI: ${error.message}`);
    }
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
   * Analyze an image using the configured vision provider
   * @param {string} imageUrl - Public URL to the image or local file path
   * @param {string} fileName - Original file name for context
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeImage(imageUrl, fileName = 'image') {
    if (!this.enabled) {
      return {
        success: false,
        error: `Vision service not available - ${this.provider} not configured`,
      };
    }

    if (this.provider === 'google') {
      return this.analyzeImageWithGoogle(imageUrl, fileName);
    } else {
      return this.analyzeImageWithOpenAI(imageUrl, fileName);
    }
  }

  /**
   * Analyze image using Google Cloud Vision API
   */
  async analyzeImageWithGoogle(imageUrl, fileName) {
    const startTime = Date.now();

    try {
      logger.debug('GoogleVision', `Analyzing image: ${fileName}`, { url: imageUrl });

      // Convert URL to local path if needed
      let imagePath = imageUrl;
      if (imageUrl.startsWith('/uploads/')) {
        imagePath = '.' + imageUrl; // Convert to relative path
      }

      // Perform label detection, text detection, and web detection
      const [result] = await this.client.annotateImage({
        image: { source: { filename: imagePath } },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'TEXT_DETECTION' },
          { type: 'IMAGE_PROPERTIES' },
          { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
        ],
      });

      const duration = Date.now() - startTime;
      logger.logAPICall('Google Vision', 'annotateImage', duration, true);

      // Build comprehensive description
      const description = this.buildGoogleVisionDescription(result);

      return {
        success: true,
        analysis: description,
        provider: 'google',
        rawData: {
          labels: result.labelAnnotations?.map(l => l.description) || [],
          text: result.textAnnotations?.[0]?.description || null,
          colors: result.imagePropertiesAnnotation?.dominantColors?.colors?.slice(0, 3) || [],
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logAPICall('Google Vision', 'annotateImage', duration, false);

      logger.error('GoogleVision', `Analysis failed for ${fileName}: ${error.message}`, {
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
        reason: 'API_ERROR',
      };
    }
  }

  /**
   * Build human-readable description from Google Vision results
   */
  buildGoogleVisionDescription(result) {
    const parts = [];

    // Labels (what's in the image)
    if (result.labelAnnotations && result.labelAnnotations.length > 0) {
      const labels = result.labelAnnotations
        .slice(0, 5)
        .map(l => l.description)
        .join(', ');
      parts.push(`Image contains: ${labels}`);
    }

    // Objects detected
    if (result.localizedObjectAnnotations && result.localizedObjectAnnotations.length > 0) {
      const objects = result.localizedObjectAnnotations
        .map(o => o.name)
        .join(', ');
      parts.push(`Objects detected: ${objects}`);
    }

    // Text in image
    if (result.textAnnotations && result.textAnnotations.length > 0) {
      const text = result.textAnnotations[0].description.trim();
      if (text) {
        parts.push(`Text found: "${text.substring(0, 200)}${text.length > 200 ? '...' : ''}"`);
      }
    }

    // Dominant colors
    if (result.imagePropertiesAnnotation?.dominantColors?.colors) {
      const colors = result.imagePropertiesAnnotation.dominantColors.colors.slice(0, 3);
      const colorNames = colors.map(c => {
        const { red, green, blue } = c.color;
        return this.getColorName(red, green, blue);
      }).join(', ');
      parts.push(`Dominant colors: ${colorNames}`);
    }

    return parts.length > 0
      ? parts.join('. ') + '.'
      : 'Image analyzed successfully.';
  }

  /**
   * Get approximate color name from RGB
   */
  getColorName(r, g, b) {
    if (r > 200 && g > 200 && b > 200) return 'white';
    if (r < 50 && g < 50 && b < 50) return 'black';
    if (r > g && r > b) return 'red';
    if (g > r && g > b) return 'green';
    if (b > r && b > g) return 'blue';
    if (r > 150 && g > 150 && b < 100) return 'yellow';
    if (r > 150 && g < 100 && b > 150) return 'purple';
    if (r < 100 && g > 150 && b > 150) return 'cyan';
    return 'mixed';
  }

  /**
   * Analyze image using OpenAI Vision API
   */
  async analyzeImageWithOpenAI(imageUrl, fileName) {
    if (!this.enabled) {
      return {
        success: false,
        error: 'Vision service not available - OPENAI_API_KEY not configured',
      };
    }

    const startTime = Date.now();

    try {
      logger.debug('OpenAIVision', `Analyzing image: ${fileName}`, { url: imageUrl });

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
        provider: 'openai',
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

      logger.error('OpenAIVision', `Analysis failed for ${fileName}: ${error.message}`, {
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
