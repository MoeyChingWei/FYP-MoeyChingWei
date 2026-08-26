/**
 * PDF Generator Service
 *
 * Handles PDF generation from HTML using Puppeteer.
 * Provides functionality to generate PDFs from HTML strings or directly from templates.
 */

import puppeteer from 'puppeteer';
import { puppeteerConfig, pdfOptions } from '../config/puppeteer-config.js';
import { renderTemplate } from './template-renderer.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * PDF Generator class
 * Manages browser instance and PDF generation operations
 */
export class PDFGenerator {
  constructor() {
    this.browser = null;
  }

  /**
   * Initialize browser instance if not already initialized
   * @private
   * @returns {Promise<Browser>} Puppeteer browser instance
   */
  async _initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch(puppeteerConfig);
    }
    return this.browser;
  }

  /**
   * Generate PDF from HTML string
   * @param {string} html - HTML content to convert to PDF
   * @param {string} outputPath - Path where the PDF should be saved
   * @param {Object} options - Optional PDF generation options (overrides default pdfOptions)
   * @returns {Promise<Object>} Result object with success status and output path
   */
  async generatePDF(html, outputPath, options = {}) {
    let page = null;

    try {
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Initialize browser
      const browser = await this._initBrowser();

      // Create new page
      page = await browser.newPage();

      // Set HTML content
      // Remote product/logo images are best-effort and must not block PDF generation.
      await page.setContent(html, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });

      // Merge default options with custom options
      const pdfGenerationOptions = {
        ...pdfOptions,
        ...options,
        path: outputPath
      };

      // Generate PDF
      await page.pdf(pdfGenerationOptions);

      return {
        success: true,
        outputPath: outputPath
      };
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
      // Always close the page to free resources
      if (page) {
        await page.close();
      }
    }
  }

  /**
   * Generate PDF from a template
   * @param {string} templateName - Name of the template (without .hbs extension)
   * @param {Object} data - Data to populate the template
   * @param {string} outputPath - Path where the PDF should be saved
   * @param {Object} options - Optional PDF generation options
   * @returns {Promise<Object>} Result object with success status and output path
   */
  async generatePDFFromTemplate(templateName, data, outputPath, options = {}) {
    try {
      // Render template to HTML
      const html = await renderTemplate(templateName, data);

      // Generate PDF from HTML
      return await this.generatePDF(html, outputPath, options);
    } catch (error) {
      throw new Error(`Failed to generate PDF from template "${templateName}": ${error.message}`);
    }
  }

  /**
   * Close the browser instance
   * Should be called when done with PDF generation to free resources
   * @returns {Promise<void>}
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export default PDFGenerator;
