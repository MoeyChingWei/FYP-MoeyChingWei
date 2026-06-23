# Frontend Export & Print Components Design

**Date:** 2026-06-23  
**Version:** 1.0  
**Status:** Approved  
**Author:** Claude (with User)

---

## Executive Summary

Design and implement reusable React/TypeScript components for exporting and printing data in the OptiMind ERP system. Components will integrate with the existing backend export API and be used across all module list pages.

**Key Goals:**
- Create ExportButton component with format selection dropdown
- Create PrintButton component for direct printing
- Integrate into Purchase Request, Purchase Order, Invoice, and Supplier list pages
- Support all 4 export formats (PDF, Excel, CSV, JSON)
- Maintain consistency with existing Ant Design UI patterns

**Implementation Strategy:** Simple, direct approach (YAGNI) - build core functionality first, iterate based on user feedback.

---

## Design Decisions

### Chosen Approach: Simple & Direct (Method A)

**Rationale:**
1. Backend API already supports filters - frontend can pass current page filters
2. Follows YAGNI principle - no premature optimization
3. Quick to implement and deploy
4. Matches existing component patterns in the codebase
5. Easy to extend later based on user feedback

**Alternative Approaches Considered:**
- **Method B (Advanced):** Export preview modal with configuration options - rejected as over-engineered for v1
- **Method C (Progressive):** Phased rollout - not needed, Method A is already minimal

---

## Component Architecture

### File Structure

```
client/src/FrontEnd/components/shared/
├── ExportButton.tsx           # Export dropdown component
├── ExportButton.module.css    # Export button styles
├── PrintButton.tsx            # Print button component
├── PrintButton.module.css     # Print button styles
└── types/
    └── export.ts              # Shared TypeScript types
```

### Technology Stack

- **UI Framework:** Ant Design 6.3.1 (Dropdown, Button, Menu, message)
- **Language:** TypeScript
- **HTTP Client:** axios (already in use)
- **Icons:** @ant-design/icons (DownloadOutlined, PrinterOutlined, etc.)
- **i18n:** react-i18next (for internationalization)

---

## ExportButton Component

### Interface

```typescript
interface ExportButtonProps {
  dataType: 'purchase-requests' | 'purchase-orders' | 'invoices' | 'suppliers';
  filters?: Record<string, any>;
  disabled?: boolean;
  onSuccess?: (format: string, fileName: string) => void;
  onError?: (error: Error) => void;
}
```

### Features

1. **Format Selection Dropdown**
   - PDF 📄 - Professional document with company header
   - Excel 📊 - Spreadsheet for data analysis
   - CSV 📋 - Simple data export
   - JSON 💾 - Raw data for developers

2. **API Integration**
   - Endpoint: `POST /api/export/:dataType`
   - Payload: `{ userId, userRole, format, filters }`
   - Response: Binary file stream

3. **User Feedback**
   - Loading state during export generation
   - Success message: "Export completed successfully!"
   - Error message: "Export failed: [reason]"
   - Ant Design `message` component for notifications

4. **File Download**
   - Create blob from response
   - Generate filename: `{dataType}-{timestamp}.{extension}`
   - Trigger browser download via `<a>` element

### UI Design

```
┌─────────────────────┐
│ Export ▼            │  ← Dropdown button
└─────────────────────┘
        │
        ▼ (on click)
┌─────────────────────────────────────────────┐
│ 📄 Export as PDF                            │
│ 📊 Export as Excel (.xlsx)                  │
│ 📋 Export as CSV                            │
│ 💾 Export as JSON                           │
└─────────────────────────────────────────────┘
```

**Loading State:**
```
┌─────────────────────┐
│ [spinner] Export ▼  │  ← Disabled during loading
└─────────────────────┘
```

---

## PrintButton Component

### Interface

```typescript
interface PrintButtonProps {
  dataType: 'purchase-requests' | 'purchase-orders' | 'invoices' | 'suppliers';
  filters?: Record<string, any>;
  disabled?: boolean;
  onError?: (error: Error) => void;
}
```

### Features

1. **PDF Generation**
   - Calls same API: `POST /api/export/:dataType`
   - Always uses `format: 'pdf'`
   - Optimized for printing (uses print.css from backend)

2. **Print Dialog**
   - Opens PDF in new window/tab
   - Automatically triggers browser print dialog
   - Uses `window.print()` after PDF loads

3. **User Feedback**
   - Loading state during PDF generation
   - Error message if generation fails
   - No success message (print dialog is the feedback)

### UI Design

```
┌─────────────────────┐
│ 🖨️ Print            │  ← Simple button
└─────────────────────┘
```

**Loading State:**
```
┌─────────────────────┐
│ [spinner] Print     │  ← Disabled during loading
└─────────────────────┘
```

---

## Integration Points

### Target Pages

1. **Purchase Request List** (`/purchase-requests`)
2. **Purchase Order List** (`/purchase-orders`)
3. **Invoice List** (`/invoices`)
4. **Supplier List** (`/suppliers`)

### Placement

**Location:** Top-right corner of list page, next to search/filter controls

**Example Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ Purchase Requests              [Export ▼] [Print]          │
├────────────────────────────────────────────────────────────┤
│ Search: [_______] Status: [All ▼] Dept: [All ▼]           │
├────────────────────────────────────────────────────────────┤
│ [Data Table]                                               │
└────────────────────────────────────────────────────────────┘
```

### Usage Example

```tsx
import ExportButton from '@/components/shared/ExportButton';
import PrintButton from '@/components/shared/PrintButton';

function PurchaseOrderReview() {
  const sessionUser = getSessionUser();
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  return (
    <Card>
      <Flex justify="space-between" align="center">
        <Title level={3}>Purchase Orders</Title>
        
        <Flex gap={8}>
          <ExportButton
            dataType="purchase-orders"
            filters={{
              status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
              department: sessionUser?.department,
            }}
            onSuccess={(format, fileName) => {
              console.log(`Exported as ${format}: ${fileName}`);
            }}
          />
          
          <PrintButton
            dataType="purchase-orders"
            filters={{
              status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
            }}
          />
        </Flex>
      </Flex>
      
      {/* Rest of the page */}
    </Card>
  );
}
```

---

## Data Flow

### Export Flow

```
User clicks "Export as PDF"
    ↓
ExportButton component
    ↓
POST /api/export/purchase-requests
{
  userId: 1,
  userRole: "User",
  format: "pdf",
  filters: { status: "PENDING", department: "IT" }
}
    ↓
Backend processes
    ↓
Response: PDF binary stream
    ↓
Create blob → Generate filename → Trigger download
    ↓
User receives file: purchase-requests-1719100800000.pdf
```

### Print Flow

```
User clicks "Print"
    ↓
PrintButton component
    ↓
POST /api/export/purchase-requests
{ format: "pdf", filters: {...} }
    ↓
Backend processes
    ↓
Response: PDF binary stream
    ↓
Create blob URL → Open in new window → window.print()
    ↓
Browser print dialog opens
```

---

## Error Handling

### Common Error Scenarios

1. **Network Error**
   - Message: "Network error. Please check your connection."
   - Action: Retry button in error message

2. **Permission Denied (403)**
   - Message: "You don't have permission to export this data."
   - Action: Contact admin message

3. **No Data Found (404)**
   - Message: "No data available to export."
   - Action: Adjust filters suggestion

4. **Server Error (500)**
   - Message: "Export failed. Please try again later."
   - Action: Log error, show generic message

5. **Timeout**
   - Message: "Export is taking longer than expected. Please try again."
   - Action: Suggest smaller date range

### Error Handling Implementation

```typescript
try {
  const response = await axios.post(`/api/export/${dataType}`, payload, {
    responseType: 'blob',
    timeout: 60000, // 60 seconds
  });
  
  // Handle success
  triggerDownload(response.data, fileName);
  message.success(t('export.success'));
  
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      message.error(t('export.error.timeout'));
    } else if (error.response?.status === 403) {
      message.error(t('export.error.permission'));
    } else if (error.response?.status === 404) {
      message.error(t('export.error.noData'));
    } else {
      message.error(t('export.error.generic'));
    }
  }
  
  onError?.(error);
}
```

---

## Internationalization (i18n)

### Required Translation Keys

**English (`en/common.json`):**
```json
{
  "export": {
    "button": "Export",
    "print": "Print",
    "formats": {
      "pdf": "Export as PDF",
      "excel": "Export as Excel (.xlsx)",
      "csv": "Export as CSV",
      "json": "Export as JSON"
    },
    "success": "Export completed successfully!",
    "error": {
      "generic": "Export failed. Please try again.",
      "timeout": "Export is taking longer than expected. Please try again.",
      "permission": "You don't have permission to export this data.",
      "noData": "No data available to export.",
      "network": "Network error. Please check your connection."
    }
  }
}
```

**Chinese (`zh/common.json`):**
```json
{
  "export": {
    "button": "导出",
    "print": "打印",
    "formats": {
      "pdf": "导出为 PDF",
      "excel": "导出为 Excel (.xlsx)",
      "csv": "导出为 CSV",
      "json": "导出为 JSON"
    },
    "success": "导出成功！",
    "error": {
      "generic": "导出失败，请重试。",
      "timeout": "导出时间过长，请重试。",
      "permission": "您没有权限导出此数据。",
      "noData": "没有可导出的数据。",
      "network": "网络错误，请检查您的连接。"
    }
  }
}
```

**Malay (`ms/common.json`):**
```json
{
  "export": {
    "button": "Eksport",
    "print": "Cetak",
    "formats": {
      "pdf": "Eksport sebagai PDF",
      "excel": "Eksport sebagai Excel (.xlsx)",
      "csv": "Eksport sebagai CSV",
      "json": "Eksport sebagai JSON"
    },
    "success": "Eksport berjaya!",
    "error": {
      "generic": "Eksport gagal. Sila cuba lagi.",
      "timeout": "Eksport mengambil masa terlalu lama. Sila cuba lagi.",
      "permission": "Anda tidak mempunyai kebenaran untuk eksport data ini.",
      "noData": "Tiada data untuk dieksport.",
      "network": "Ralat rangkaian. Sila semak sambungan anda."
    }
  }
}
```

---

## Styling Guidelines

### Design Principles

1. **Consistency:** Match existing Ant Design theme and component styles
2. **Accessibility:** Proper ARIA labels, keyboard navigation support
3. **Responsiveness:** Works on desktop and tablet (mobile optional)
4. **Visual Hierarchy:** Clear button states (normal, hover, active, disabled, loading)

### CSS Modules

**ExportButton.module.css:**
```css
.exportButton {
  /* Match existing button styling */
}

.exportButton:hover {
  /* Subtle hover effect */
}

.dropdown {
  min-width: 240px;
}

.menuItem {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menuItem:hover {
  background-color: var(--ant-color-primary-bg-hover);
}

.icon {
  font-size: 16px;
}
```

**PrintButton.module.css:**
```css
.printButton {
  /* Match existing button styling */
}

.printButton:hover {
  /* Subtle hover effect */
}
```

---

## Testing Strategy

### Unit Tests

**ExportButton Tests:**
1. Renders correctly with all props
2. Shows dropdown menu on click
3. Calls API with correct parameters
4. Triggers download on success
5. Shows error message on failure
6. Disables button during loading
7. Respects disabled prop

**PrintButton Tests:**
1. Renders correctly with all props
2. Calls API with format='pdf'
3. Opens new window with PDF
4. Shows error message on failure
5. Disables button during loading
6. Respects disabled prop

### Integration Tests

1. Export button on Purchase Request page exports correct data
2. Export button respects current page filters
3. Print button opens print dialog
4. Export button works for all data types
5. Permission checks work correctly

### Manual Testing Checklist

- [ ] Export button dropdown opens and closes correctly
- [ ] All 4 formats trigger download
- [ ] Downloaded files have correct format and data
- [ ] Print button opens print dialog
- [ ] Loading states display correctly
- [ ] Error messages display correctly
- [ ] Buttons are disabled when they should be
- [ ] Works with different filter combinations
- [ ] i18n translations display correctly (EN, ZH, MS)
- [ ] Responsive on different screen sizes

---

## Performance Considerations

### Optimization Strategies

1. **Debounce:** Prevent multiple rapid clicks
2. **Request Timeout:** 60 seconds max
3. **File Size Warning:** Show warning for large exports (future enhancement)
4. **Streaming:** Use blob response type for large files
5. **Memory Management:** Revoke blob URLs after use

### Expected Performance

- Small datasets (<100 records): 1-3 seconds
- Medium datasets (100-1000 records): 3-10 seconds
- Large datasets (>1000 records): 10-30 seconds

---

## Security Considerations

1. **Authentication:** User must be logged in (checked by API)
2. **Authorization:** API enforces department-level permissions
3. **Input Validation:** Validate dataType prop, sanitize filters
4. **CSRF Protection:** Use existing axios CSRF token handling
5. **XSS Prevention:** No user input rendered as HTML

---

## Future Enhancements

### Phase 2 Features (Optional)

1. **Batch Export:** Export multiple selected records
2. **Export Preview:** Show data range before exporting
3. **Custom Fields:** Let users choose which columns to export
4. **Export Templates:** Save export configurations
5. **Email Export:** Send export to email instead of download
6. **Export History:** Track and re-download previous exports
7. **Progress Bar:** Show progress for large exports

---

## Success Criteria

### Functional Success

✅ Users can export data in all 4 formats from all list pages  
✅ Exported files contain correct, filtered data  
✅ Print button generates PDF and opens print dialog  
✅ Error messages are clear and helpful  
✅ Loading states provide visual feedback  
✅ Components work in all 3 languages (EN, ZH, MS)

### Non-Functional Success

✅ Components integrate seamlessly with existing UI  
✅ No performance degradation on list pages  
✅ Code follows project TypeScript/React conventions  
✅ All tests pass  
✅ No accessibility regressions

---

**End of Design Document**
