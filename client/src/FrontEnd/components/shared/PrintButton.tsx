import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PrinterOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import type { PrintButtonProps } from './types/export';
import styles from './PrintButton.module.css';

/**
 * PrintButton component - handles printing data by generating PDF and opening print dialog
 * Automatically triggers the browser's native print preview after the PDF is loaded
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
   * Generates a PDF and prints it through a hidden frame, matching workflow
   * document printing without opening an about:blank tab.
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

      const printFrame = document.createElement('iframe');
      printFrame.setAttribute('title', t('documentActions.printPreview'));
      printFrame.style.position = 'fixed';
      printFrame.style.left = '-10000px';
      printFrame.style.top = '-10000px';
      printFrame.style.width = '1px';
      printFrame.style.height = '1px';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);

      await new Promise<void>((resolve, reject) => {
        printFrame.onload = () => resolve();
        printFrame.onerror = () => reject(new Error('Print document failed to load'));
        printFrame.src = url;
      });

      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      window.setTimeout(() => {
        printFrame.remove();
        window.URL.revokeObjectURL(url);
      }, 1000);

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
          errorMessage = t('documentActions.permissionDenied');
        } else if (error.response?.status === 404) {
          errorMessage = t('documentActions.noRecordsFound');
        } else if (error.response?.status === 500) {
          errorMessage = t('documentActions.serverError');
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = t('documentActions.requestTimedOut');
        }
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
