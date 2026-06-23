/**
 * Export component type definitions
 * Defines types for data export and print functionality across the application
 */

/**
 * Supported data types that can be exported or printed
 */
export type DataType = 'purchase-requests' | 'purchase-orders' | 'invoices' | 'suppliers';

/**
 * Supported export file formats
 */
export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

/**
 * Props for the ExportButton component
 * Handles exporting data in multiple formats
 */
export interface ExportButtonProps {
  /** The type of data being exported */
  dataType: DataType;
  /** The data to be exported */
  data: Record<string, unknown>[];
  /** Callback function triggered when export begins */
  onExportStart?: () => void;
  /** Callback function triggered when export completes successfully */
  onExportSuccess?: (format: ExportFormat) => void;
  /** Callback function triggered when export fails */
  onExportError?: (error: Error) => void;
  /** Optional CSS class name for custom styling */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional tooltip text displayed on hover */
  tooltip?: string;
  /** Optional filename prefix for exported files */
  filenamePrefix?: string;
}

/**
 * Props for the PrintButton component
 * Handles printing data in various formats
 */
export interface PrintButtonProps {
  /** The type of data being printed */
  dataType: DataType;
  /** The data to be printed */
  data: Record<string, unknown>[];
  /** Callback function triggered when print dialog opens */
  onPrintStart?: () => void;
  /** Callback function triggered when print is completed or cancelled */
  onPrintEnd?: () => void;
  /** Callback function triggered if print fails */
  onPrintError?: (error: Error) => void;
  /** Optional CSS class name for custom styling */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional tooltip text displayed on hover */
  tooltip?: string;
  /** Optional page title for print documents */
  pageTitle?: string;
  /** Whether to include timestamps in printed output */
  includeTimestamp?: boolean;
}
