import { Parser } from 'json2csv';
import { displayCurrency } from './currency.js';

/**
 * Export purchase requests to CSV format
 */
export function exportPurchaseRequestsToCSV(requests) {
  if (!requests || requests.length === 0) {
    throw new Error('No purchase requests to export');
  }

  // Flatten the data structure for CSV export
  const flattenedData = [];

  requests.forEach((request) => {
    const baseInfo = {
      prNumber: request.prNumber || 'N/A',
      status: request.status || 'PENDING',
      department: request.department || 'N/A',
      requestBy: request.requestBy || 'N/A',
      requestDate: request.requestDate || 'N/A',
      createdByEmail: request.createdByEmail || 'N/A',
      currency: displayCurrency(request.currency),
      urgency: request.urgency || 'normal',
      procurementNotes: request.procurementNotes || '',
    };

    // If there are line items, create one row per item
    if (request.lineItems && request.lineItems.length > 0) {
      request.lineItems.forEach((item, index) => {
        flattenedData.push({
          ...baseInfo,
          itemNumber: index + 1,
          itemName: item.itemName || 'N/A',
          itemCategory: item.itemCategory || 'N/A',
          itemDescription: item.itemDescription || 'N/A',
          quantity: item.quantity || 0,
          unitOfMeasurement: item.unitOfMeasurement || 'N/A',
          unitPrice: item.unitPrice || 0,
          totalPrice: (item.quantity || 0) * (item.unitPrice || 0),
          supplierName: item.supplierName || 'N/A',
          supplierEmail: item.supplierEmail || 'N/A',
        });
      });
    } else {
      // No items - just export the base info
      flattenedData.push({
        ...baseInfo,
        itemNumber: 0,
        itemName: 'N/A',
        itemCategory: 'N/A',
        itemDescription: 'N/A',
        quantity: 0,
        unitOfMeasurement: 'N/A',
        unitPrice: 0,
        totalPrice: 0,
        supplierName: 'N/A',
        supplierEmail: 'N/A',
      });
    }
  });

  // Define CSV fields
  const fields = [
    { label: 'PR Number', value: 'prNumber' },
    { label: 'Status', value: 'status' },
    { label: 'Department', value: 'department' },
    { label: 'Requested By', value: 'requestBy' },
    { label: 'Request Date', value: 'requestDate' },
    { label: 'Email', value: 'createdByEmail' },
    { label: 'Currency', value: 'currency' },
    { label: 'Urgency', value: 'urgency' },
    { label: 'Item #', value: 'itemNumber' },
    { label: 'Item Name', value: 'itemName' },
    { label: 'Category', value: 'itemCategory' },
    { label: 'Description', value: 'itemDescription' },
    { label: 'Quantity', value: 'quantity' },
    { label: 'Unit', value: 'unitOfMeasurement' },
    { label: 'Unit Price', value: 'unitPrice' },
    { label: 'Total Price', value: 'totalPrice' },
    { label: 'Supplier Name', value: 'supplierName' },
    { label: 'Supplier Email', value: 'supplierEmail' },
    { label: 'Procurement Notes', value: 'procurementNotes' },
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(flattenedData);

  return csv;
}

/**
 * Export purchase requests to JSON format
 */
export function exportPurchaseRequestsToJSON(requests) {
  if (!requests || requests.length === 0) {
    throw new Error('No purchase requests to export');
  }

  return JSON.stringify(requests, null, 2);
}

/**
 * Generate filename for export
 */
export function generateExportFilename(format, department = null) {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const departmentPrefix = department ? `${department.replace(/\s+/g, '_')}_` : '';
  return `${departmentPrefix}Purchase_Requests_${timestamp}.${format}`;
}
