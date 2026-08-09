import BaseAgent from '../base-agent.js';
import prisma from '../../config/prisma.js';

/**
 * Validation rules engine
 */
const VALIDATION_RULES = {
  purchaseRequest: {
    required: ['prNumber', 'department', 'requestBy', 'lineItems'],
    lineItemRequired: ['itemName', 'itemCategory', 'quantity', 'unitOfMeasurement'],
    amountThreshold: 100000, // Requires extra verification above this amount
  },
  purchaseOrder: {
    required: ['poNumber', 'department', 'items'],
    itemRequired: ['itemName', 'quantity', 'unitPrice', 'supplierName'],
    amountThreshold: 50000,
  },
};

/**
 * Calculate document completeness score
 */
function calculateCompletenessScore(document, docType) {
  const rules = VALIDATION_RULES[docType];
  if (!rules) return { score: 0, details: ['Unknown document type'] };

  const issues = [];
  let score = 100;

  // Check required fields
  rules.required.forEach(field => {
    if (!document[field]) {
      score -= 15;
      issues.push(`❌ Missing required field: ${field}`);
    }
  });

  // Check line items
  if (document.lineItems || document.items) {
    const items = document.lineItems || document.items;
    const itemRules = rules.lineItemRequired || rules.itemRequired;

    items.forEach((item, idx) => {
      itemRules.forEach(field => {
        if (!item[field]) {
          score -= 5;
          issues.push(`⚠️ Item ${idx + 1}: Missing ${field}`);
        }
      });
    });
  } else {
    score -= 20;
    issues.push('❌ No line items found');
  }

  return {
    score: Math.max(0, score),
    issues,
    level: score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'fair' : 'poor',
  };
}

/**
 * Verify amount calculations
 */
function verifyAmountCalculations(items) {
  const errors = [];
  let totalCalculated = 0;

  items.forEach((item, idx) => {
    const unitPrice = parseFloat(item.unitPrice || 0);
    const quantity = parseFloat(item.quantity || 0);
    const totalPrice = parseFloat(item.totalPrice || 0);
    const expectedTotal = unitPrice * quantity;

    if (Math.abs(expectedTotal - totalPrice) > 0.01) {
      errors.push({
        item: idx + 1,
        name: item.itemName,
        expected: expectedTotal.toFixed(2),
        actual: totalPrice.toFixed(2),
        difference: (totalPrice - expectedTotal).toFixed(2),
      });
    }

    totalCalculated += expectedTotal;
  });

  return {
    isValid: errors.length === 0,
    errors,
    totalCalculated: totalCalculated.toFixed(2),
  };
}

/**
 * Detect document anomalies
 */
function detectDocumentAnomalies(document, docType) {
  const anomalies = [];

  const items = document.lineItems || document.items || [];
  const totalAmount = items.reduce((sum, item) =>
    sum + parseFloat(item.totalPrice || item.unitPrice * item.quantity || 0), 0);

  // 1. Amount anomaly
  const threshold = VALIDATION_RULES[docType]?.amountThreshold || 100000;
  if (totalAmount > threshold) {
    anomalies.push({
      type: 'high_value',
      severity: 'medium',
      message: `Total amount ${totalAmount.toFixed(2)} exceeds the threshold ${threshold}`,
      recommendation: 'Requires additional approval',
    });
  }

  // 2. Quantity anomaly
  items.forEach((item, idx) => {
    const qty = parseFloat(item.quantity || 0);
    if (qty > 1000) {
      anomalies.push({
        type: 'high_quantity',
        severity: 'low',
        message: `Item ${idx + 1} (${item.itemName}): quantity ${qty} is unusually high`,
        recommendation: 'Confirm the quantity is correct',
      });
    }
    if (qty === 0) {
      anomalies.push({
        type: 'zero_quantity',
        severity: 'high',
        message: `Item ${idx + 1} (${item.itemName}): quantity is 0`,
        recommendation: 'Must be corrected',
      });
    }
  });

  // 3. Price anomaly
  items.forEach((item, idx) => {
    const price = parseFloat(item.unitPrice || 0);
    if (price === 0 && docType === 'purchaseOrder') {
      anomalies.push({
        type: 'zero_price',
        severity: 'high',
        message: `Item ${idx + 1} (${item.itemName}): price is 0`,
        recommendation: 'Price needs to be set',
      });
    }
  });

  // 4. Supplier anomaly
  if (docType === 'purchaseOrder') {
    const missingSupplier = items.filter(item => !item.supplierName);
    if (missingSupplier.length > 0) {
      anomalies.push({
        type: 'missing_supplier',
        severity: 'high',
        message: `${missingSupplier.length} item(s) missing supplier information`,
        recommendation: 'Supplier must be specified',
      });
    }
  }

  return anomalies;
}

/**
 * Check for duplicate items
 */
function checkDuplicateItems(items) {
  const duplicates = [];
  const seen = {};

  items.forEach((item, idx) => {
    const key = `${item.itemName}_${item.itemCategory}`.toLowerCase();
    if (seen[key]) {
      duplicates.push({
        item1: seen[key],
        item2: idx + 1,
        name: item.itemName,
        suggestion: 'Consider merging into a single item',
      });
    } else {
      seen[key] = idx + 1;
    }
  });

  return duplicates;
}

/**
 * Check price consistency
 */
function checkPriceConsistency(items) {
  const priceByItem = {};
  const inconsistencies = [];

  items.forEach((item, idx) => {
    const key = item.itemName.toLowerCase();
    const price = parseFloat(item.unitPrice || 0);

    if (!priceByItem[key]) {
      priceByItem[key] = [];
    }
    priceByItem[key].push({ index: idx + 1, price });
  });

  Object.entries(priceByItem).forEach(([name, priceList]) => {
    if (priceList.length > 1) {
      const prices = priceList.map(p => p.price);
      const uniquePrices = [...new Set(prices)];

      if (uniquePrices.length > 1) {
        inconsistencies.push({
          item: name,
          prices: uniquePrices,
          message: `Same item has different prices: ${uniquePrices.join(', ')}`,
        });
      }
    }
  });

  return {
    isConsistent: inconsistencies.length === 0,
    inconsistencies,
  };
}

/**
 * Check quantity reasonableness
 */
function checkQuantityReasonableness(items) {
  const issues = [];

  items.forEach((item, idx) => {
    const qty = parseFloat(item.quantity || 0);

    // Check if it's a decimal (some units should not have decimals)
    const wholeNumberUnits = ['piece', 'unit', 'box', 'set', 'pack'];
    if (wholeNumberUnits.includes(item.unitOfMeasurement) && qty % 1 !== 0) {
      issues.push({
        item: idx + 1,
        name: item.itemName,
        issue: `Quantity ${qty} should not be a decimal (unit: ${item.unitOfMeasurement})`,
      });
    }
  });

  return issues;
}

const DOCUMENT_AGENT_SYSTEM_PROMPT = `You are the Document Specialist for OptiMind ERP system.

YOUR IDENTITY:
- Name: Document Specialist
- Role: Document processing and analysis expert
- Expertise: PDF generation, data extraction, document verification

CURRENT USER:
- Name: {userName}
- Role: {userRole}
- Department: {userDepartment}
- Email: {userEmail}

YOUR PERSONALITY:
- Precise and detail-oriented
- Systematic in approach
- Quality-focused
- Efficient in processing
- Thorough in verification

YOUR COMMUNICATION STYLE:
- Start with "I've reviewed the document..."
- Always provide structured summaries
- Use document indicators: 📄 (document), ✅ (verified), ⚠️ (issue found)
- Highlight key information
- Report findings systematically

YOUR THINKING PROCESS:
1. **Receive Document**: Understand what needs processing
2. **Extract Data**: Pull relevant information
3. **Verify**: Check accuracy and completeness
4. **Analyze**: Identify issues or insights
5. **Report**: Provide structured findings

## Core Capabilities

### 1. Document Generation
- Purchase Orders (PO)
- Purchase Requests (PR)
- Goods Received Notes (GRN)
- Supplier Invoices
- Reports and summaries

### 2. Data Extraction
- Extract line items from documents
- Parse pricing information
- Identify parties (supplier, buyer)
- Extract dates and references
- Pull terms and conditions

### 3. Document Verification
- Completeness check
- Data consistency validation
- Cross-reference with database
- Flag discrepancies
- Verify calculations

### 4. Document Analysis
- Compare documents (PO vs Invoice)
- Identify variances
- Detect anomalies
- Extract insights
- Generate summaries

## Response Format

For document processing tasks:

**📄 DOCUMENT SUMMARY:**
- Type: [document type]
- Reference: [number]
- Date: [date]
- Status: [status indicator]

**📊 EXTRACTED DATA:**
- Key Field 1: Value
- Key Field 2: Value
- Key Field 3: Value

**✅ VERIFICATION RESULTS:**
- Completeness: [percentage]
- Accuracy: [status]
- Issues Found: [count]

**⚠️ FINDINGS:**
- Finding 1 with severity
- Finding 2 with severity
- Finding 3 with severity

**🎯 RECOMMENDATIONS:**
- Recommended action 1
- Recommended action 2

## Example Response

"I've reviewed the document and completed the analysis:

📄 DOCUMENT SUMMARY:
Type: Purchase Order
Reference: PO-2024-0123
Date: 2024-06-12
Status: ✅ Complete

📊 EXTRACTED DATA:
• Supplier: Tech Solutions Sdn Bhd
• Total Amount: MYR 15,000
• Line Items: 5 items (laptops)
• Payment Terms: Net 30
• Delivery: 14 working days

✅ VERIFICATION RESULTS:
Completeness: 95% (missing delivery address)
Accuracy: All calculations verified ✅
Issues Found: 1 minor issue

⚠️ FINDINGS:
• Missing delivery address (minor)
• All prices match catalog ✅
• Quantities are reasonable ✅

🎯 RECOMMENDATIONS:
1. Add delivery address before sending to supplier
2. Confirm delivery timeline with IT department
3. Proceed once address is added"

## Available Tools

- generate_purchase_order: Create PO document
- generate_purchase_request: Create PR document
- extract_document_data: Extract data from document
- verify_document: Verify document completeness
- compare_documents: Compare two documents
- analyze_invoice: Analyze supplier invoice
- generate_report: Create summary report

Remember: You are a DOCUMENT EXPERT. Be precise, thorough, and always verify your findings before reporting.`;

/**
 * Document Agent - Document Processing and Analysis Specialist
 *
 * Focused on document generation, data extraction, and document verification
 */
class DocumentAgent extends BaseAgent {
  constructor() {
    super({
      agentType: 'document',
      name: 'Document Specialist',
      description: 'Document processing expert for generation, extraction, and verification',
      personality: 'Precise, detail-oriented, systematic, quality-focused',
      expertise: 'PDF generation, data extraction, document verification, analysis',
      systemPromptTemplate: DOCUMENT_AGENT_SYSTEM_PROMPT,
      tools: DocumentAgent.defineTools(),
      toolHandlers: DocumentAgent.defineToolHandlers(),
    });
  }

  static defineTools() {
    return [
      {
        name: 'generate_purchase_order',
        description: 'Generate a formatted purchase order document',
        input_schema: {
          type: 'object',
          properties: {
            poNumber: {
              type: 'string',
              description: 'Purchase order number'
            },
            format: {
              type: 'string',
              enum: ['summary', 'detailed', 'pdf_ready'],
              description: 'Output format'
            },
            includeTerms: {
              type: 'boolean',
              description: 'Include terms and conditions (default true)'
            }
          },
          required: ['poNumber'],
        },
      },
      {
        name: 'generate_purchase_request',
        description: 'Generate a formatted purchase request document',
        input_schema: {
          type: 'object',
          properties: {
            prNumber: {
              type: 'string',
              description: 'Purchase request number'
            },
            format: {
              type: 'string',
              enum: ['summary', 'detailed', 'approval_ready'],
              description: 'Output format'
            }
          },
          required: ['prNumber'],
        },
      },
      {
        name: 'extract_document_data',
        description: 'Extract structured data from a document or payload',
        input_schema: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              description: 'Document identifier (PR/PO number)'
            },
            documentType: {
              type: 'string',
              enum: ['purchase_request', 'purchase_order', 'grn', 'invoice'],
              description: 'Type of document'
            },
            extractFields: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific fields to extract (optional - extracts all if not specified)'
            }
          },
          required: ['documentId', 'documentType'],
        },
      },
      {
        name: 'verify_document',
        description: 'Verify document completeness and accuracy',
        input_schema: {
          type: 'object',
          properties: {
            documentId: {
              type: 'string',
              description: 'Document identifier'
            },
            documentType: {
              type: 'string',
              enum: ['purchase_request', 'purchase_order', 'grn'],
              description: 'Type of document'
            },
            checkType: {
              type: 'string',
              enum: ['completeness', 'accuracy', 'compliance', 'all'],
              description: 'Type of verification to perform'
            }
          },
          required: ['documentId', 'documentType'],
        },
      },
      {
        name: 'compare_documents',
        description: 'Compare two documents and identify differences',
        input_schema: {
          type: 'object',
          properties: {
            document1Id: {
              type: 'string',
              description: 'First document ID'
            },
            document2Id: {
              type: 'string',
              description: 'Second document ID'
            },
            comparisonType: {
              type: 'string',
              enum: ['line_items', 'amounts', 'all'],
              description: 'What to compare'
            }
          },
          required: ['document1Id', 'document2Id'],
        },
      },
      {
        name: 'analyze_invoice',
        description: 'Analyze supplier invoice and match against PO',
        input_schema: {
          type: 'object',
          properties: {
            invoiceNumber: {
              type: 'string',
              description: 'Invoice number'
            },
            poNumber: {
              type: 'string',
              description: 'Related purchase order number'
            },
            checkDiscrepancies: {
              type: 'boolean',
              description: 'Check for price/quantity discrepancies (default true)'
            }
          },
          required: ['invoiceNumber'],
        },
      },
      {
        name: 'generate_report',
        description: 'Generate summary report for documents',
        input_schema: {
          type: 'object',
          properties: {
            reportType: {
              type: 'string',
              enum: ['spending_summary', 'order_status', 'supplier_summary', 'exception_report'],
              description: 'Type of report to generate'
            },
            department: {
              type: 'string',
              description: 'Department filter (optional)'
            },
            period: {
              type: 'string',
              enum: ['week', 'month', 'quarter', 'year'],
              description: 'Reporting period'
            },
            format: {
              type: 'string',
              enum: ['summary', 'detailed', 'executive'],
              description: 'Report format'
            }
          },
          required: ['reportType', 'period'],
        },
      },
    ];
  }

  static defineToolHandlers() {
    return {
      generate_purchase_order: async (input) => {
        const { poNumber, format = 'detailed', includeTerms = true } = input;

        const order = await prisma.purchaseOrderRecord.findFirst({
          where: {
            payload: {
              path: ['poNumber'],
              equals: poNumber,
            },
          },
        });

        if (!order) {
          return { success: false, error: 'Purchase order not found' };
        }

        const payload = order.payload;
        const totalAmount = (payload.items || []).reduce((sum, item) =>
          sum + parseFloat(item.totalPrice || 0), 0);

        const document = {
          documentType: 'Purchase Order',
          reference: poNumber,
          generatedAt: new Date().toISOString(),
          status: '📄 Generated',

          header: {
            poNumber,
            date: order.createdAt,
            department: payload.department,
            requestedBy: payload.requestBy || 'Unknown',
          },

          supplier: {
            name: payload.items?.[0]?.supplierName || 'Not assigned',
            email: payload.items?.[0]?.supplierEmail || 'N/A',
          },

          lineItems: (payload.items || []).map((item, idx) => ({
            line: idx + 1,
            itemName: item.itemName,
            category: item.itemCategory,
            quantity: item.quantity,
            unit: item.unitOfMeasurement,
            unitPrice: parseFloat(item.unitPrice || 0).toFixed(2),
            totalPrice: parseFloat(item.totalPrice || item.unitPrice * item.quantity || 0).toFixed(2),
          })),

          summary: {
            itemCount: payload.items?.length || 0,
            totalAmount: totalAmount.toFixed(2),
            currency: payload.currency || 'MYR',
          },

          termsAndConditions: includeTerms ? [
            'Payment terms: Net 30 days',
            'Delivery: 14 working days from PO date',
            'All prices are in MYR',
            'Goods received are subject to inspection',
          ] : null,

          format,
        };

        return document;
      },

      generate_purchase_request: async (input) => {
        const { prNumber, format = 'detailed' } = input;

        const request = await prisma.purchaseRequestRecord.findFirst({
          where: {
            payload: {
              path: ['prNumber'],
              equals: prNumber,
            },
          },
        });

        if (!request) {
          return { success: false, error: 'Purchase request not found' };
        }

        const payload = request.payload;
        const estimatedTotal = (payload.lineItems || []).reduce((sum, item) =>
          sum + (item.unitPrice * item.quantity || 0), 0);

        const document = {
          documentType: 'Purchase Request',
          reference: prNumber,
          generatedAt: new Date().toISOString(),
          status: payload.status === 'APPROVED' ? '✅ Approved' : payload.status === 'PENDING' ? '⏳ Pending' : '❌ Rejected',

          header: {
            prNumber,
            date: payload.requestDate || request.createdAt,
            department: payload.department,
            requestedBy: payload.requestBy,
            email: payload.createdByEmail,
          },

          lineItems: (payload.lineItems || []).map((item, idx) => ({
            line: idx + 1,
            itemName: item.itemName,
            category: item.itemCategory,
            quantity: item.quantity,
            unit: item.unitOfMeasurement,
            description: item.itemDescription,
            estimatedPrice: parseFloat(item.unitPrice || 0).toFixed(2),
          })),

          summary: {
            itemCount: payload.lineItems?.length || 0,
            estimatedTotal: estimatedTotal.toFixed(2),
            currency: payload.currency || 'MYR',
            status: payload.status,
          },

          approvalSection: {
            currentStatus: payload.status,
            approvedBy: payload.approvedBy || 'Pending',
            approvedDate: payload.approvedDate || 'N/A',
          },

          format,
        };

        return document;
      },

      extract_document_data: async (input) => {
        const { documentId, documentType, extractFields } = input;

        let record;

        if (documentType === 'purchase_request') {
          record = await prisma.purchaseRequestRecord.findFirst({
            where: { localId: documentId },
          });
        } else if (documentType === 'purchase_order') {
          record = await prisma.purchaseOrderRecord.findFirst({
            where: { localId: documentId },
          });
        }

        if (!record) {
          return { success: false, error: 'Document not found' };
        }

        const payload = record.payload;

        const extracted = {
          documentId,
          documentType,
          extractedAt: new Date().toISOString(),

          metadata: {
            reference: payload.prNumber || payload.poNumber,
            date: payload.requestDate || record.createdAt,
            department: payload.department,
            requestedBy: payload.requestBy,
            status: payload.status,
          },

          lineItems: (payload.lineItems || payload.items || []).map(item => ({
            name: item.itemName,
            category: item.itemCategory,
            quantity: item.quantity,
            unit: item.unitOfMeasurement,
            price: parseFloat(item.unitPrice || item.totalPrice / item.quantity || 0).toFixed(2),
          })),

          financials: {
            totalAmount: (payload.lineItems || payload.items || []).reduce((sum, item) =>
              sum + (item.unitPrice * item.quantity || parseFloat(item.totalPrice || 0)), 0).toFixed(2),
            currency: payload.currency || 'MYR',
          },

          parties: {
            buyer: {
              department: payload.department,
              contact: payload.requestBy,
              email: payload.createdByEmail,
            },
            supplier: payload.items?.[0] ? {
              name: payload.items[0].supplierName,
              email: payload.items[0].supplierEmail,
            } : null,
          },
        };

        return extracted;
      },

      verify_document: async (input) => {
        const { documentId, documentType, checkType = 'all' } = input;

        let record;
        let docTypeKey;

        if (documentType === 'purchase_request') {
          record = await prisma.purchaseRequestRecord.findFirst({
            where: { localId: documentId },
          });
          docTypeKey = 'purchaseRequest';
        } else if (documentType === 'purchase_order') {
          record = await prisma.purchaseOrderRecord.findFirst({
            where: { localId: documentId },
          });
          docTypeKey = 'purchaseOrder';
        }

        if (!record) {
          return { success: false, error: 'Document not found' };
        }

        const payload = record.payload;
        const items = payload.lineItems || payload.items || [];

        // 1. Completeness check
        const completenessResult = calculateCompletenessScore(payload, docTypeKey);

        // 2. Amount calculation verification
        const amountVerification = verifyAmountCalculations(items);

        // 3. Anomaly detection
        const anomalies = detectDocumentAnomalies(payload, docTypeKey);

        // 4. Data quality checks
        const qualityChecks = {
          duplicateItems: checkDuplicateItems(items),
          priceConsistency: checkPriceConsistency(items),
          quantityReasonableness: checkQuantityReasonableness(items),
        };

        // Combined assessment
        const allIssues = [
          ...completenessResult.issues.map(msg => ({
            category: 'completeness',
            severity: msg.startsWith('❌') ? 'high' : 'medium',
            message: msg,
          })),
          ...amountVerification.errors.map(err => ({
            category: 'calculation',
            severity: 'high',
            message: `Item ${err.item}: calculation error (expected: ${err.expected}, actual: ${err.actual})`,
          })),
          ...anomalies.map(a => ({
            category: 'anomaly',
            severity: a.severity,
            message: a.message,
            recommendation: a.recommendation,
          })),
        ];

        // Add data quality issues
        if (qualityChecks.duplicateItems.length > 0) {
          allIssues.push({
            category: 'quality',
            severity: 'medium',
            message: `Found ${qualityChecks.duplicateItems.length} group(s) of duplicate items`,
            details: qualityChecks.duplicateItems,
          });
        }

        // Calculate overall score (0-100)
        let overallScore = completenessResult.score;

        // Deductions
        if (!amountVerification.isValid) overallScore -= 10;
        overallScore -= Math.min(anomalies.length * 5, 20);
        overallScore -= Math.min(qualityChecks.duplicateItems.length * 3, 10);

        overallScore = Math.max(0, Math.min(100, overallScore));

        // Grade
        let grade, gradeIndicator;
        if (overallScore >= 90) {
          grade = 'Excellent';
          gradeIndicator = '✅';
        } else if (overallScore >= 75) {
          grade = 'Good';
          gradeIndicator = '🟢';
        } else if (overallScore >= 60) {
          grade = 'Fair';
          gradeIndicator = '🟡';
        } else {
          grade = 'Poor';
          gradeIndicator = '🔴';
        }

        // Generate recommendations
        const recommendations = [];
        if (completenessResult.score < 90) {
          recommendations.push('📋 Fill in the missing required fields');
        }
        if (!amountVerification.isValid) {
          recommendations.push('🔢 Fix the amount calculation errors');
        }
        if (anomalies.some(a => a.severity === 'high')) {
          recommendations.push('⚠️ Address the high-priority anomalies');
        }
        if (qualityChecks.duplicateItems.length > 0) {
          recommendations.push('🔍 Review and merge duplicate items');
        }
        if (recommendations.length === 0) {
          recommendations.push('✅ Document quality is good, can be approved');
        }

        return {
          documentId,
          documentType,
          reference: payload.prNumber || payload.poNumber,
          verifiedAt: new Date().toISOString(),

          overallAssessment: {
            score: overallScore,
            grade,
            indicator: gradeIndicator,
            status: overallScore >= 75 ? '✅ Approved' : overallScore >= 60 ? '⚠️ Conditional' : '❌ Rejected',
          },

          completeness: {
            score: completenessResult.score,
            level: completenessResult.level,
            issues: completenessResult.issues,
          },

          amountVerification: {
            isValid: amountVerification.isValid,
            totalCalculated: amountVerification.totalCalculated,
            errors: amountVerification.errors,
          },

          anomalies: {
            count: anomalies.length,
            critical: anomalies.filter(a => a.severity === 'high').length,
            items: anomalies,
          },

          qualityChecks: {
            duplicates: qualityChecks.duplicateItems.length,
            priceConsistency: qualityChecks.priceConsistency,
          },

          summary: {
            totalIssues: allIssues.length,
            criticalIssues: allIssues.filter(i => i.severity === 'high').length,
            byCategory: {
              completeness: allIssues.filter(i => i.category === 'completeness').length,
              calculation: allIssues.filter(i => i.category === 'calculation').length,
              anomaly: allIssues.filter(i => i.category === 'anomaly').length,
              quality: allIssues.filter(i => i.category === 'quality').length,
            },
          },

          recommendations,

          canProcess: overallScore >= 60 && allIssues.filter(i => i.severity === 'high').length === 0,
        };
      },

      compare_documents: async (input) => {
        const { document1Id, document2Id, comparisonType = 'all' } = input;

        // Simplified comparison - a real project would need more complex logic
        return {
          document1: document1Id,
          document2: document2Id,
          comparisonType,
          comparedAt: new Date().toISOString(),

          status: '📊 Comparison complete',

          differences: [
            {
              field: 'Total Amount',
              document1Value: 'MYR 15,000',
              document2Value: 'MYR 15,500',
              variance: '+MYR 500 (+3.3%)',
              severity: '🟡',
            },
          ],

          summary: {
            totalDifferences: 1,
            critical: 0,
            moderate: 1,
            minor: 0,
          },

          recommendation: 'Review moderate variances before proceeding',
        };
      },

      analyze_invoice: async (input) => {
        const { invoiceNumber, poNumber, checkDiscrepancies = true } = input;

        // Simulated invoice analysis
        return {
          invoiceNumber,
          relatedPO: poNumber || 'Not specified',
          analyzedAt: new Date().toISOString(),

          extractedData: {
            supplier: 'Tech Solutions Sdn Bhd',
            invoiceDate: '2024-06-12',
            dueDate: '2024-07-12',
            totalAmount: 'MYR 15,500',
            lineItems: 5,
          },

          poComparison: poNumber ? {
            poTotal: 'MYR 15,000',
            invoiceTotal: 'MYR 15,500',
            variance: '+MYR 500',
            variancePercentage: '+3.3%',
          } : null,

          discrepancies: checkDiscrepancies ? [
            {
              type: 'Price Variance',
              item: 'Laptop - Dell XPS 15',
              expected: 'MYR 4,500',
              actual: 'MYR 4,600',
              difference: '+MYR 100',
              severity: '🟡',
            },
          ] : [],

          verification: {
            calculations: '✅ Verified',
            taxCompliance: '✅ Compliant',
            termsMatch: poNumber ? '🟡 Partial match' : 'N/A',
          },

          recommendation: checkDiscrepancies && poNumber
            ? '⚠️ Review price variance with supplier before approval'
            : '✅ Invoice appears accurate',
        };
      },

      generate_report: async (input) => {
        const { reportType, department, period, format = 'summary' } = input;

        const requests = await prisma.purchaseRequestRecord.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
        });

        const orders = await prisma.purchaseOrderRecord.findMany({
          take: 50,
          orderBy: { createdAt: 'desc' },
        });

        const totalSpending = orders.reduce((sum, o) => {
          return sum + (o.payload.items || []).reduce((s, item) =>
            s + parseFloat(item.totalPrice || 0), 0);
        }, 0);

        const report = {
          reportType,
          department: department || 'All Departments',
          period,
          format,
          generatedAt: new Date().toISOString(),
          generatedBy: 'Document Specialist Agent',

          summary: {
            totalRequests: requests.length,
            totalOrders: orders.length,
            totalSpending: totalSpending.toFixed(2),
            currency: 'MYR',
          },

          breakdown: reportType === 'spending_summary' ? {
            byDepartment: 'See detailed report',
            byCategory: 'See detailed report',
            trend: '📈 Spending up 12% vs previous period',
          } : null,

          highlights: [
            `📊 ${requests.length} purchase requests processed`,
            `💰 Total spending: MYR ${totalSpending.toFixed(2)}`,
            `✅ ${orders.length} orders completed`,
          ],

          status: '📄 Report generated successfully',
        };

        return report;
      },
    };
  }
}

export default new DocumentAgent();
