/**
 * Puppeteer Configuration
 *
 * Configuration for Puppeteer browser launch options and PDF generation settings.
 */

export const puppeteerConfig = {
  headless: 'new',
  executablePath: 'C:\\Users\\mch\\.cache\\puppeteer\\chrome\\win64-121.0.6167.85\\chrome-win64\\chrome.exe',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ]
};

export const pdfOptions = {
  format: 'A4',
  margin: {
    top: '20mm',
    right: '15mm',
    bottom: '20mm',
    left: '15mm'
  },
  printBackground: true
};

export default {
  puppeteerConfig,
  pdfOptions
};
