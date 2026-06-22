import { describe, it, expect, beforeAll } from 'vitest';
import { renderTemplate } from '../services/template-renderer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Template Renderer Service', () => {
  let testData;

  beforeAll(() => {
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

  describe('renderTemplate', () => {
    it('should render purchase-request template with data', async () => {
      const html = await renderTemplate('purchase-request', testData);

      expect(html).toBeTruthy();
      expect(typeof html).toBe('string');
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Purchase Request #PR-2024-001');
      expect(html).toContain('PR-2024-001');
      expect(html).toContain('John Doe');
      expect(html).toContain('IT Department');
      expect(html).toContain('Dell Laptop XPS 15');
      expect(html).toContain('USB-C Docking Station');
    });

    it('should include CSS styles in rendered output', async () => {
      const html = await renderTemplate('purchase-request', testData);

      expect(html).toContain('<style>');
      expect(html).toContain('body');
      expect(html).toContain('.data-table');
    });

    it('should include header partial in rendered output', async () => {
      const html = await renderTemplate('purchase-request', testData);

      expect(html).toContain('company-header');
      expect(html).toContain('OptiMind ERP System');
    });

    it('should include footer partial in rendered output', async () => {
      const html = await renderTemplate('purchase-request', testData);

      expect(html).toContain('page-footer');
      expect(html).toContain('This document was generated');
    });

    it('should include signature partial in rendered output', async () => {
      const html = await renderTemplate('purchase-request', testData);

      expect(html).toContain('signature-block');
      expect(html).toContain('John Doe'); // preparedBy
      expect(html).toContain('Robert Johnson'); // approvedBy
      expect(html).toContain('Prepared By');
      expect(html).toContain('Approved By');
    });

    it('should handle missing optional fields', async () => {
      const minimalData = {
        documentTitle: 'Test Document',
        documentType: 'Purchase Request',
        documentNumber: 'PR-TEST-001',
        status: 'Draft',
        requesterName: 'Test User',
        department: 'Test Dept',
        lineItems: [],
        companyName: 'Test Company',
        companyAddress: 'Test Address'
      };

      const html = await renderTemplate('purchase-request', minimalData);

      expect(html).toBeTruthy();
      expect(html).toContain('Test Document');
      expect(html).toContain('PR-TEST-001');
    });

    it('should iterate over line items correctly', async () => {
      const html = await renderTemplate('purchase-request', testData);

      // Check that both line items are rendered
      expect(html).toContain('Dell Laptop XPS 15');
      expect(html).toContain('Computer Hardware');
      expect(html).toContain('USB-C Docking Station');
      expect(html).toContain('Computer Accessories');

      // Check quantities are rendered
      expect(html).toContain('5');
    });

    it('should throw error for non-existent template', async () => {
      await expect(renderTemplate('non-existent-template', testData))
        .rejects.toThrow();
    });

    it('should handle empty data gracefully', async () => {
      const emptyData = {
        documentTitle: '',
        documentType: '',
        documentNumber: '',
        status: '',
        requesterName: '',
        department: '',
        lineItems: [],
        companyName: '',
        companyAddress: ''
      };

      const html = await renderTemplate('purchase-request', emptyData);

      expect(html).toBeTruthy();
      expect(html).toContain('<!DOCTYPE html>');
    });
  });
});
