/**
 * Puppeteer Configuration
 *
 * Configuration for Puppeteer browser launch options and PDF generation settings.
 */

const puppeteerConfig = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ]
};

const pdfOptions = {
  format: 'A4',
  margin: {
    top: '20mm',
    right: '15mm',
    bottom: '20mm',
    left: '15mm'
  },
  printBackground: true
};

module.exports = {
  puppeteerConfig,
  pdfOptions
};
