# Task 4: Create Base Layout and Document Templates

## Goal
Create the base HTML layout and purchase request document template.

## Files to Create
- `backend/templates/layouts/base.hbs` - Base HTML structure
- `backend/templates/documents/purchase-request.hbs` - Purchase request template

## Requirements

### base.hbs
- HTML5 doctype
- Inject CSS via {{{commonCSS}}}, {{{tablesCSS}}}, {{{printCSS}}}
- Title from {{documentTitle}}
- Include {{> header}} partial
- Content placeholder {{{body}}}
- Include {{> footer}} partial

### purchase-request.hbs
- Document metadata section (.document-meta): type, number, status
- Requester info section (.requester-info): name, department
- Data table (.data-table): columns for No, Item Name, Category, Qty, Unit, Description
- Use {{#each lineItems}} to iterate
- Include {{> signature-block}} partial

## Success Criteria
- Both .hbs files created
- base.hbs uses triple braces {{{ }}} for CSS injection and body
- purchase-request.hbs uses proper Handlebars iteration
- CSS classes match styles from Task 2
- Committed with conventional format
