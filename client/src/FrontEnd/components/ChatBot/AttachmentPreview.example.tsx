import React, { useState } from 'react';
import { Button, Space } from 'antd';
import AttachmentPreview from './AttachmentPreview';
import InputToolbar from './InputToolbar';

/**
 * Example usage of AttachmentPreview component
 * This demonstrates how to integrate AttachmentPreview with InputToolbar
 */
const AttachmentPreviewExample: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Handle file selection from InputToolbar
  const handleFileSelect = (files: File[]) => {
    // Check if adding new files would exceed the limit
    const totalFiles = selectedFiles.length + files.length;
    if (totalFiles > 5) {
      console.warn('Cannot add more than 5 files');
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Handle image selection from InputToolbar
  const handleImageSelect = (images: File[]) => {
    // Check if adding new images would exceed the limit
    const totalFiles = selectedFiles.length + images.length;
    if (totalFiles > 5) {
      console.warn('Cannot add more than 5 files');
      return;
    }

    setSelectedFiles(prev => [...prev, ...images]);
  };

  // Handle file removal from preview
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle send message
  const handleSendMessage = () => {
    console.log('Sending message with attachments:', selectedFiles);
    // Here you would typically:
    // 1. Upload files to server
    // 2. Send message with file references
    // 3. Clear the selected files
    setSelectedFiles([]);
  };

  // Handle clear all files
  const handleClearAll = () => {
    setSelectedFiles([]);
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h2>AttachmentPreview Component Example</h2>

      <div style={{ marginBottom: 16 }}>
        <p>Select files or images using the toolbar below:</p>
        <InputToolbar
          onFileSelect={handleFileSelect}
          onImageSelect={handleImageSelect}
          disabled={selectedFiles.length >= 5}
        />
      </div>

      {/* Show attachment preview if files are selected */}
      {selectedFiles.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <AttachmentPreview
            files={selectedFiles}
            onRemove={handleRemoveFile}
          />
        </div>
      )}

      {/* Action buttons */}
      <Space>
        <Button
          type="primary"
          onClick={handleSendMessage}
          disabled={selectedFiles.length === 0}
        >
          Send Message with {selectedFiles.length} file(s)
        </Button>
        <Button
          onClick={handleClearAll}
          disabled={selectedFiles.length === 0}
        >
          Clear All
        </Button>
      </Space>

      {/* File information display */}
      <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <h4>Selected Files ({selectedFiles.length}/5):</h4>
        {selectedFiles.length === 0 ? (
          <p style={{ color: '#999' }}>No files selected</p>
        ) : (
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>
                <strong>{file.name}</strong> - {file.type} - {(file.size / 1024).toFixed(2)} KB
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AttachmentPreviewExample;
