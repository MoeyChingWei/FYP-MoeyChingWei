/**
 * Export Service
 *
 * Unified service that orchestrates data formatting, template rendering,
 * and document generation across multiple formats (PDF, Excel, CSV, JSON).
 */

import { PDFGenerator } from './pdf-generator.js';
import {
  formatPurchaseRequest,
  formatPurchaseOrder,
  formatInvoice,
  formatSupplier
} from './data-formatter.js';
import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import path from 'path';

/**
 * ExportService class
 * Provides unified interface for exporting data in multiple formats
 */
export class ExportService {
  constructor() {
    this.pdfGenerator = new PDFGenerator();
  }

  /**
   * Get template name for a given data type
   * @private
   * @param {string} dataType - Data type identifier
   * @returns {string} Template name
   */
  _getTemplateName(dataType) {
    const templates = {
      'purchase-request': 'purchase-request',
      'purchase-order': 'purchase-order',
      'invoice': 'invoice',
      'supplier': 'supplier'
    };

    if (!templates[dataType]) {
      throw new Error(`Unsupported data type: ${dataType}`);
    }

    return templates[dataType];
  }

  /**
   * Get formatter function for a given data type
   * @private
   * @param {string} dataType - Data type identifier
   * @returns {Function} Formatter function
   */
  _getFormatter(dataType) {
    const formatters = {
      'purchase-request': formatPurchaseRequest,
      'purchase-order': formatPurchaseOrder,
      'invoice': formatInvoice,
      'supplier': formatSupplier
    };

    if (!formatters[dataType]) {
      throw new Error(`Unsupported data type: ${dataType}`);
    }

    return formatters[dataType];
  }

  /**
   * Export data to PDF format
   * @param {string} dataType - Type of data ('purchase-request', 'purchase-order', 'invoice', 'supplier')
   * @param {Object} data - Database record to export
   * @param {string} outputPath - Path where the PDF should be saved
   * @param {Object} options - Export options
   * @param {string} options.preparedBy - Name of person who prepared the document
   * @param {string} [options.approvedBy] - Name of person who approved the document
   * @returns {Promise<Object>} Result with success status, outputPath, and format
   */
  async exportToPDF(dataType, data, outputPath, options = {}) {
    try {
      // Get template name and formatter
      const templateName = this._getTemplateName(dataType);
      const formatter = this._getFormatter(dataType);

      // Format data
      const formattedData = formatter(data, options);

      // Generate PDF from template
      await this.pdfGenerator.generatePDFFromTemplate(
        templateName,
        formattedData,
        outputPath
      );

      return {
        success: true,
        outputPath,
        format: 'pdf'
      };
    } catch (error) {
      throw new Error(`Failed to export to PDF: ${error.message}`);
    }
  }

  /**
   * Export data to Excel format
   * @param {string} dataType - Type of data
   * @param {Object} data - Database record to export
   * @param {string} outputPath - Path where the Excel file should be saved
   * @param {Object} options - Export options
   * @returns {Promise<Object>} Result with success status, outputPath, and format
   */
  async exportToExcel(dataType, data, outputPath, options = {}) {
    try {
      // Get formatter
      const formatter = this._getFormatter(dataType);

      // Format data
      const formattedData = formatter(data, options);

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Export');

      // Add header row with company name
      worksheet.addRow([formattedData.companyName]);
      worksheet.mergeCells('A1:D1');
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      // Add company address
      worksheet.addRow([formattedData.companyAddress]);
      worksheet.mergeCells('A2:D2');
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      // Add blank row
      worksheet.addRow([]);

      // Add document info section
      worksheet.addRow(['Document Type:', formattedData.documentType]);
      worksheet.addRow(['Document Number:', formattedData.documentNumber]);
      worksheet.addRow(['Status:', formattedData.status]);
      worksheet.addRow(['Generated Date:', formattedData.generatedDate]);

      // Add type-specific fields
      if (dataType === 'purchase-request') {
        worksheet.addRow(['Request Date:', formattedData.requestDate]);
        worksheet.addRow(['Requester:', formattedData.requesterName]);
        worksheet.addRow(['Department:', formattedData.department]);
        if (formattedData.purpose) {
          worksheet.addRow(['Purpose:', formattedData.purpose]);
        }
      } else if (dataType === 'purchase-order') {
        worksheet.addRow(['Order Date:', formattedData.orderDate]);
        worksheet.addRow(['Supplier:', formattedData.supplierName]);
        worksheet.addRow(['Delivery Address:', formattedData.deliveryAddress]);
      } else if (dataType === 'invoice') {
        worksheet.addRow(['Invoice Date:', formattedData.invoiceDate]);
        worksheet.addRow(['Due Date:', formattedData.dueDate]);
        worksheet.addRow(['Supplier:', formattedData.supplierName]);
        worksheet.addRow(['Billing Address:', formattedData.billingAddress]);
      } else if (dataType === 'supplier') {
        worksheet.addRow(['Name:', formattedData.name]);
        worksheet.addRow(['Address:', formattedData.address]);
        worksheet.addRow(['Phone:', formattedData.phone]);
        worksheet.addRow(['Email:', formattedData.email]);
      }

      // Add blank row
      worksheet.addRow([]);

      // Add line items section if available
      if (formattedData.lineItems && formattedData.lineItems.length > 0) {
        // Add line items header
        const headerRow = worksheet.addRow(['No', 'Item Name', 'Quantity', 'Unit']);
        headerRow.font = { bold: true };

        // Add line items
        formattedData.lineItems.forEach(item => {
          worksheet.addRow([
            item.no,
            item.itemName,
            item.quantity,
            item.unit
          ]);
        });

        // Add blank row
        worksheet.addRow([]);

        // Add financial summary if available
        if (formattedData.subtotal !== undefined) {
          worksheet.addRow(['', '', 'Subtotal:', formattedData.subtotal]);
          worksheet.addRow(['', '', 'Tax:', formattedData.tax]);
          worksheet.addRow(['', '', 'Total:', formattedData.total]);
          worksheet.addRow([]);
        }
      }

      // Add footer section
      worksheet.addRow(['Prepared By:', formattedData.preparedBy]);
      if (formattedData.approvedBy) {
        worksheet.addRow(['Approved By:', formattedData.approvedBy]);
      }

      // Auto-size columns
      worksheet.columns.forEach(column => {
        column.width = 20;
      });

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Save workbook
      await workbook.xlsx.writeFile(outputPath);

      return {
        success: true,
        outputPath,
        format: 'excel'
      };
    } catch (error) {
      throw new Error(`Failed to export to Excel: ${error.message}`);
    }
  }

  /**
   * Export data to CSV format
   * @param {string} dataType - Type of data
   * @param {Object} data - Database record to export
   * @param {string} outputPath - Path where the CSV file should be saved
   * @param {Object} options - Export options
   * @returns {Promise<Object>} Result with success status, outputPath, and format
   */
  async exportToCSV(dataType, data, outputPath, options = {}) {
    try {
      // Get formatter
      const formatter = this._getFormatter(dataType);

      // Format data
      const formattedData = formatter(data, options);

      // Build CSV content
      const lines = [];

      // Add header section
      lines.push(`Company,${this._escapeCSV(formattedData.companyName)}`);
      lines.push(`Address,${this._escapeCSV(formattedData.companyAddress)}`);
      lines.push('');
      lines.push(`Document Type,${this._escapeCSV(formattedData.documentType)}`);
      lines.push(`Document Number,${this._escapeCSV(formattedData.documentNumber)}`);
      lines.push(`Status,${this._escapeCSV(formattedData.status)}`);
      lines.push(`Generated Date,${this._escapeCSV(formattedData.generatedDate)}`);

      // Add type-specific fields
      if (dataType === 'purchase-request') {
        lines.push(`Request Date,${this._escapeCSV(formattedData.requestDate)}`);
        lines.push(`Requester,${this._escapeCSV(formattedData.requesterName)}`);
        lines.push(`Department,${this._escapeCSV(formattedData.department)}`);
        if (formattedData.purpose) {
          lines.push(`Purpose,${this._escapeCSV(formattedData.purpose)}`);
        }
      } else if (dataType === 'purchase-order') {
        lines.push(`Order Date,${this._escapeCSV(formattedData.orderDate)}`);
        lines.push(`Supplier,${this._escapeCSV(formattedData.supplierName)}`);
        lines.push(`Delivery Address,${this._escapeCSV(formattedData.deliveryAddress)}`);
      } else if (dataType === 'invoice') {
        lines.push(`Invoice Date,${this._escapeCSV(formattedData.invoiceDate)}`);
        lines.push(`Due Date,${this._escapeCSV(formattedData.dueDate)}`);
        lines.push(`Supplier,${this._escapeCSV(formattedData.supplierName)}`);
        lines.push(`Billing Address,${this._escapeCSV(formattedData.billingAddress)}`);
      } else if (dataType === 'supplier') {
        lines.push(`Name,${this._escapeCSV(formattedData.name)}`);
        lines.push(`Address,${this._escapeCSV(formattedData.address)}`);
        lines.push(`Phone,${this._escapeCSV(formattedData.phone)}`);
        lines.push(`Email,${this._escapeCSV(formattedData.email)}`);
      }

      // Add line items section if available
      if (formattedData.lineItems && formattedData.lineItems.length > 0) {
        lines.push('');
        lines.push('Line Items');
        lines.push('No,Item Name,Quantity,Unit');

        formattedData.lineItems.forEach(item => {
          lines.push(
            `${item.no},${this._escapeCSV(item.itemName)},${item.quantity},${this._escapeCSV(item.unit)}`
          );
        });

        // Add financial summary if available
        if (formattedData.subtotal !== undefined) {
          lines.push('');
          lines.push(`Subtotal,${formattedData.subtotal}`);
          lines.push(`Tax,${formattedData.tax}`);
          lines.push(`Total,${formattedData.total}`);
        }
      }

      // Add footer
      lines.push('');
      lines.push(`Prepared By,${this._escapeCSV(formattedData.preparedBy)}`);
      if (formattedData.approvedBy) {
        lines.push(`Approved By,${this._escapeCSV(formattedData.approvedBy)}`);
      }

      // Join lines with newline
      const csvContent = lines.join('\n');

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Write CSV file
      await fs.writeFile(outputPath, csvContent, 'utf-8');

      return {
        success: true,
        outputPath,
        format: 'csv'
      };
    } catch (error) {
      throw new Error(`Failed to export to CSV: ${error.message}`);
    }
  }

  /**
   * Escape CSV values (wrap in quotes if contains comma, quote, or newline)
   * @private
   * @param {any} value - Value to escape
   * @returns {string} Escaped value
   */
  _escapeCSV(value) {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }

  /**
   * Export data to JSON format
   * @param {Object} data - Data to export (any JSON-serializable data)
   * @param {string} outputPath - Path where the JSON file should be saved
   * @returns {Promise<Object>} Result with success status, outputPath, and format
   */
  async exportToJSON(data, outputPath) {
    try {
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Serialize to JSON
      const jsonContent = JSON.stringify(data, null, 2);

      // Write JSON file
      await fs.writeFile(outputPath, jsonContent, 'utf-8');

      return {
        success: true,
        outputPath,
        format: 'json'
      };
    } catch (error) {
      throw new Error(`Failed to export to JSON: ${error.message}`);
    }
  }

  /**
   * Close and clean up resources
   * @returns {Promise<void>}
   */
  async close() {
    await this.pdfGenerator.close();
  }
}

export default ExportService;
