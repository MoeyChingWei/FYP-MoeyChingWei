import { describe, it, expect, beforeAll } from 'vitest';
import {
  formatPurchaseRequest,
  formatPurchaseOrder,
  formatInvoice,
  formatSupplier
} from '../services/data-formatter.js';

describe('Data Formatter Service', () => {
  let samplePurchaseRequestRecord;
  let samplePurchaseOrderRecord;
  let sampleInvoiceRecord;
  let sampleSupplierRecord;

  beforeAll(() => {
    // Sample data based on Prisma schema - PurchaseRequestRecord has localId and payload (JSON)
    samplePurchaseRequestRecord = {
      localId: 'PR-2024-001',
      payload: {
        documentNumber: 'PR-2024-001',
        status: 'Pending Approval',
        requestDate: '2024-06-22',
        requesterName: 'John Doe',
        department: 'IT Department',
        purpose: 'Equipment upgrade for development team',
        lineItems: [
          {
            itemName: 'Dell Laptop XPS 15',
            category: 'Computer Hardware',
            quantity: 5,
            unit: 'units',
            description: 'High-performance laptops for developers'
          },
          {
            itemName: 'USB-C Docking Station',
            category: 'Computer Accessories',
            quantity: 5,
            unit: 'units',
            description: 'Dual monitor support'
          }
        ]
      },
      createdAt: new Date('2024-06-22T10:30:00Z'),
      updatedAt: new Date('2024-06-22T10:30:00Z')
    };

    samplePurchaseOrderRecord = {
      localId: 'PO-2024-001',
      payload: {
        documentNumber: 'PO-2024-001',
        status: 'Confirmed',
        orderDate: '2024-06-23',
        supplierName: 'Tech Supplies Ltd',
        deliveryAddress: '123 Business Street, Tech City',
        lineItems: [
          {
            itemName: 'Dell Laptop XPS 15',
            category: 'Computer Hardware',
            quantity: 5,
            unit: 'units',
            unitPrice: 1200.00,
            totalPrice: 6000.00,
            description: 'High-performance laptops'
          }
        ],
        subtotal: 6000.00,
        tax: 360.00,
        total: 6360.00
      },
      createdAt: new Date('2024-06-23T09:00:00Z'),
      updatedAt: new Date('2024-06-23T09:00:00Z')
    };

    sampleInvoiceRecord = {
      localId: 'INV-2024-001',
      payload: {
        documentNumber: 'INV-2024-001',
        status: 'Paid',
        invoiceDate: '2024-06-24',
        dueDate: '2024-07-24',
        supplierName: 'Tech Supplies Ltd',
        billingAddress: '123 Business Street, Tech City',
        lineItems: [
          {
            itemName: 'Dell Laptop XPS 15',
            category: 'Computer Hardware',
            quantity: 5,
            unit: 'units',
            unitPrice: 1200.00,
            totalPrice: 6000.00,
            description: 'High-performance laptops'
          }
        ],
        subtotal: 6000.00,
        tax: 360.00,
        total: 6360.00
      },
      createdAt: new Date('2024-06-24T14:00:00Z'),
      updatedAt: new Date('2024-06-24T14:00:00Z')
    };

    sampleSupplierRecord = {
      id: 1,
      name: 'Tech Supplies Ltd'
    };
  });

  describe('formatPurchaseRequest', () => {
    it('should transform PurchaseRequestRecord into template-ready format', () => {
      const result = formatPurchaseRequest(samplePurchaseRequestRecord, {
        preparedBy: 'John Doe',
        approvedBy: 'Jane Smith'
      });

      expect(result).toHaveProperty('documentTitle');
      expect(result).toHaveProperty('documentType', 'Purchase Request');
      expect(result).toHaveProperty('documentNumber', 'PR-2024-001');
      expect(result).toHaveProperty('status', 'Pending Approval');
      expect(result).toHaveProperty('requestDate', '2024-06-22');
      expect(result).toHaveProperty('requesterName', 'John Doe');
      expect(result).toHaveProperty('department', 'IT Department');
      expect(result).toHaveProperty('purpose', 'Equipment upgrade for development team');
      expect(result).toHaveProperty('lineItems');
      expect(result.lineItems).toHaveLength(2);
      expect(result).toHaveProperty('totalItems', 2);
      expect(result).toHaveProperty('preparedBy', 'John Doe');
      expect(result).toHaveProperty('approvedBy', 'Jane Smith');
      expect(result).toHaveProperty('generatedDate');
    });

    it('should add sequential numbers to line items', () => {
      const result = formatPurchaseRequest(samplePurchaseRequestRecord, {
        preparedBy: 'John Doe',
        approvedBy: 'Jane Smith'
      });

      expect(result.lineItems[0]).toHaveProperty('no', 1);
      expect(result.lineItems[1]).toHaveProperty('no', 2);
      expect(result.lineItems[0]).toHaveProperty('itemName', 'Dell Laptop XPS 15');
      expect(result.lineItems[0]).toHaveProperty('quantity', 5);
    });

    it('should generate document title from document number', () => {
      const result = formatPurchaseRequest(samplePurchaseRequestRecord, {
        preparedBy: 'John Doe',
        approvedBy: 'Jane Smith'
      });

      expect(result.documentTitle).toContain('PR-2024-001');
      expect(result.documentTitle).toContain('Purchase Request');
    });

    it('should format generatedDate as ISO date string', () => {
      const result = formatPurchaseRequest(samplePurchaseRequestRecord, {
        preparedBy: 'John Doe',
        approvedBy: 'Jane Smith'
      });

      expect(result.generatedDate).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it('should include company information', () => {
      const result = formatPurchaseRequest(samplePurchaseRequestRecord, {
        preparedBy: 'John Doe',
        approvedBy: 'Jane Smith'
      });

      expect(result).toHaveProperty('companyName', 'OptiMind Corporation');
      expect(result).toHaveProperty('companyAddress');
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalRecord = {
        localId: 'PR-2024-002',
        payload: {
          documentNumber: 'PR-2024-002',
          status: 'Draft',
          requesterName: 'Test User',
          department: 'Test Dept',
          lineItems: []
        }
      };

      const result = formatPurchaseRequest(minimalRecord, {
        preparedBy: 'Test User'
      });

      expect(result).toHaveProperty('documentNumber', 'PR-2024-002');
      expect(result.lineItems).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.purpose).toBeUndefined();
      expect(result.approvedBy).toBeUndefined();
    });
  });

  describe('formatPurchaseOrder', () => {
    it('should transform PurchaseOrderRecord into template-ready format', () => {
      const result = formatPurchaseOrder(samplePurchaseOrderRecord, {
        preparedBy: 'John Doe',
        approvedBy: 'Jane Smith'
      });

      expect(result).toHaveProperty('documentTitle');
      expect(result).toHaveProperty('documentType', 'Purchase Order');
      expect(result).toHaveProperty('documentNumber', 'PO-2024-001');
      expect(result).toHaveProperty('status', 'Confirmed');
      expect(result).toHaveProperty('orderDate', '2024-06-23');
      expect(result).toHaveProperty('supplierName', 'Tech Supplies Ltd');
      expect(result).toHaveProperty('deliveryAddress', '123 Business Street, Tech City');
      expect(result).toHaveProperty('lineItems');
      expect(result.lineItems).toHaveLength(1);
      expect(result).toHaveProperty('subtotal', 6000.00);
      expect(result).toHaveProperty('tax', 360.00);
      expect(result).toHaveProperty('total', 6360.00);
      expect(result).toHaveProperty('preparedBy', 'John Doe');
      expect(result).toHaveProperty('approvedBy', 'Jane Smith');
      expect(result).toHaveProperty('generatedDate');
    });

    it('should add sequential numbers to line items', () => {
      const result = formatPurchaseOrder(samplePurchaseOrderRecord, {
        preparedBy: 'John Doe',
        approvedBy: 'Jane Smith'
      });

      expect(result.lineItems[0]).toHaveProperty('no', 1);
      expect(result.lineItems[0]).toHaveProperty('itemName', 'Dell Laptop XPS 15');
      expect(result.lineItems[0]).toHaveProperty('unitPrice', 1200.00);
      expect(result.lineItems[0]).toHaveProperty('totalPrice', 6000.00);
    });

    it('should include financial calculations', () => {
      const result = formatPurchaseOrder(samplePurchaseOrderRecord, {
        preparedBy: 'John Doe',
        approvedBy: 'Jane Smith'
      });

      expect(result.subtotal).toBe(6000.00);
      expect(result.tax).toBe(360.00);
      expect(result.total).toBe(6360.00);
    });
  });

  describe('formatInvoice', () => {
    it('should transform Invoice record into template-ready format', () => {
      const result = formatInvoice(sampleInvoiceRecord, {
        preparedBy: 'Accounts Team',
        approvedBy: 'Finance Manager'
      });

      expect(result).toHaveProperty('documentTitle');
      expect(result).toHaveProperty('documentType', 'Invoice');
      expect(result).toHaveProperty('documentNumber', 'INV-2024-001');
      expect(result).toHaveProperty('status', 'Paid');
      expect(result).toHaveProperty('invoiceDate', '2024-06-24');
      expect(result).toHaveProperty('dueDate', '2024-07-24');
      expect(result).toHaveProperty('supplierName', 'Tech Supplies Ltd');
      expect(result).toHaveProperty('billingAddress', '123 Business Street, Tech City');
      expect(result).toHaveProperty('lineItems');
      expect(result).toHaveProperty('subtotal', 6000.00);
      expect(result).toHaveProperty('tax', 360.00);
      expect(result).toHaveProperty('total', 6360.00);
      expect(result).toHaveProperty('preparedBy', 'Accounts Team');
      expect(result).toHaveProperty('approvedBy', 'Finance Manager');
      expect(result).toHaveProperty('generatedDate');
    });

    it('should add sequential numbers to line items', () => {
      const result = formatInvoice(sampleInvoiceRecord, {
        preparedBy: 'Accounts Team',
        approvedBy: 'Finance Manager'
      });

      expect(result.lineItems[0]).toHaveProperty('no', 1);
      expect(result.lineItems[0]).toHaveProperty('itemName', 'Dell Laptop XPS 15');
    });

    it('should format invoice dates correctly', () => {
      const result = formatInvoice(sampleInvoiceRecord, {
        preparedBy: 'Accounts Team'
      });

      expect(result.invoiceDate).toBe('2024-06-24');
      expect(result.dueDate).toBe('2024-07-24');
    });
  });

  describe('formatSupplier', () => {
    it('should transform Supplier record into template-ready format', () => {
      const result = formatSupplier(sampleSupplierRecord);

      expect(result).toHaveProperty('name', 'Tech Supplies Ltd');
      expect(result).toHaveProperty('address', '[To be added]');
      expect(result).toHaveProperty('phone', '[To be added]');
      expect(result).toHaveProperty('email', '[To be added]');
    });

    it('should use placeholder text for missing fields', () => {
      const result = formatSupplier(sampleSupplierRecord);

      expect(result.address).toBe('[To be added]');
      expect(result.phone).toBe('[To be added]');
      expect(result.email).toBe('[To be added]');
    });

    it('should handle minimal supplier data', () => {
      const minimalSupplier = {
        id: 2,
        name: 'Minimal Supplier'
      };

      const result = formatSupplier(minimalSupplier);

      expect(result).toHaveProperty('name', 'Minimal Supplier');
      expect(result).toHaveProperty('address', '[To be added]');
    });

    it('should preserve supplier name exactly', () => {
      const supplierWithSpecialName = {
        id: 3,
        name: 'ABC Tech & Co., Ltd.'
      };

      const result = formatSupplier(supplierWithSpecialName);

      expect(result.name).toBe('ABC Tech & Co., Ltd.');
    });
  });

  describe('Integration tests', () => {
    it('should work with template renderer data format', () => {
      const formatted = formatPurchaseRequest(samplePurchaseRequestRecord, {
        preparedBy: 'John Doe',
        approvedBy: 'Jane Smith'
      });

      // Verify it has all required fields for template renderer
      expect(formatted).toHaveProperty('documentTitle');
      expect(formatted).toHaveProperty('documentType');
      expect(formatted).toHaveProperty('documentNumber');
      expect(formatted).toHaveProperty('status');
      expect(formatted).toHaveProperty('lineItems');
      expect(formatted).toHaveProperty('companyName');
      expect(formatted).toHaveProperty('companyAddress');
      expect(formatted).toHaveProperty('preparedBy');
    });

    it('should handle records with null payload gracefully', () => {
      const recordWithNullPayload = {
        localId: 'PR-NULL-001',
        payload: null
      };

      expect(() => {
        formatPurchaseRequest(recordWithNullPayload, {});
      }).toThrow();
    });
  });
});
