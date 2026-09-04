import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import AttachmentPreview from '../AttachmentPreview';

// Mock Ant Design Image component to avoid canvas issues in tests
vi.mock('antd', async () => ({
  ...(await vi.importActual<typeof import('antd')>('antd')),
  Image: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />
}));

describe('AttachmentPreview', () => {
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnRemove.mockClear();
  });

  test('should render nothing when files array is empty', () => {
    const { container } = render(<AttachmentPreview files={[]} onRemove={mockOnRemove} />);
    expect(container.firstChild).toBeNull();
  });

  test('should render preview cards for files', () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const files = [mockFile];

    render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  test('should display file size in human-readable format', () => {
    const content = 'a'.repeat(1024 * 1024); // 1MB
    const mockFile = new File([content], 'large.pdf', { type: 'application/pdf' });
    const files = [mockFile];

    render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    expect(screen.getByText(/MB/)).toBeInTheDocument();
  });

  test('should truncate long file names', () => {
    const longFileName = 'this_is_a_very_long_file_name_that_should_be_truncated.pdf';
    const mockFile = new File(['test'], longFileName, { type: 'application/pdf' });
    const files = [mockFile];

    render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    const truncatedName = screen.getByText(/\.\.\./);
    expect(truncatedName).toBeInTheDocument();
  });

  test('should call onRemove when remove button is clicked', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const files = [mockFile];

    render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  test('should render remove button for each file', () => {
    const files = [
      new File(['test1'], 'file1.pdf', { type: 'application/pdf' }),
      new File(['test2'], 'file2.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    ];

    render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    const removeButtons = screen.getAllByRole('button');
    expect(removeButtons).toHaveLength(2);
  });

  test('should show warning when 5 files are selected', () => {
    const files = Array(5).fill(null).map((_, i) =>
      new File(['test'], `file${i}.pdf`, { type: 'application/pdf' })
    );

    render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    expect(screen.getByText('Maximum 5 files reached')).toBeInTheDocument();
  });

  test('should not show warning when less than 5 files', () => {
    const files = Array(3).fill(null).map((_, i) =>
      new File(['test'], `file${i}.pdf`, { type: 'application/pdf' })
    );

    render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    expect(screen.queryByText('Maximum 5 files reached')).not.toBeInTheDocument();
  });

  test('should display correct icon for PDF files', () => {
    const mockFile = new File(['test'], 'document.pdf', { type: 'application/pdf' });
    const files = [mockFile];

    const { container } = render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    // Check for PDF icon (FilePdfOutlined renders as svg with specific class)
    const icons = container.querySelectorAll('.anticon-file-pdf');
    expect(icons.length).toBeGreaterThan(0);
  });

  test('should display correct icon for Excel files', () => {
    const mockFile = new File(['test'], 'spreadsheet.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const files = [mockFile];

    const { container } = render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    const icons = container.querySelectorAll('.anticon-file-excel');
    expect(icons.length).toBeGreaterThan(0);
  });

  test('should display correct icon for Word files', () => {
    const mockFile = new File(['test'], 'document.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const files = [mockFile];

    const { container } = render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    const icons = container.querySelectorAll('.anticon-file-word');
    expect(icons.length).toBeGreaterThan(0);
  });

  test('should display correct icon for text files', () => {
    const mockFile = new File(['test'], 'notes.txt', { type: 'text/plain' });
    const files = [mockFile];

    const { container } = render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    const icons = container.querySelectorAll('.anticon-file-text');
    expect(icons.length).toBeGreaterThan(0);
  });

  test('should render image preview for image files', () => {
    const mockImageFile = new File(['fake-image-data'], 'photo.jpg', { type: 'image/jpeg' });
    const files = [mockImageFile];

    render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    // File name should still be rendered
    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
  });

  test('should handle multiple files of different types', () => {
    const files = [
      new File(['test'], 'document.pdf', { type: 'application/pdf' }),
      new File(['test'], 'photo.jpg', { type: 'image/jpeg' }),
      new File(['test'], 'spreadsheet.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    ];

    render(<AttachmentPreview files={files} onRemove={mockOnRemove} />);

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
    expect(screen.getByText('spreadsheet.xlsx')).toBeInTheDocument();
  });

  test('should format file sizes correctly', () => {
    const testCases = [
      { size: 500, expected: 'B' },
      { size: 1024, expected: 'KB' },
      { size: 1024 * 1024, expected: 'MB' },
    ];

    testCases.forEach(({ size, expected }) => {
      const content = 'a'.repeat(size);
      const file = new File([content], 'test.txt', { type: 'text/plain' });

      const { container } = render(<AttachmentPreview files={[file]} onRemove={mockOnRemove} />);
      const sizeText = container.querySelector('.attachment-file-size');

      expect(sizeText?.textContent).toContain(expected);
    });
  });
});
