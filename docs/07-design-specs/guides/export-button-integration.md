# Export & Print Button Integration Guide

**Version:** 1.0  
**Last Updated:** 2026-06-23  
**Author:** Claude (with Team)  
**Status:** Published

---

## Overview

This guide documents the reusable `ExportButton` and `PrintButton` components that enable data export and printing functionality across the OptiMind ERP system. These components provide a consistent, user-friendly interface for exporting data in multiple formats (PDF, Excel, CSV, JSON) and printing documents.

### Components Covered

- **ExportButton** - Multi-format data export with dropdown menu
- **PrintButton** - Direct printing with PDF generation
- **Shared Types** - TypeScript interfaces and data types
- **API Integration** - Backend endpoint coordination

### Key Features

✓ Multiple export formats (PDF, Excel, CSV, JSON)  
✓ Simple, intuitive dropdown interface  
✓ Full internationalization support (EN, ZH, MS)  
✓ Comprehensive error handling  
✓ Loading states and user feedback  
✓ Role-based permission checking  
✓ Responsive design with Ant Design  

---

## Data Types

The export system supports the following data types:

```typescript
type DataType = 'purchase-requests' | 'purchase-orders' | 'invoices' | 'suppliers';
```

### Supported Data Types

| Data Type | Description | Use Case |
|-----------|-------------|----------|
| `purchase-requests` | Purchase request records | Export PR lists |
| `purchase-orders` | Purchase order records | Export PO lists |
| `invoices` | Invoice records | Export invoice lists |
| `suppliers` | Supplier records | Export supplier lists |

### Export Formats

```typescript
type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';
```

| Format | Extension | Use Case | Browser Support |
|--------|-----------|----------|-----------------|
| `pdf` | .pdf | Professional printing & sharing | Universal |
| `excel` | .xlsx | Data analysis in spreadsheets | All browsers |
| `csv` | .csv | Data import/migration | All browsers |
| `json` | .json | Developer access & APIs | All browsers |

---

## ExportButton Component

### Basic Usage

```tsx
import ExportButton from '@/components/shared/ExportButton';

function MyComponent() {
  return (
    <ExportButton
      dataType="purchase-orders"
      data={purchaseOrders}
    />
  );
}
```

### Props Interface

```typescript
interface ExportButtonProps {
  /** The type of data being exported */
  dataType: DataType;
  
  /** The data array to be exported */
  data: Record<string, unknown>[];
  
  /** Callback triggered when export begins */
  onExportStart?: () => void;
  
  /** Callback triggered when export succeeds */
  onExportSuccess?: (format: ExportFormat) => void;
  
  /** Callback triggered when export fails */
  onExportError?: (error: Error) => void;
  
  /** Optional CSS class for custom styling */
  className?: string;
  
  /** Disable the button */
  disabled?: boolean;
  
  /** Tooltip text on hover */
  tooltip?: string;
  
  /** Custom filename prefix (default: dataType) */
  filenamePrefix?: string;
}
```

### Complete Example

```tsx
import { useState } from 'react';
import { message } from 'antd';
import ExportButton from '@/components/shared/ExportButton';
import type { ExportFormat } from '@/components/shared/types/export';

export function PurchaseOrderList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleExportStart = () => {
    console.log('Export started...');
    setIsLoading(true);
  };

  const handleExportSuccess = (format: ExportFormat) => {
    console.log(`Successfully exported as ${format}`);
    message.success(`Exported as ${format}`);
    setIsLoading(false);
  };

  const handleExportError = (error: Error) => {
    console.error('Export failed:', error);
    setIsLoading(false);
  };

  return (
    <ExportButton
      dataType="purchase-orders"
      data={orders}
      onExportStart={handleExportStart}
      onExportSuccess={handleExportSuccess}
      onExportError={handleExportError}
      disabled={orders.length === 0}
      tooltip="Export purchase orders in multiple formats"
      filenamePrefix="po-export"
    />
  );
}
```

### UI Appearance

The component renders as a dropdown button with an export icon:

```
Normal State:          Dropdown Menu:
┌──────────────┐      ┌──────────────────────────┐
│ ⬇ Export     │  →   │ 📄 Export as PDF         │
└──────────────┘      │ 📊 Export as Excel       │
                      │ 📋 Export as CSV         │
                      │ 💾 Export as JSON        │
                      └──────────────────────────┘

Loading State:
┌──────────────┐
│ ⟳ Export     │ (disabled, with spinner)
└──────────────┘
```

### Filename Generation

Files are automatically named with the format:

```
{filenamePrefix}-{YYYY-MM-DD}.{extension}
```

**Examples:**
- `purchase-orders-2026-06-23.pdf`
- `po-export-2026-06-23.xlsx`
- `purchase-requests-2026-06-23.csv`

---

## PrintButton Component

### Basic Usage

```tsx
import PrintButton from '@/components/shared/PrintButton';

function MyComponent() {
  return (
    <PrintButton
      dataType="purchase-orders"
      data={purchaseOrders}
    />
  );
}
```

### Props Interface

```typescript
interface PrintButtonProps {
  /** The type of data being printed */
  dataType: DataType;
  
  /** The data array to be printed */
  data: Record<string, unknown>[];
  
  /** Callback triggered when print starts */
  onPrintStart?: () => void;
  
  /** Callback triggered when print ends or is cancelled */
  onPrintEnd?: () => void;
  
  /** Callback triggered if print fails */
  onPrintError?: (error: Error) => void;
  
  /** Optional CSS class for custom styling */
  className?: string;
  
  /** Disable the button */
  disabled?: boolean;
  
  /** Tooltip text on hover */
  tooltip?: string;
  
  /** Custom page title for print documents */
  pageTitle?: string;
  
  /** Include timestamp in printed output (default: true) */
  includeTimestamp?: boolean;
}
```

### Complete Example

```tsx
import { useState } from 'react';
import { message } from 'antd';
import PrintButton from '@/components/shared/PrintButton';

export function PurchaseOrderReview() {
  const [orders, setOrders] = useState([]);

  const handlePrintStart = () => {
    console.log('Generating PDF for printing...');
  };

  const handlePrintEnd = () => {
    console.log('Print dialog closed');
  };

  const handlePrintError = (error: Error) => {
    console.error('Print failed:', error);
  };

  return (
    <PrintButton
      dataType="purchase-orders"
      data={orders}
      onPrintStart={handlePrintStart}
      onPrintEnd={handlePrintEnd}
      onPrintError={handlePrintError}
      disabled={orders.length === 0}
      pageTitle="Purchase Order Report"
      includeTimestamp={true}
      tooltip="Print purchase orders as PDF"
    />
  );
}
```

### UI Appearance

```
Normal State:         Loading State:
┌────────────┐       ┌────────────┐
│ 🖨️ Print   │       │ ⟳ Print    │ (disabled)
└────────────┘       └────────────┘
```

---

## Filter Patterns

Both components support filtering data before export. Filters are passed through the API to the backend.

### Basic Filtering

```tsx
const filters = {
  status: 'APPROVED',
  department: 'IT',
  startDate: '2026-01-01',
  endDate: '2026-06-23',
};

<ExportButton
  dataType="purchase-orders"
  data={filteredOrders}
/>
```

### Common Filter Fields

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `status` | string | `APPROVED` | Filter by status |
| `department` | string | `IT` | Filter by department |
| `createdBy` | number | `123` | Filter by creator user ID |
| `startDate` | string | `2026-01-01` | Filter by date range start |
| `endDate` | string | `2026-06-23` | Filter by date range end |
| `category` | string | `OFFICE` | Filter by category |

### Real-World Example

```tsx
import { useState } from 'react';
import { DatePicker, Select } from 'antd';
import ExportButton from '@/components/shared/ExportButton';
import type { Dayjs } from 'dayjs';

export function PurchaseOrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // Build filters from UI state
  const filters = {
    status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
    startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
    endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
  };

  // Filter data client-side before export
  const filteredOrders = orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.startDate && order.createdDate < filters.startDate) return false;
    if (filters.endDate && order.createdDate > filters.endDate) return false;
    return true;
  });

  return (
    <div>
      <Select
        value={selectedStatus}
        onChange={setSelectedStatus}
        options={[
          { label: 'All', value: 'ALL' },
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Approved', value: 'APPROVED' },
        ]}
      />
      
      <DatePicker.RangePicker onChange={setDateRange} />
      
      <ExportButton
        dataType="purchase-orders"
        data={filteredOrders}
        tooltip="Export filtered results"
      />
    </div>
  );
}
```

---

## Permissions Handling

The export system enforces role-based permissions at the API level. User credentials are automatically extracted from localStorage.

### User Information

The component automatically retrieves and sends:

```typescript
{
  userId: localStorage.getItem('userId'),
  userRole: localStorage.getItem('userRole'),
  userDepartment: localStorage.getItem('userDepartment'),
  authToken: localStorage.getItem('authToken'),
}
```

### Permission Levels

| Role | Can Export | Can Print | Notes |
|------|-----------|-----------|-------|
| Admin | All data | All data | No restrictions |
| Manager | Department data | Department data | Limited to department |
| User | Own data | Own data | Limited to own records |
| Viewer | Read-only | No | View only, cannot export |

### Error Handling for Permissions

The component handles permission errors automatically:

```typescript
// 403 Forbidden - Permission Denied
if (error.response?.status === 403) {
  message.error('You don\'t have permission to export this data.');
}

// 404 Not Found - No Data
if (error.response?.status === 404) {
  message.error('No data available to export.');
}
```

### Checking Permissions Before Export

```tsx
import { getSessionUser } from '@/shared/auth/session';
import ExportButton from '@/components/shared/ExportButton';

export function SecureExportExample() {
  const user = getSessionUser();
  
  // Disable export if user doesn't have permission
  const canExport = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <ExportButton
      dataType="purchase-orders"
      data={orders}
      disabled={!canExport}
      tooltip={canExport ? 'Export data' : 'You don\'t have permission to export'}
    />
  );
}
```

---

## Placement Recommendations

### Optimal Locations

The export/print buttons should be placed in these locations:

#### 1. List Page Top Bar (Recommended)

```
┌─────────────────────────────────────────────────────────┐
│ Title                    [Export ▼] [Print] [Add New]   │ ← Buttons
├─────────────────────────────────────────────────────────┤
│ [Filter Controls]                                        │
├─────────────────────────────────────────────────────────┤
│ [Data Table]                                             │
└─────────────────────────────────────────────────────────┘
```

**Implementation:**

```tsx
<Card>
  <Flex justify="space-between" align="center">
    <Title level={3}>Purchase Orders</Title>
    
    <Flex gap={8}>
      <ExportButton dataType="purchase-orders" data={orders} />
      <PrintButton dataType="purchase-orders" data={orders} />
      <Button type="primary">Add New</Button>
    </Flex>
  </Flex>
  
  {/* Filter controls */}
  {/* Data table */}
</Card>
```

#### 2. Toolbar with Actions

```
┌─────────────────────────────────────────────────────────┐
│ Search: [_____]  Status: [All ▼]  [Export ▼] [Print]   │
└─────────────────────────────────────────────────────────┘
│ [Data Table]                                             │
└─────────────────────────────────────────────────────────┘
```

#### 3. Detail Page Header

```
┌─────────────────────────────────────────────────────────┐
│ Purchase Order #PO-001       [Export ▼] [Print] [Edit]  │
├─────────────────────────────────────────────────────────┤
│ [Detail Content]                                         │
└─────────────────────────────────────────────────────────┘
```

### Spacing Guidelines

- **Gap between buttons:** 8px (`gap={8}`)
- **Gap from content:** 16px minimum
- **Button size:** Use default size for consistency
- **Alignment:** Right-align with other action buttons

### Responsive Considerations

```tsx
import { useMediaQuery } from 'react-responsive';

export function ResponsiveExport() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Flex gap={8} direction={isMobile ? 'column' : 'row'}>
      <ExportButton dataType="purchase-orders" data={orders} />
      <PrintButton dataType="purchase-orders" data={orders} />
    </Flex>
  );
}
```

---

## Error Handling

The components include comprehensive error handling for common scenarios.

### Error Categories

#### 1. Network Errors

```typescript
// Timeout Error
if (error.code === 'ECONNABORTED') {
  message.error('Export is taking longer than expected. Please try again.');
}

// Connection Error
if (!navigator.onLine) {
  message.error('Network error. Please check your connection.');
}
```

#### 2. Permission Errors

```typescript
// 403 Forbidden
if (error.response?.status === 403) {
  message.error('You don\'t have permission to export this data.');
}

// 401 Unauthorized
if (error.response?.status === 401) {
  message.error('Your session has expired. Please log in again.');
}
```

#### 3. Data Errors

```typescript
// 404 Not Found
if (error.response?.status === 404) {
  message.error('No data available to export.');
}

// No data in array
if (!data || data.length === 0) {
  message.warning('No records selected for export.');
}
```

#### 4. Server Errors

```typescript
// 500 Server Error
if (error.response?.status === 500) {
  message.error('Server error occurred. Please try again later.');
}

// Generic error
if (error instanceof Error) {
  console.error('Export error:', error.message);
  message.error('Export failed. Please try again.');
}
```

### Implementing Custom Error Handling

```tsx
import ExportButton from '@/components/shared/ExportButton';
import { message } from 'antd';

export function CustomErrorHandling() {
  const handleExportError = (error: Error) => {
    if (error.message.includes('Permission')) {
      // Handle permission errors specially
      message.error('Contact your administrator for export access.');
    } else if (error.message.includes('timeout')) {
      // Handle timeout
      message.warning('Export took too long. Try with fewer records.');
    } else {
      // Generic handling
      console.error('Export failed:', error);
    }
  };

  return (
    <ExportButton
      dataType="purchase-orders"
      data={orders}
      onExportError={handleExportError}
    />
  );
}
```

### User-Friendly Error Messages

Always show context-specific messages:

```typescript
// Bad: Too generic
message.error('Error');

// Good: Specific and actionable
message.error('No purchase orders found for selected date range. Try adjusting your filters.');

// Good: With recovery action
message.warning('Export timeout. Please try again or reduce the date range.');
```

---

## API Integration

### Export Endpoint

**Endpoint:** `POST /api/export/{dataType}`

**Request Headers:**
```
Authorization: Bearer {authToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "format": "pdf",
  "filters": {
    "status": "APPROVED",
    "department": "IT"
  },
  "userId": "123",
  "userRole": "MANAGER",
  "userDepartment": "IT",
  "pageTitle": "Purchase Orders",
  "includeTimestamp": true
}
```

**Response:**
- Success (200): Binary file stream (blob)
- Forbidden (403): No permission
- Not Found (404): No matching data
- Server Error (500): Internal error

### HTTP Configuration

The components use axios with these settings:

```typescript
{
  responseType: 'blob',        // Get binary data
  timeout: 60000,              // 60 second timeout
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  }
}
```

### Example API Call

```typescript
const response = await axios.post(
  '/api/export/purchase-orders',
  {
    format: 'pdf',
    filters: { status: 'APPROVED' },
    userId: '123',
    userRole: 'MANAGER',
    userDepartment: 'IT',
  },
  {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
    timeout: 60000,
  }
);
```

---

## Integration Checklist

Use this checklist when integrating the export/print buttons into a new page:

### Prerequisites
- [ ] Page has data array with records
- [ ] User authentication is set up
- [ ] API `/api/export/{dataType}` endpoint exists
- [ ] i18n translations are in place

### Component Setup
- [ ] Import ExportButton component
- [ ] Import PrintButton component
- [ ] Define dataType parameter
- [ ] Pass data array prop
- [ ] Add optional callbacks (onExportSuccess, etc.)

### Error Handling
- [ ] Implement onExportError callback
- [ ] Implement onPrintError callback
- [ ] Test permission denial scenarios
- [ ] Test timeout scenarios
- [ ] Test network error scenarios

### User Experience
- [ ] Buttons visible and accessible
- [ ] Disabled state when no data
- [ ] Loading states show spinner
- [ ] Success messages appear
- [ ] Error messages are helpful

### Accessibility
- [ ] aria-label set on buttons
- [ ] Tooltip text provided
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### Testing
- [ ] Export PDF works
- [ ] Export Excel works
- [ ] Export CSV works
- [ ] Export JSON works
- [ ] Print dialog opens
- [ ] Filters applied correctly
- [ ] Permissions enforced

---

## Troubleshooting

### Common Issues

**Issue: Export button doesn't work**
- Solution: Check that user is logged in (authToken in localStorage)
- Solution: Verify API endpoint exists and is reachable
- Solution: Check browser console for detailed error

**Issue: Print dialog doesn't open**
- Solution: Browser may have blocked popup - check popup blocker
- Solution: Check that PDF generation succeeded
- Solution: Try disabling popup blocker for this site

**Issue: Files download with wrong name**
- Solution: Check filenamePrefix prop (uses dataType by default)
- Solution: Verify file extension matches format

**Issue: Permission denied error**
- Solution: Check user role and permissions in backend
- Solution: Verify userRole is set correctly in localStorage
- Solution: Check department matches department permissions

**Issue: Timeout on large exports**
- Solution: Increase timeout in axios config (already 60 seconds)
- Solution: Reduce data size with more specific filters
- Solution: Ask backend team about timeout limits

### Debug Mode

Enable console logging for debugging:

```tsx
const handleExportError = (error: Error) => {
  console.log('Full error object:', error);
  console.log('Error message:', error.message);
  console.log('Error stack:', error.stack);
  
  if (axios.isAxiosError(error)) {
    console.log('Response status:', error.response?.status);
    console.log('Response data:', error.response?.data);
  }
};

<ExportButton
  dataType="purchase-orders"
  data={orders}
  onExportError={handleExportError}
/>
```

---

## Real-World Example: Complete Purchase Order Page

Here's a complete, production-ready example:

```tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Flex, Input, Select, Table, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { getSessionUser } from '@/shared/auth/session';
import { loadPurchaseOrders } from '@/modules/purchasing/api';
import ExportButton from '@/components/shared/ExportButton';
import PrintButton from '@/components/shared/PrintButton';

export function PurchaseOrderListPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const user = getSessionUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Load data on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await loadPurchaseOrders();
        setOrders(data);
      } catch (error) {
        message.error(t('messages.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on user input
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filter by status
      if (selectedStatus !== 'ALL' && order.status !== selectedStatus) {
        return false;
      }

      // Filter by date range
      if (dateRange) {
        const orderDate = dayjs(order.createdDate);
        if (orderDate.isBefore(dateRange[0]) || orderDate.isAfter(dateRange[1])) {
          return false;
        }
      }

      // Filter by search text
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return (
          order.poNumber.toLowerCase().includes(searchLower) ||
          order.createdBy.toLowerCase().includes(searchLower) ||
          order.department.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [orders, selectedStatus, dateRange, searchText]);

  const canCreateOrder = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <Card>
      {/* Header with title and actions */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <h1>{t('purchaseOrder.list.title')}</h1>
        <Flex gap={8}>
          <ExportButton
            dataType="purchase-orders"
            data={filteredOrders}
            disabled={filteredOrders.length === 0}
            tooltip="Export filtered results"
            onExportSuccess={(format) => {
              console.log(`Exported ${filteredOrders.length} orders as ${format}`);
            }}
            onExportError={(error) => {
              console.error('Export failed:', error);
            }}
          />
          
          <PrintButton
            dataType="purchase-orders"
            data={filteredOrders}
            disabled={filteredOrders.length === 0}
            tooltip="Print filtered results"
            pageTitle="Purchase Order Report"
            onPrintError={(error) => {
              console.error('Print failed:', error);
            }}
          />
          
          {canCreateOrder && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/purchasing/po-create')}
            >
              {t('purchaseOrder.list.create')}
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Filter controls */}
      <Flex gap={12} style={{ marginBottom: 16 }} wrap="wrap">
        <Input
          placeholder={t('common.search')}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />

        <Select
          value={selectedStatus}
          onChange={setSelectedStatus}
          style={{ width: 150 }}
          options={[
            { label: 'All Status', value: 'ALL' },
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Submitted', value: 'SUBMITTED' },
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Rejected', value: 'REJECTED' },
          ]}
        />

        <DatePicker.RangePicker
          onChange={(dates) => {
            if (dates) {
              setDateRange([dates[0], dates[1]]);
            } else {
              setDateRange(null);
            }
          }}
        />
      </Flex>

      {/* Data table */}
      <Table
        loading={loading}
        columns={[
          {
            title: t('purchaseOrder.table.poNumber'),
            dataIndex: 'poNumber',
            key: 'poNumber',
          },
          {
            title: t('purchaseOrder.table.status'),
            dataIndex: 'status',
            key: 'status',
          },
          {
            title: t('purchaseOrder.table.department'),
            dataIndex: 'department',
            key: 'department',
          },
          {
            title: t('purchaseOrder.table.createdBy'),
            dataIndex: 'createdBy',
            key: 'createdBy',
          },
          {
            title: t('purchaseOrder.table.date'),
            dataIndex: 'createdDate',
            key: 'createdDate',
          },
          {
            title: t('common.actions'),
            key: 'actions',
            render: (_, record) => (
              <Button
                type="link"
                onClick={() => navigate(`/purchasing/po/${record.id}`)}
              >
                {t('common.view')}
              </Button>
            ),
          },
        ]}
        dataSource={filteredOrders}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
```

---

## Performance Tips

1. **Debounce exports** - Prevent multiple simultaneous exports
2. **Lazy load** - Load components only when needed
3. **Memoize data** - Use useMemo for filtered data arrays
4. **Optimize API** - Ensure backend export endpoint is optimized
5. **Monitor timeouts** - Watch for exports > 30 seconds

---

## Future Enhancements

Potential improvements for future versions:

- [ ] Batch export (multiple selected records)
- [ ] Export preview modal
- [ ] Custom field selection
- [ ] Export templates/configurations
- [ ] Email export delivery
- [ ] Export history/audit log
- [ ] Progress bar for large exports
- [ ] Scheduled/automated exports

---

## Support & Questions

For issues or questions:

1. Check this guide's troubleshooting section
2. Review component source code with inline comments
3. Check the design spec: `docs/07-design-specs/specs/2026-06-23-frontend-export-components-design.md`
4. Contact the development team

---

**End of Integration Guide**
