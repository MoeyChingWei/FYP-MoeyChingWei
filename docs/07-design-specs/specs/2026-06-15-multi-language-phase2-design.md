# Multi-Language i18n Phase 2 Design: Main Feature Modules Translation

**Date:** 2026-06-15  
**Phase:** Phase 2 - Main Feature Modules  
**Status:** Approved  
**Dependencies:** Phase 1 (i18n infrastructure) completed

---

## Executive Summary

Phase 2 extends multi-language support to the three main business modules: Purchasing, Supplier Fulfillment, and User Access. This phase will translate **29 pages** across these modules using an automated extraction and batch implementation approach.

**Scope:**
- **Purchasing Module**: 14 pages (PR creation, approval workflow, PO management, delivery, GRN)
- **Supplier Fulfillment Module**: 8 pages (order acknowledgment, delivery management, GRN status)
- **User Access Module**: 7 pages (user management, RBAC, user list/creation)

**Languages:** English, Simplified Chinese (简体中文), Bahasa Malaysia

**Estimated Effort:** 4-5 hours (automated approach)

---

## Architecture Design

### Translation File Structure

```
client/src/i18n/locales/
├── en/
│   ├── common.json          (existing - Phase 1)
│   ├── navigation.json      (existing - Phase 1)
│   ├── dashboard.json       (existing - Phase 1)
│   ├── settings.json        (existing - Phase 1)
│   ├── purchasing.json      (NEW - Phase 2)
│   ├── supplier.json        (NEW - Phase 2)
│   └── userAccess.json      (NEW - Phase 2)
├── zh/ (same structure)
└── ms/ (same structure)
```

### Namespace Strategy

Each module uses an independent namespace:
- **Purchasing pages**: `useTranslation('purchasing')`
- **Supplier pages**: `useTranslation('supplier')`
- **User Access pages**: `useTranslation('userAccess')`
- **Cross-module shared text**: Continue using `common.json` (buttons, status labels, etc.)

---

## Translation Key Structure

### Hierarchical Organization

**4-Level Structure:**
1. **Level 1**: Module main title
2. **Level 2**: Functional areas (creation/approval/order/delivery/grn)
3. **Level 3**: Specific elements (form/validation/status/actions/table)
4. **Level 4**: Field names

### Example: Purchasing Module

```json
{
  "title": "Purchasing Management",
  "creation": {
    "title": "Create Purchase Request",
    "subtitle": "Submit a new purchase requisition",
    "form": {
      "itemName": "Item Name",
      "itemNamePlaceholder": "Enter item name",
      "quantity": "Quantity",
      "quantityPlaceholder": "Enter quantity",
      "unitPrice": "Unit Price",
      "totalAmount": "Total Amount",
      "justification": "Justification",
      "urgency": "Urgency Level"
    },
    "validation": {
      "itemNameRequired": "Item name is required",
      "quantityMustBePositive": "Quantity must be greater than 0",
      "unitPriceRequired": "Unit price is required"
    },
    "urgencyLevels": {
      "low": "Low",
      "medium": "Medium",
      "high": "High",
      "urgent": "Urgent"
    }
  },
  "approval": {
    "title": "Approval Management",
    "subtitle": "Review and approve purchase requests",
    "status": {
      "pending": "Pending",
      "approved": "Approved",
      "rejected": "Rejected",
      "cancelled": "Cancelled"
    },
    "actions": {
      "approve": "Approve",
      "reject": "Reject",
      "viewDetails": "View Details",
      "downloadPdf": "Download PDF"
    },
    "table": {
      "requestId": "Request ID",
      "requester": "Requester",
      "department": "Department",
      "amount": "Amount",
      "submittedDate": "Submitted Date",
      "status": "Status",
      "actions": "Actions"
    }
  },
  "order": {
    "title": "Purchase Orders",
    "list": "Order List",
    "create": "Create Order",
    "review": "Review Order",
    "details": "Order Details"
  },
  "delivery": {
    "title": "Delivery Management",
    "trackDelivery": "Track Delivery",
    "confirmDelivery": "Confirm Delivery"
  },
  "grn": {
    "title": "Goods Received Note",
    "create": "Create GRN",
    "view": "View GRN",
    "verify": "Verify Items"
  }
}
```

---

## Text Extraction Strategy

### Text Types to Extract

1. **JSX Text Nodes**
   ```tsx
   // Before
   <h1>Purchase Request</h1>
   
   // After
   <h1>{t('creation.title')}</h1>
   ```

2. **Attribute Strings**
   ```tsx
   // Before
   <Input placeholder="Enter item name" />
   
   // After
   <Input placeholder={t('creation.form.itemNamePlaceholder')} />
   ```

3. **Button/Link Text**
   ```tsx
   // Before
   <Button>Submit</Button>
   
   // After
   <Button>{t('common.buttons.submit')}</Button>
   ```

4. **Table Column Headers**
   ```tsx
   // Before
   { title: 'Item Name', dataIndex: 'itemName' }
   
   // After
   { title: t('creation.table.itemName'), dataIndex: 'itemName' }
   ```

5. **Form Labels**
   ```tsx
   // Before
   <Form.Item label="Quantity">
   
   // After
   <Form.Item label={t('creation.form.quantity')}>
   ```

6. **Validation Messages**
   ```tsx
   // Before
   rules: [{ required: true, message: 'Item name is required' }]
   
   // After
   rules: [{ required: true, message: t('creation.validation.itemNameRequired') }]
   ```

7. **Status/Enum Text**
   ```tsx
   // Before
   status === "PENDING" ? "Pending" : "Approved"
   
   // After
   t(`approval.status.${status.toLowerCase()}`)
   ```

### Content NOT to Extract

- Code comments
- console.log statements
- API endpoint paths
- CSS class names
- Mock/test data
- Variable names

### Special Cases

**Table Column Definitions:**
```tsx
const columns = useMemo(() => [
  { title: t('approval.table.requestId'), dataIndex: 'id' },
  { title: t('approval.table.requester'), dataIndex: 'requester' },
  // ...
], [t]);
```

**Enum Mapping Objects:**
```tsx
const statusMap = {
  PENDING: t('approval.status.pending'),
  APPROVED: t('approval.status.approved'),
  REJECTED: t('approval.status.rejected'),
};
```

**Variable Interpolation:**
```tsx
// Translation: "Welcome, {{name}}!"
t('welcome', { name: userName })
```

---

## Implementation Flow

### Step 1: Text Scanning & Extraction (Automated)

**Process:**
1. Use Agent to read all 29 page files
2. Identify all hardcoded text strings
3. Classify by module (purchasing/supplier/userAccess)
4. Organize by functional area (creation/approval/order/etc.)
5. Generate translation key structure with English source text

**Output:** Structured list of all text to be translated

---

### Step 2: Create Translation Files (Batch Generation)

**Process:**
1. Create 3 new JSON files per language (9 files total):
   - `purchasing.json` (en/zh/ms)
   - `supplier.json` (en/zh/ms)
   - `userAccess.json` (en/zh/ms)

2. **English**: Use extracted original text
3. **Chinese**: Generate based on Phase 1 translation style
4. **Malay**: Generate based on Phase 1 translation style

**Translation Guidelines:**
- **Terminology consistency**: Use same terms as Phase 1 (e.g., "批准" for Approve)
- **Business context**: Use ERP domain standard translations
- **Length awareness**: Avoid translations that would break UI layout

---

### Step 3: Code Replacement (Batch Operation)

**Process for each page:**
1. Add import: `import { useTranslation } from 'react-i18next';`
2. Add hook: `const { t } = useTranslation('moduleName');`
3. Replace hardcoded text with `t()` calls
4. Handle special cases (tables, forms, validation)

**Update i18n configuration:**
```typescript
// client/src/i18n/index.ts
import purchasingEn from './locales/en/purchasing.json';
import purchasingZh from './locales/zh/purchasing.json';
import purchasingMs from './locales/ms/purchasing.json';
// ... (supplier, userAccess)

const resources = {
  en: {
    // ... existing
    purchasing: purchasingEn,
    supplier: supplierEn,
    userAccess: userAccessEn,
  },
  // ... (zh, ms)
};
```

---

### Step 4: Validation & Correction

**Checks:**
1. **Build validation**: Run `npm run build` to ensure no syntax errors
2. **Key completeness**: Verify all translation keys have corresponding translations
3. **Missing translations**: Check for any untranslated text
4. **Type checking**: Ensure TypeScript types are correct

**Corrections:**
- Fix any missed translations
- Correct misaligned translation keys
- Adjust translations that break UI layout

---

### Step 5: Functional Testing

**Test Coverage:**
1. **Language switching**: All 29 pages display correctly in 3 languages
2. **Form functionality**: Validation messages show translated text
3. **Workflow testing**: Complete flows (PR → Approval → PO → Delivery)
4. **Edge cases**: Empty data, loading states, error states

**Test Scenarios:**
- Create purchase request in Chinese
- Approve/reject in Malay
- View order details in English
- Switch languages mid-workflow

---

## Module Breakdown

### Purchasing Module (14 pages)

**Files:**
1. `PurchasingManagement.tsx` - Main dashboard
2. `CreationSubmodule.tsx` - Create PR
3. `ReviewSubmodule.tsx` - Review PR list
4. `ReviewDetailSubmodule.tsx` - Review PR details
5. `ApprovalSubmodule.tsx` - Approval list
6. `ApprovalDetailSubmodule.tsx` - Approval details
7. `PurchaseOrderCreation.tsx` - Create PO
8. `PurchaseOrderReview.tsx` - Review PO list
9. `PurchaseOrderReviewDetail.tsx` - Review PO details
10. `PurchaseOrderApproval.tsx` - Approve PO list
11. `PurchaseOrderApprovalDetail.tsx` - Approve PO details
12. `DeliverySubmodule.tsx` - Delivery management
13. `GoodsReceivedNoteSubmodule.tsx` - GRN list
14. `GoodsReceivedNoteDetailSubmodule.tsx` - GRN details

**Key Features:**
- Purchase requisition creation with item selection
- Multi-level approval workflow
- Purchase order management
- Delivery tracking
- Goods received note verification

---

### Supplier Fulfillment Module (8 pages)

**Files:**
1. `SupplierFulfillmentHome.tsx` - Main dashboard
2. `OrderAcknowledgementSubmodule.tsx` - Order ack list
3. `OrderAcknowledgementDetailSubmodule.tsx` - Order ack details
4. `DeliverySubmodule.tsx` - Delivery list
5. `DeliveryDetailSubmodule.tsx` - Delivery details
6. `CreateDeliveryFromGrnSubmodule.tsx` - Create delivery from GRN
7. `GoodsReceivedNoteStatusSubmodule.tsx` - GRN status list
8. `GoodsReceivedNoteDetailSubmodule.tsx` - GRN details

**Key Features:**
- Order acknowledgment by suppliers
- Delivery management and tracking
- GRN status monitoring
- Integration with purchasing workflow

---

### User Access Module (7 pages)

**Files:**
1. `UserAccessLayout.tsx` - Layout wrapper
2. `UserManagementSubmodule.tsx` - User management home
3. `UserList.tsx` - User list with filters
4. `CreateUser.tsx` - Create/edit user form
5. `SupplierTypeSubmodule.tsx` - Supplier type management
6. `RbacSubmodule.tsx` - RBAC home
7. `Roles.tsx` - Role management

**Key Features:**
- User CRUD operations
- Role-based access control
- Permission management
- Supplier type configuration

---

## Quality Assurance

### Translation Quality Control

**Terminology Consistency:**
- Purchase Request → 采购申请 (not 购买申请)
- Approve → 批准 (not 审批 or 同意)
- Goods Received Note → 收货单 (not 货物接收单)

**Length Checks:**
- Button text: max 10 characters (Chinese), 15 characters (Malay)
- Form labels: max 20 characters
- Table headers: max 15 characters
- Adjust layout if necessary (wider columns, truncation)

**Context Accuracy:**
- Use ERP domain standard terms
- Maintain professional tone
- Consistent capitalization rules per language

### Testing Checklist

**Functional Tests:**
- [ ] All 29 pages load without errors
- [ ] Language switching works on every page
- [ ] Forms submit successfully in all languages
- [ ] Validation messages display correctly
- [ ] Table columns show translated headers
- [ ] Status labels translate properly
- [ ] Buttons and actions are clickable and work

**Visual Tests:**
- [ ] No layout breaks due to long translations
- [ ] Text wrapping is appropriate
- [ ] Icons and text alignment correct
- [ ] No text overflow in buttons/labels

**Workflow Tests:**
- [ ] Complete PR → Approval → PO workflow in Chinese
- [ ] Order acknowledgment → Delivery in Malay
- [ ] User creation and role assignment in English

---

## Rollback Strategy

**If issues arise:**
1. Keep Phase 1 translations intact (no changes to existing files)
2. Only Phase 2 files (purchasing/supplier/userAccess) would rollback
3. i18n fallback to English if translation key missing (built-in behavior)
4. Can deploy incrementally: enable purchasing first, then supplier, then userAccess

**Rollback triggers:**
- Critical UI breaks
- Major translation errors affecting business operations
- Performance degradation

---

## Expected Deliverables

**Phase 2 Complete Criteria:**
- ✅ 29 pages fully translated (English/Chinese/Malay)
- ✅ 9 new translation JSON files created (3 modules × 3 languages)
- ✅ All hardcoded text replaced with `t()` calls
- ✅ Build succeeds with no errors
- ✅ Language switching smooth and UI displays correctly
- ✅ All forms, tables, and workflows functional
- ✅ Documentation updated (add Phase 2 to i18n-usage-guide.md)

**Acceptance Criteria:**
- User can switch language on any page and see immediate update
- All business workflows work in all 3 languages
- No English text remains in translated modules
- Performance is not degraded
- No regressions in existing Phase 1 translated pages

---

## Risk Mitigation

**Potential Risks:**

1. **Large file size**: Purchasing.json may be large (14 pages)
   - Mitigation: If >50KB, consider splitting further
   
2. **Dynamic content**: Some text may be loaded from backend
   - Mitigation: Document which content needs backend translation
   
3. **Layout breaks**: Long translations may break UI
   - Mitigation: Test layouts, adjust CSS if needed
   
4. **Missed text**: Automated extraction may miss edge cases
   - Mitigation: Manual review of each page after implementation

---

## Timeline Estimate

**Total: 4-5 hours**

- Text scanning & extraction: ~30 minutes
- Translation file generation: ~45 minutes
- Code replacement implementation: ~2 hours
- Validation & correction: ~30 minutes
- Functional testing: ~30 minutes
- Documentation update: ~15 minutes

---

## Next Steps

After Phase 2 completion:
- **Phase 3**: Translate ChatBot, Tracking Item, Profile pages
- **Phase 4**: Error messages and system notifications
- **Phase 5**: Dynamic content translation (DeepSeek API integration)

---

**Document Status:** Ready for implementation  
**Approved by:** User  
**Implementation Plan:** To be created via writing-plans skill
