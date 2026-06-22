import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ExportService } from '../services/export-service.js';
import fs from 'fs/promises';
import path from 'path';
import ExcelJS from 'exceljs';

describe('Export Service', () => {
  let exportService;
  let testOutputDir;

  // Sample data for testing
  let samplePurchaseRequestRecord;
  let samplePurchaseOrderRecord;
  let sampleInvoiceRecord;
  let sampleSupplierRecord;

  beforeAll(async () => {
    exportService = new ExportService();
    testOutputDir = path.join(process.cwd(), 'test-output', 'exports');
    await fs.mkdir(testOutputDir, { recursive: true });

    // Sample Purchase Request Record
    samplePurchaseRequestRecord = {
      localId: 'PR-2024-001',
      payload: {
        documentNumber: 'PR-2024-001',
        status: 'Pending Approval',
        requestDate: '2024-06-22',
        requesterName: 'John Doe',
        department: 'IT Department',
        purpose: 'Equipment upgrade',
        lineItems: [
          {
            itemName: 'Dell Laptop XPS 15',
            category: 'Computer Hardware',
            quantity: 5,
            unit: 'units',
            description: 'High-performance laptops'
          },
          {
            itemName: 'USB-C Docking Station',
            category: 'Computer Accessories',
            quantity: 5,
            unit: 'units',
            description: 'Dual monitor support'
          }
        ]
      }
    };

    // Sample Purchase Order Record
    samplePurchaseOrderRecord = {
      localId: 'PO-2024-001',
      payload: {
        documentNumber: 'PO-2024-001',
        status: 'Confirmed',
        orderDate: '2024-06-23',
        supplierName: 'Tech Supplies Ltd',
        deliveryAddress: '123 Business Street',
        lineItems: [
          {
            itemName: 'Dell Laptop XPS 15',
            quantity: 5,
            unit: 'units',
            unitPrice: 1200.00,
            totalPrice: 6000.00
          }
        ],
        subtotal: 6000.00,
        tax: 360.00,
        total: 6360.00
      }
    };

    // Sample Invoice Record
    sampleInvoiceRecord = {
      localId: 'INV-2024-001',
      payload: {
        documentNumber: 'INV-2024-001',
        status: 'Paid',
        invoiceDate: '2024-06-24',
        dueDate: '2024-07-24',
        supplierName: 'Tech Supplies Ltd',
        billingAddress: '123 Business Street',
        lineItems: [
          {
            itemName: 'Dell Laptop XPS 15',
            quantity: 5,
            unit: 'units',
            unitPrice: 1200.00,
            totalPrice: 6000.00
          }
        ],
        subtotal: 6000.00,
        tax: 360.00,
        total: 6360.00
      }
    };

    // Sample Supplier Record
    sampleSupplierRecord = {
      name: 'Tech Supplies Ltd',
      // Other fields will be filled by formatter with placeholders
    };
  });

  afterAll(async () => {
    // Clean up test output directory
    try {
      await fs.rm(testOutputDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }

    // Close PDF generator browser
    await exportService.close();
  });

  describe('exportToPDF', () => {
    it('should export purchase request to PDF', async () => {
      const outputPath = path.join(testOutputDir, 'pr-export.pdf');
      const result = await exportService.exportToPDF(
        'purchase-request',
        samplePurchaseRequestRecord,
        outputPath,
        { preparedBy: 'Test User', approvedBy: 'Manager' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('pdf');
      expect(result.outputPath).toBe(outputPath);

      // Verify file exists
      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it.skip('should export purchase order to PDF (template not created yet)', async () => {
      const outputPath = path.join(testOutputDir, 'po-export.pdf');
      const result = await exportService.exportToPDF(
        'purchase-order',
        samplePurchaseOrderRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('pdf');

      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it.skip('should export invoice to PDF (template not created yet)', async () => {
      const outputPath = path.join(testOutputDir, 'invoice-export.pdf');
      const result = await exportService.exportToPDF(
        'invoice',
        sampleInvoiceRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('pdf');

      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it.skip('should export supplier to PDF (template not created yet)', async () => {
      const outputPath = path.join(testOutputDir, 'supplier-export.pdf');
      const result = await exportService.exportToPDF(
        'supplier',
        sampleSupplierRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('pdf');

      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should throw error for invalid data type', async () => {
      const outputPath = path.join(testOutputDir, 'invalid.pdf');

      await expect(
        exportService.exportToPDF('invalid-type', {}, outputPath)
      ).rejects.toThrow('Unsupported data type');
    });
  });

  describe('exportToExcel', () => {
    it('should export purchase request to Excel', async () => {
      const outputPath = path.join(testOutputDir, 'pr-export.xlsx');
      const result = await exportService.exportToExcel(
        'purchase-request',
        samplePurchaseRequestRecord,
        outputPath,
        { preparedBy: 'Test User', approvedBy: 'Manager' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('excel');
      expect(result.outputPath).toBe(outputPath);

      // Verify file exists and is valid Excel
      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);

      // Verify Excel structure
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(outputPath);
      expect(workbook.worksheets.length).toBeGreaterThan(0);
    });

    it('should export purchase order to Excel', async () => {
      const outputPath = path.join(testOutputDir, 'po-export.xlsx');
      const result = await exportService.exportToExcel(
        'purchase-order',
        samplePurchaseOrderRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('excel');

      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should export invoice to Excel', async () => {
      const outputPath = path.join(testOutputDir, 'invoice-export.xlsx');
      const result = await exportService.exportToExcel(
        'invoice',
        sampleInvoiceRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('excel');

      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should export supplier to Excel', async () => {
      const outputPath = path.join(testOutputDir, 'supplier-export.xlsx');
      const result = await exportService.exportToExcel(
        'supplier',
        sampleSupplierRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('excel');

      const stats = await fs.stat(outputPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should throw error for invalid data type', async () => {
      const outputPath = path.join(testOutputDir, 'invalid.xlsx');

      await expect(
        exportService.exportToExcel('invalid-type', {}, outputPath)
      ).rejects.toThrow('Unsupported data type');
    });
  });

  describe('exportToCSV', () => {
    it('should export purchase request to CSV', async () => {
      const outputPath = path.join(testOutputDir, 'pr-export.csv');
      const result = await exportService.exportToCSV(
        'purchase-request',
        samplePurchaseRequestRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('csv');
      expect(result.outputPath).toBe(outputPath);

      // Verify file exists and has content
      const content = await fs.readFile(outputPath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('PR-2024-001');
    });

    it('should export purchase order to CSV', async () => {
      const outputPath = path.join(testOutputDir, 'po-export.csv');
      const result = await exportService.exportToCSV(
        'purchase-order',
        samplePurchaseOrderRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('csv');

      const content = await fs.readFile(outputPath, 'utf-8');
      expect(content).toContain('PO-2024-001');
    });

    it('should export invoice to CSV', async () => {
      const outputPath = path.join(testOutputDir, 'invoice-export.csv');
      const result = await exportService.exportToCSV(
        'invoice',
        sampleInvoiceRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('csv');

      const content = await fs.readFile(outputPath, 'utf-8');
      expect(content).toContain('INV-2024-001');
    });

    it('should export supplier to CSV', async () => {
      const outputPath = path.join(testOutputDir, 'supplier-export.csv');
      const result = await exportService.exportToCSV(
        'supplier',
        sampleSupplierRecord,
        outputPath,
        { preparedBy: 'Test User' }
      );

      expect(result.success).toBe(true);
      expect(result.format).toBe('csv');

      const content = await fs.readFile(outputPath, 'utf-8');
      expect(content).toContain('Tech Supplies Ltd');
    });

    it('should throw error for invalid data type', async () => {
      const outputPath = path.join(testOutputDir, 'invalid.csv');

      await expect(
        exportService.exportToCSV('invalid-type', {}, outputPath)
      ).rejects.toThrow('Unsupported data type');
    });
  });

  describe('exportToJSON', () => {
    it('should export data to JSON', async () => {
      const outputPath = path.join(testOutputDir, 'data-export.json');
      const testData = { id: 1, name: 'Test', items: [1, 2, 3] };

      const result = await exportService.exportToJSON(testData, outputPath);

      expect(result.success).toBe(true);
      expect(result.format).toBe('json');
      expect(result.outputPath).toBe(outputPath);

      // Verify file exists and is valid JSON
      const content = await fs.readFile(outputPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toEqual(testData);
    });

    it('should handle complex nested data', async () => {
      const outputPath = path.join(testOutputDir, 'complex-export.json');
      const complexData = {
        record: samplePurchaseRequestRecord,
        metadata: { exportedAt: new Date().toISOString() }
      };

      const result = await exportService.exportToJSON(complexData, outputPath);

      expect(result.success).toBe(true);

      const content = await fs.readFile(outputPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.record.localId).toBe('PR-2024-001');
    });

    it('should throw error for non-serializable data', async () => {
      const outputPath = path.join(testOutputDir, 'invalid.json');
      const circularData = {};
      circularData.self = circularData; // Create circular reference

      await expect(
        exportService.exportToJSON(circularData, outputPath)
      ).rejects.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should handle multiple export formats for same data', async () => {
      const baseName = 'multi-format-test';

      const pdfResult = await exportService.exportToPDF(
        'purchase-request',
        samplePurchaseRequestRecord,
        path.join(testOutputDir, `${baseName}.pdf`),
        { preparedBy: 'Test User' }
      );

      const excelResult = await exportService.exportToExcel(
        'purchase-request',
        samplePurchaseRequestRecord,
        path.join(testOutputDir, `${baseName}.xlsx`),
        { preparedBy: 'Test User' }
      );

      const csvResult = await exportService.exportToCSV(
        'purchase-request',
        samplePurchaseRequestRecord,
        path.join(testOutputDir, `${baseName}.csv`),
        { preparedBy: 'Test User' }
      );

      expect(pdfResult.success).toBe(true);
      expect(excelResult.success).toBe(true);
      expect(csvResult.success).toBe(true);
    });

    it('should properly clean up resources', async () => {
      // Export multiple PDFs to ensure browser reuse
      for (let i = 0; i < 3; i++) {
        const outputPath = path.join(testOutputDir, `cleanup-test-${i}.pdf`);
        await exportService.exportToPDF(
          'purchase-request',
          samplePurchaseRequestRecord,
          outputPath,
          { preparedBy: 'Test User' }
        );
      }

      // Close should work without errors
      await expect(exportService.close()).resolves.not.toThrow();
    }, 15000); // Increase timeout for browser operations
  });
});
