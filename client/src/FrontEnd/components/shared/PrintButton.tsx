import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PrinterOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import type { PrintButtonProps } from './types/export';
import styles from './PrintButton.module.css';

/**
 * PrintButton component - handles printing data by generating PDF and opening print dialog
 * Automatically triggers browser print dialog after PDF is loaded
 */
export default function PrintButton({
  dataType,
  data,
  onPrintStart,
  onPrintEnd,
  onPrintError,
  className,
  disabled = false,
  tooltip,
  pageTitle,
  includeTimestamp = true,
}: PrintButtonProps): React.ReactElement {
  const { t } = useTranslation('common');
  const [isPrinting, setIsPrinting] = useState(false);

  /**
   * Handle print action
   * Generates PDF, opens in new window, and triggers print dialog
   */
  const handlePrint = async () => {
    if (isPrinting) return;

    setIsPrinting(true);

    try {
      // Trigger onPrintStart callback
      onPrintStart?.();

      // Get user information from localStorage
      const authToken = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const userDepartment = localStorage.getItem('userDepartment');
      const userId = localStorage.getItem('userId');

      if (!authToken || !userRole || !userId) {
        throw new Error('Authentication required');
      }

      // Make API request to export endpoint with PDF format
      const response = await axios.post(
        `/api/export/${dataType}`,
        {
          format: 'pdf',
          filters: {},
          userId,
          userRole,
          userDepartment,
          pageTitle: pageTitle || dataType,
          includeTimestamp,
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

      // Create blob URL for PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Open PDF in new window
      const printWindow = window.open(url, '_blank');

      if (!printWindow) {
        throw new Error('Failed to open print window. Please allow popups for this site.');
      }

      // Wait for PDF to load, then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Clean up blob URL after a delay to ensure print dialog has opened
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        }, 500);
      };

      // Show success message
      message.success(t('buttons.print') + ' ' + t('messages.success'));

      // Trigger onPrintEnd callback
      onPrintEnd?.();
    } catch (error) {
      console.error('Print error:', error);

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
      } else if (error instanceof Error && error.message.includes('popup')) {
        errorMessage = 'Please allow popups to print';
      }

      message.error(errorMessage);

      // Trigger onPrintError callback
      onPrintError?.(error as Error);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Button
      className={`${styles.printButton} ${className || ''}`}
      icon={isPrinting ? <LoadingOutlined /> : <PrinterOutlined />}
      onClick={handlePrint}
      disabled={disabled || isPrinting}
      title={tooltip || t('buttons.printDocument')}
      aria-label={tooltip || t('buttons.printDocument')}
    >
      {t('buttons.print')}
    </Button>
  );
}
