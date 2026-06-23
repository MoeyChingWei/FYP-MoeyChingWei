import React, { useState } from 'react';
import { Dropdown, Button, message } from 'antd';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';
import axios from 'axios';
import type { ExportButtonProps, ExportFormat } from './types/export';
import styles from './ExportButton.module.css';

/**
 * ExportButton component - handles data export in multiple formats
 * Supports PDF, Excel, CSV, and JSON export formats with API integration
 */
export default function ExportButton({
  dataType,
  data,
  onExportStart,
  onExportSuccess,
  onExportError,
  className,
  disabled = false,
  tooltip,
  filenamePrefix,
}: ExportButtonProps): React.ReactElement {
  const { t } = useTranslation('common');
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  /**
   * Handle export for a specific format
   */
  const handleExport = async (format: ExportFormat) => {
    if (isExporting) return;

    setIsExporting(true);
    setExportingFormat(format);

    try {
      // Trigger onExportStart callback
      onExportStart?.();

      // Get user information from localStorage
      const authToken = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userDepartment = localStorage.getItem('userDepartment');
      const userId = localStorage.getItem('userId');

      if (!authToken || !userRole || !userId) {
        throw new Error('Authentication required');
      }

      // Make API request to export endpoint
      const response = await axios.post(
        `/api/export/${dataType}`,
        {
          format,
          filters: {},
          userId,
          userRole,
          userDepartment,
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
          timeout: 60000, // 60 second timeout
        }
      );

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const prefix = filenamePrefix || dataType;
      const extension = getFileExtension(format);
      const filename = `${prefix}-${timestamp}.${extension}`;

      // Trigger file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Show success message
      message.success(t('buttons.export') + ' ' + t('messages.success'));

      // Trigger onExportSuccess callback
      onExportSuccess?.(format);
    } catch (error) {
      console.error('Export error:', error);

      // Handle specific error types
      let errorMessage = t('messages.error');

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          errorMessage = 'Permission denied';
        } else if (error.response?.status === 404) {
          errorMessage = 'No records found';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error occurred';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout';
        }
      }

      message.error(errorMessage);

      // Trigger onExportError callback
      onExportError?.(error as Error);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  /**
   * Get file extension for export format
   */
  const getFileExtension = (format: ExportFormat): string => {
    switch (format) {
      case 'pdf':
        return 'pdf';
      case 'excel':
        return 'xlsx';
      case 'csv':
        return 'csv';
      case 'json':
        return 'json';
      default:
        return 'pdf';
    }
  };

  /**
   * Build dropdown menu items
   */
  const menuItems: MenuProps['items'] = [
    {
      key: 'pdf',
      label: t('buttons.exportPDF'),
      disabled: isExporting,
      icon: exportingFormat === 'pdf' ? <LoadingOutlined /> : null,
    },
    {
      key: 'excel',
      label: t('buttons.exportExcel'),
      disabled: isExporting,
      icon: exportingFormat === 'excel' ? <LoadingOutlined /> : null,
    },
    {
      key: 'csv',
      label: 'Export as CSV',
      disabled: isExporting,
      icon: exportingFormat === 'csv' ? <LoadingOutlined /> : null,
    },
    {
      key: 'json',
      label: 'Export as JSON',
      disabled: isExporting,
      icon: exportingFormat === 'json' ? <LoadingOutlined /> : null,
    },
  ];

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: ({ key }) => handleExport(key as ExportFormat),
      }}
      placement="bottomRight"
      trigger={['click']}
      disabled={disabled || isExporting}
    >
      <Button
        className={`${styles.exportButton} ${className || ''}`}
        icon={isExporting ? <LoadingOutlined /> : <DownloadOutlined />}
        disabled={disabled || isExporting}
        title={tooltip}
        aria-label={tooltip || t('buttons.export')}
      >
        {t('buttons.export')}
      </Button>
    </Dropdown>
  );
}
