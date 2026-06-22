import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PDFGenerator } from '../services/pdf-generator.js';
import { renderTemplate } from '../services/template-renderer.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set longer timeout for PDF generation tests
const PDF_TEST_TIMEOUT = 15000;

describe('PDF Generator Service', () => {
  let pdfGenerator;
  let testOutputDir;
  let testData;

  beforeAll(async () => {
    pdfGenerator = new PDFGenerator();
    testOutputDir = path.join(__dirname, 'output');

    // Create output directory if it doesn't exist
    try {
      await fs.mkdir(testOutputDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    testData = {
      documentTitle: 'Purchase Request #PR-2024-001',
      documentType: 'Purchase Request',
      documentNumber: 'PR-2024-001',
      status: 'Pending Approval',
      requestDate: '2024-06-22',
      requesterName: 'John Doe',
      department: 'IT Department',
      purpose: 'Equipment upgrade for development team',
      lineItems: [
        {
          no: 1,
          itemName: 'Dell Laptop XPS 15',
          category: 'Computer Hardware',
          quantity: 5,
          unit: 'units',
          description: 'High-performance laptops for developers'
        },
        {
          no: 2,
          itemName: 'USB-C Docking Station',
          category: 'Computer Accessories',
          quantity: 5,
          unit: 'units',
          description: 'Dual monitor support'
        }
      ],
      totalItems: 2,
      companyName: 'Acme Corporation',
      companyAddress: '123 Business Street, Tech City',
      preparedBy: 'John Doe',
      reviewedBy: 'Jane Smith',
      approvedBy: 'Robert Johnson'
    };
  });

  afterAll(async () => {
    // Clean up browser instance
    await pdfGenerator.close();

    // Clean up test output files
    try {
      const files = await fs.readdir(testOutputDir);
      for (const file of files) {
        await fs.unlink(path.join(testOutputDir, file));
      }
      await fs.rmdir(testOutputDir);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('generatePDF', () => {
    it('should generate PDF from HTML string', async () => {
      const html = '<html><body><h1>Test Document</h1></body></html>';
      const outputPath = path.join(testOutputDir, 'test-output.pdf');

      const result = await pdfGenerator.generatePDF(html, outputPath);

      expect(result).toBeTruthy();
      expect(result.success).toBe(true);
      expect(result.outputPath).toBe(outputPath);

      // Verify the PDF file was created
      const fileExists = await fs.access(outputPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      // Verify the file has content
      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    }, PDF_TEST_TIMEOUT);

    it('should generate PDF with custom options', async () => {
      const html = '<html><body><h1>Custom Options Test</h1></body></html>';
      const outputPath = path.join(testOutputDir, 'test-custom-options.pdf');
      const customOptions = {
        format: 'Letter',
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm'
        }
      };

      const result = await pdfGenerator.generatePDF(html, outputPath, customOptions);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBe(outputPath);

      const fileExists = await fs.access(outputPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    }, PDF_TEST_TIMEOUT);

    it('should handle invalid HTML gracefully', async () => {
      const html = '<html><body><h1>Incomplete HTML';
      const outputPath = path.join(testOutputDir, 'test-invalid.pdf');

      const result = await pdfGenerator.generatePDF(html, outputPath);

      // Should still generate PDF even with malformed HTML
      expect(result.success).toBe(true);

      const fileExists = await fs.access(outputPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    }, PDF_TEST_TIMEOUT);

    it('should throw error for invalid output path', async () => {
      const html = '<html><body><h1>Test</h1></body></html>';
      const invalidPath = 'Z:\\invalid\\path\\that\\does\\not\\exist\\test.pdf';

      await expect(pdfGenerator.generatePDF(html, invalidPath))
        .rejects.toThrow();
    }, PDF_TEST_TIMEOUT);

    it('should handle empty HTML string', async () => {
      const html = '';
      const outputPath = path.join(testOutputDir, 'test-empty.pdf');

      const result = await pdfGenerator.generatePDF(html, outputPath);

      expect(result.success).toBe(true);

      const fileExists = await fs.access(outputPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    }, PDF_TEST_TIMEOUT);
  });

  describe('generatePDFFromTemplate', () => {
    it('should generate PDF from template name and data', async () => {
      const templateName = 'purchase-request';
      const outputPath = path.join(testOutputDir, 'test-from-template.pdf');

      const result = await pdfGenerator.generatePDFFromTemplate(
        templateName,
        testData,
        outputPath
      );

      expect(result.success).toBe(true);
      expect(result.outputPath).toBe(outputPath);

      const fileExists = await fs.access(outputPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    }, PDF_TEST_TIMEOUT);

    it('should throw error for non-existent template', async () => {
      const templateName = 'non-existent-template';
      const outputPath = path.join(testOutputDir, 'test-nonexistent.pdf');

      await expect(
        pdfGenerator.generatePDFFromTemplate(templateName, testData, outputPath)
      ).rejects.toThrow();
    }, PDF_TEST_TIMEOUT);
  });

  describe('Browser management', () => {
    it('should initialize browser on first use', async () => {
      const newGenerator = new PDFGenerator();
      const html = '<html><body><h1>Browser Test</h1></body></html>';
      const outputPath = path.join(testOutputDir, 'test-browser-init.pdf');

      const result = await newGenerator.generatePDF(html, outputPath);

      expect(result.success).toBe(true);

      await newGenerator.close();
    }, PDF_TEST_TIMEOUT);

    it('should close browser cleanly', async () => {
      const newGenerator = new PDFGenerator();
      const html = '<html><body><h1>Close Test</h1></body></html>';
      const outputPath = path.join(testOutputDir, 'test-close.pdf');

      await newGenerator.generatePDF(html, outputPath);
      await newGenerator.close();

      // Should be able to generate PDF again after closing (will reinitialize)
      const result = await newGenerator.generatePDF(html, outputPath);
      expect(result.success).toBe(true);

      await newGenerator.close();
    }, PDF_TEST_TIMEOUT);
  });

  describe('End-to-end workflow', () => {
    it('should render template and generate PDF', async () => {
      // Step 1: Render template to HTML
      const html = await renderTemplate('purchase-request', testData);
      expect(html).toBeTruthy();

      // Step 2: Generate PDF from HTML
      const outputPath = path.join(testOutputDir, 'test-e2e.pdf');
      const result = await pdfGenerator.generatePDF(html, outputPath);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBe(outputPath);

      const fileExists = await fs.access(outputPath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    }, PDF_TEST_TIMEOUT);
  });
});
