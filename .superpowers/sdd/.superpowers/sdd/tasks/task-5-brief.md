# Task 5: Build Template Renderer Service

## Goal
Implement the core template rendering service using Handlebars.

## Files to Create
- `backend/services/template-renderer.js` - Template renderer class
- `backend/test/template-renderer.test.js` - Unit tests

## Requirements

### TemplateRenderer Class
- Constructor: initialize cache, register partials/helpers
- `registerPartials()`: Load all .hbs files from templates/partials/, register with Handlebars
- `registerHelpers()`: Register 'inc' helper for row numbering (value => parseInt(value) + 1)
- `loadCSS()`: Read common.css, tables.css, print.css, return object
- `render(templateName, data)`: 
  - Load template from templates/documents/
  - Compile with Handlebars
  - Inject CSS into data
  - Return HTML string

### Export
- Export `renderTemplate(templateName, data)` function for easy use

### Tests
- Test rendering purchase-request template with sample data
- Verify output contains document number, status
- Run with vitest

## Success Criteria
- Test written and fails initially
- TemplateRenderer class implemented with all methods
- Test passes after implementation
- CSS properly injected into output
- Partials registered and available
- Committed with conventional format
