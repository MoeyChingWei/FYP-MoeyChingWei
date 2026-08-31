/**
 * Data Formatter Service
 *
 * Transforms database records into template-ready format for PDF generation.
 * Handles Purchase Requests, Purchase Orders, Invoices, and Supplier data.
 */

import { getStatusDisplay } from '../utils/status-display.js';

/**
 * Get current date in ISO format (YYYY-MM-DD)
 * @returns {string} Current date
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Add company information to data object
 * @param {Object} data - Data object to augment
 * @returns {Object} Data with company information
 */
function addCompanyInfo(data) {
  return {
    ...data,
    companyName: 'OptiMind Corporation',
    companyAddress: '123 Business Park, Innovation District, Tech City 12345'
  };
}

/**
 * Add sequential numbers to line items
 * @param {Array} lineItems - Array of line items
 * @returns {Array} Line items with sequential numbers
 */
function addLineItemNumbers(lineItems) {
  if (!lineItems || !Array.isArray(lineItems)) {
    return [];
  }

  return lineItems.map((item, index) => ({
    ...item,
    no: index + 1
  }));
}

/**
 * Format Purchase Request Record for template rendering
 * @param {Object} record - PurchaseRequestRecord from database
 * @param {Object} options - Additional options
 * @param {string} options.preparedBy - Name of person who prepared the document
 * @param {string} [options.approvedBy] - Name of person who approved the document
 * @returns {Object} Template-ready data
 */
export function formatPurchaseRequest(record, options = {}) {
  if (!record || !record.payload) {
    throw new Error('Invalid purchase request record: missing payload');
  }

  const { payload } = record;
  const { preparedBy, approvedBy } = options;
  const statusDisplay = getStatusDisplay(payload.status);

  const formattedLineItems = addLineItemNumbers(payload.lineItems || []);

  const data = {
    documentTitle: `Purchase Request #${payload.documentNumber}`,
    documentType: 'Purchase Request',
    documentNumber: payload.documentNumber,
    status: payload.status,
    statusLabel: statusDisplay.label,
    statusTone: statusDisplay.tone,
    requestDate: payload.requestDate,
    requesterName: payload.requesterName,
    department: payload.department,
    purpose: payload.purpose,
    lineItems: formattedLineItems,
    totalItems: formattedLineItems.length,
    preparedBy,
    approvedBy,
    generatedDate: getCurrentDate()
  };

  return addCompanyInfo(data);
}

/**
 * Format Purchase Order Record for template rendering
 * @param {Object} record - PurchaseOrderRecord from database
 * @param {Object} options - Additional options
 * @param {string} options.preparedBy - Name of person who prepared the document
 * @param {string} [options.approvedBy] - Name of person who approved the document
 * @returns {Object} Template-ready data
 */
export function formatPurchaseOrder(record, options = {}) {
  if (!record || !record.payload) {
    throw new Error('Invalid purchase order record: missing payload');
  }

  const { payload } = record;
  const { preparedBy, approvedBy } = options;
  const statusDisplay = getStatusDisplay(payload.status);

  const formattedLineItems = addLineItemNumbers(payload.lineItems || []);

  const data = {
    documentTitle: `Purchase Order #${payload.documentNumber}`,
    documentType: 'Purchase Order',
    documentNumber: payload.documentNumber,
    status: payload.status,
    statusLabel: statusDisplay.label,
    statusTone: statusDisplay.tone,
    orderDate: payload.orderDate,
    supplierName: payload.supplierName,
    deliveryAddress: payload.deliveryAddress,
    lineItems: formattedLineItems,
    subtotal: payload.subtotal,
    tax: payload.tax,
    total: payload.total,
    preparedBy,
    approvedBy,
    generatedDate: getCurrentDate()
  };

  return addCompanyInfo(data);
}

/**
 * Format Invoice Record for template rendering
 * @param {Object} record - Invoice record from database
 * @param {Object} options - Additional options
 * @param {string} options.preparedBy - Name of person who prepared the document
 * @param {string} [options.approvedBy] - Name of person who approved the document
 * @returns {Object} Template-ready data
 */
export function formatInvoice(record, options = {}) {
  if (!record || !record.payload) {
    throw new Error('Invalid invoice record: missing payload');
  }

  const { payload } = record;
  const { preparedBy, approvedBy } = options;
  const statusDisplay = getStatusDisplay(payload.status);

  const formattedLineItems = addLineItemNumbers(payload.lineItems || []);

  const data = {
    documentTitle: `Invoice #${payload.documentNumber}`,
    documentType: 'Invoice',
    documentNumber: payload.documentNumber,
    status: payload.status,
    statusLabel: statusDisplay.label,
    statusTone: statusDisplay.tone,
    invoiceDate: payload.invoiceDate,
    dueDate: payload.dueDate,
    supplierName: payload.supplierName,
    billingAddress: payload.billingAddress,
    lineItems: formattedLineItems,
    subtotal: payload.subtotal,
    tax: payload.tax,
    total: payload.total,
    preparedBy,
    approvedBy,
    generatedDate: getCurrentDate()
  };

  return addCompanyInfo(data);
}

/**
 * Format Supplier data for template rendering
 * @param {Object} supplier - Supplier record from database
 * @returns {Object} Template-ready supplier data
 */
export function formatSupplier(supplier) {
  if (!supplier || !supplier.name) {
    throw new Error('Invalid supplier record: missing name');
  }

  return {
    name: supplier.name,
    address: '[To be added]',
    phone: '[To be added]',
    email: '[To be added]'
  };
}

export default {
  formatPurchaseRequest,
  formatPurchaseOrder,
  formatInvoice,
  formatSupplier
};
