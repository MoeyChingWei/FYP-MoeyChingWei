import React from 'react';
import MessageAttachment from './MessageAttachment';

/**
 * Example usage of MessageAttachment component
 *
 * This file demonstrates how to use the MessageAttachment component
 * in different scenarios within the chatbot interface.
 */

// Example 1: Single image attachment
const Example1_SingleImage = () => {
  const imageAttachment = {
    id: 'att-001',
    fileName: 'screenshot.png',
    fileUrl: '/uploads/messages/session-123/screenshot.png',
    fileType: 'png',
    fileSize: 245678,
    mimeType: 'image/png',
    thumbnailUrl: '/uploads/messages/session-123/thumb_screenshot.png',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Example 1: Single Image Attachment</h3>
      <MessageAttachment attachments={[imageAttachment]} messageRole="user" />
    </div>
  );
};

// Example 2: Image with AI analysis
const Example2_ImageWithAI = () => {
  const imageWithAI = {
    id: 'att-002',
    fileName: 'data-chart.jpg',
    fileUrl: '/uploads/messages/session-123/data-chart.jpg',
    fileType: 'jpg',
    fileSize: 512000,
    mimeType: 'image/jpeg',
    thumbnailUrl: '/uploads/messages/session-123/thumb_data-chart.jpg',
    aiAnalysis: 'This chart shows a line graph with increasing trend from January to December. The Y-axis represents sales figures ranging from 0 to 100K.',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Example 2: Image with AI Analysis</h3>
      <MessageAttachment attachments={[imageWithAI]} messageRole="assistant" />
    </div>
  );
};

// Example 3: PDF document attachment
const Example3_PDFDocument = () => {
  const pdfAttachment = {
    id: 'att-003',
    fileName: 'quarterly-report.pdf',
    fileUrl: '/uploads/messages/session-123/quarterly-report.pdf',
    fileType: 'pdf',
    fileSize: 2048000,
    mimeType: 'application/pdf',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Example 3: PDF Document</h3>
      <MessageAttachment attachments={[pdfAttachment]} messageRole="user" />
    </div>
  );
};

// Example 4: Excel spreadsheet
const Example4_ExcelSpreadsheet = () => {
  const excelAttachment = {
    id: 'att-004',
    fileName: 'sales-data-2024.xlsx',
    fileUrl: '/uploads/messages/session-123/sales-data-2024.xlsx',
    fileType: 'xlsx',
    fileSize: 768000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Example 4: Excel Spreadsheet</h3>
      <MessageAttachment attachments={[excelAttachment]} messageRole="assistant" />
    </div>
  );
};

// Example 5: Multiple attachments
const Example5_MultipleAttachments = () => {
  const multipleAttachments = [
    {
      id: 'att-005',
      fileName: 'invoice.pdf',
      fileUrl: '/uploads/messages/session-123/invoice.pdf',
      fileType: 'pdf',
      fileSize: 128000,
      mimeType: 'application/pdf',
    },
    {
      id: 'att-006',
      fileName: 'product-image.jpg',
      fileUrl: '/uploads/messages/session-123/product-image.jpg',
      fileType: 'jpg',
      fileSize: 345000,
      mimeType: 'image/jpeg',
      thumbnailUrl: '/uploads/messages/session-123/thumb_product-image.jpg',
    },
    {
      id: 'att-007',
      fileName: 'specifications.docx',
      fileUrl: '/uploads/messages/session-123/specifications.docx',
      fileType: 'docx',
      fileSize: 256000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Example 5: Multiple Attachments</h3>
      <MessageAttachment attachments={multipleAttachments} messageRole="user" />
    </div>
  );
};

// Example 6: Integration with message bubble
const Example6_InMessageBubble = () => {
  const message = {
    role: 'assistant' as const,
    content: 'I analyzed the uploaded image. Here are my findings:',
    attachments: [
      {
        id: 'att-008',
        fileName: 'analysis-chart.png',
        fileUrl: '/uploads/messages/session-123/analysis-chart.png',
        fileType: 'png',
        fileSize: 412000,
        mimeType: 'image/png',
        thumbnailUrl: '/uploads/messages/session-123/thumb_analysis-chart.png',
        aiAnalysis: 'The chart displays three main data points with a clear upward trend. Peak values occur in Q3.',
      },
    ],
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Example 6: In Message Bubble Context</h3>
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '8px'
      }}>
        <p style={{ margin: '0 0 8px 0' }}>{message.content}</p>
        <MessageAttachment
          attachments={message.attachments}
          messageRole={message.role}
        />
      </div>
    </div>
  );
};

// Complete demo component
const MessageAttachmentExamples = () => {
  return (
    <div style={{ padding: '40px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <h1>MessageAttachment Component Examples</h1>
      <p>These examples demonstrate various use cases of the MessageAttachment component.</p>

      <Example1_SingleImage />
      <hr style={{ margin: '40px 0' }} />

      <Example2_ImageWithAI />
      <hr style={{ margin: '40px 0' }} />

      <Example3_PDFDocument />
      <hr style={{ margin: '40px 0' }} />

      <Example4_ExcelSpreadsheet />
      <hr style={{ margin: '40px 0' }} />

      <Example5_MultipleAttachments />
      <hr style={{ margin: '40px 0' }} />

      <Example6_InMessageBubble />
    </div>
  );
};

export default MessageAttachmentExamples;
