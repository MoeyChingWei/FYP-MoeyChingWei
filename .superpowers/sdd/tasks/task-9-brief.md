# Task 9: Create Additional Document Templates

## Goal
Create the remaining 3 Handlebars templates for purchase orders, invoices, and supplier lists.

## Files to Create
- `backend/templates/documents/purchase-order.hbs`
- `backend/templates/documents/invoice.hbs`
- `backend/templates/documents/supplier-list.hbs`

## Requirements

### purchase-order.hbs
- Document metadata: type, PO number, date, status
- Supplier section: name, address (placeholder), contact (placeholder)
- Requester/department info
- Line items table
- Financial summary (subtotal, tax, total)
- Signature block

### invoice.hbs
- Document metadata: type, invoice number, date, due date
- Supplier/billing info
- Line items table
- Financial summary with totals
- Signature block

### supplier-list.hbs
- Title: "Supplier Directory"
- Table with columns: No., Supplier Name, Contact, Address, Status
- Use placeholders "[To be added]" for contact and address
- No signature block (reference document)

## Structure
- Match purchase-request.hbs layout
- Use same CSS classes (.document-meta, .requester-info, .data-table)
- Include {{> signature}} for PO and Invoice
- Use {{#each}} for iteration

## Success Criteria
- All 3 templates created
- Proper Handlebars syntax
- CSS classes match Task 2
- 3 skipped tests now pass (78/78 total)
- Committed with conventional format
