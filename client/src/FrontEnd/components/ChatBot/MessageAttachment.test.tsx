import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageAttachment from './MessageAttachment';

// Mock Ant Design Image component
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Image: ({ src, alt, preview }: any) => (
    <div data-testid="image-preview">
      <img src={src} alt={alt} />
      {preview && <div data-testid="preview-mask">{preview.mask}</div>}
    </div>
  ),
}));

describe('MessageAttachment Component', () => {
  const mockImageAttachment = {
    id: '1',
    fileName: 'test-image.jpg',
    fileUrl: '/uploads/test-image.jpg',
    fileType: 'jpg',
    fileSize: 1024000,
    mimeType: 'image/jpeg',
    thumbnailUrl: '/uploads/thumb-test-image.jpg',
  };

  const mockImageWithAI = {
    ...mockImageAttachment,
    aiAnalysis: 'This image contains a landscape with mountains and trees.',
  };

  const mockPdfAttachment = {
    id: '2',
    fileName: 'document.pdf',
    fileUrl: '/uploads/document.pdf',
    fileType: 'pdf',
    fileSize: 2048000,
    mimeType: 'application/pdf',
  };

  const mockExcelAttachment = {
    id: '3',
    fileName: 'spreadsheet.xlsx',
    fileUrl: '/uploads/spreadsheet.xlsx',
    fileType: 'xlsx',
    fileSize: 512000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when attachments array is empty', () => {
    const { container } = render(
      <MessageAttachment attachments={[]} messageRole="user" />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders image attachment with thumbnail', () => {
    render(<MessageAttachment attachments={[mockImageAttachment]} messageRole="user" />);

    const image = screen.getByAltText('test-image.jpg');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/uploads/thumb-test-image.jpg');
  });

  test('renders image attachment with AI analysis', () => {
    render(<MessageAttachment attachments={[mockImageWithAI]} messageRole="assistant" />);

    expect(screen.getByText('AI Analysis')).toBeInTheDocument();
    expect(screen.getByText(/This image contains a landscape/)).toBeInTheDocument();
  });

  test('truncates long AI analysis text', () => {
    const longAnalysis = 'A'.repeat(100);
    const attachmentWithLongAI = {
      ...mockImageAttachment,
      aiAnalysis: longAnalysis,
    };

    render(<MessageAttachment attachments={[attachmentWithLongAI]} messageRole="user" />);

    const analysisText = screen.getByText(/A{50}\.\.\./, { exact: false });
    expect(analysisText).toBeInTheDocument();
  });

  test('renders PDF file attachment with icon and download button', () => {
    render(<MessageAttachment attachments={[mockPdfAttachment]} messageRole="user" />);

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
    expect(screen.getByText('2 MB')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  test('renders Excel file attachment with correct icon', () => {
    render(<MessageAttachment attachments={[mockExcelAttachment]} messageRole="assistant" />);

    expect(screen.getByText('spreadsheet.xlsx')).toBeInTheDocument();
    expect(screen.getByText('XLSX')).toBeInTheDocument();
    expect(screen.getByText('500 KB')).toBeInTheDocument();
  });

  test('truncates long file names', () => {
    const longFileName = 'very-long-file-name-that-exceeds-thirty-characters.pdf';
    const attachmentWithLongName = {
      ...mockPdfAttachment,
      fileName: longFileName,
    };

    render(<MessageAttachment attachments={[attachmentWithLongName]} messageRole="user" />);

    expect(screen.getByText(/very-long-file-name-that-exc\.\.\./)).toBeInTheDocument();
  });

  test('handles download button click', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);

    render(<MessageAttachment attachments={[mockPdfAttachment]} messageRole="user" />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  test('renders multiple attachments', () => {
    const multipleAttachments = [mockImageAttachment, mockPdfAttachment, mockExcelAttachment];

    render(<MessageAttachment attachments={multipleAttachments} messageRole="assistant" />);

    expect(screen.getByAltText('test-image.jpg')).toBeInTheDocument();
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('spreadsheet.xlsx')).toBeInTheDocument();
  });

  test('applies correct CSS class based on message role', () => {
    const { container: userContainer } = render(
      <MessageAttachment attachments={[mockImageAttachment]} messageRole="user" />
    );
    expect(userContainer.querySelector('.message-attachment-container.user')).toBeInTheDocument();

    const { container: assistantContainer } = render(
      <MessageAttachment attachments={[mockImageAttachment]} messageRole="assistant" />
    );
    expect(assistantContainer.querySelector('.message-attachment-container.assistant')).toBeInTheDocument();
  });

  test('formats file sizes correctly', () => {
    const attachmentSizes = [
      { ...mockPdfAttachment, fileSize: 0 },
      { ...mockPdfAttachment, fileSize: 500, fileName: 'small.pdf' },
      { ...mockPdfAttachment, fileSize: 1024, fileName: 'kilobyte.pdf' },
      { ...mockPdfAttachment, fileSize: 1048576, fileName: 'megabyte.pdf' },
    ];

    const { rerender } = render(
      <MessageAttachment attachments={[attachmentSizes[0]]} messageRole="user" />
    );
    expect(screen.getByText('0 B')).toBeInTheDocument();

    rerender(<MessageAttachment attachments={[attachmentSizes[1]]} messageRole="user" />);
    expect(screen.getByText('500 B')).toBeInTheDocument();

    rerender(<MessageAttachment attachments={[attachmentSizes[2]]} messageRole="user" />);
    expect(screen.getByText('1 KB')).toBeInTheDocument();

    rerender(<MessageAttachment attachments={[attachmentSizes[3]]} messageRole="user" />);
    expect(screen.getByText('1 MB')).toBeInTheDocument();
  });

  test('identifies different image types correctly', () => {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    imageTypes.forEach((type) => {
      const attachment = {
        ...mockImageAttachment,
        fileName: `image.${type}`,
        fileType: type,
      };

      const { container } = render(
        <MessageAttachment attachments={[attachment]} messageRole="user" />
      );

      expect(container.querySelector('.attachment-image-wrapper')).toBeInTheDocument();
    });
  });

  test('renders file attachments for non-image types', () => {
    const fileTypes = ['pdf', 'xlsx', 'docx', 'txt', 'csv'];

    fileTypes.forEach((type) => {
      const attachment = {
        id: type,
        fileName: `file.${type}`,
        fileUrl: `/uploads/file.${type}`,
        fileType: type,
        fileSize: 1024,
      };

      const { container } = render(
        <MessageAttachment attachments={[attachment]} messageRole="user" />
      );

      expect(container.querySelector('.attachment-file-card')).toBeInTheDocument();
    });
  });
});
