import React, { useState, useEffect } from 'react';
import { Card, Button, Image, Tooltip } from 'antd';
import {
  CloseOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileTextOutlined,
  FileOutlined
} from '@ant-design/icons';
import './AttachmentPreview.css';

interface AttachmentPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Helper function to get file type icon
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return <FilePdfOutlined style={{ fontSize: 32, color: '#f5222d' }} />;
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileExcelOutlined style={{ fontSize: 32, color: '#52c41a' }} />;
    case 'docx':
    case 'doc':
      return <FileWordOutlined style={{ fontSize: 32, color: '#1890ff' }} />;
    case 'txt':
      return <FileTextOutlined style={{ fontSize: 32, color: '#8c8c8c' }} />;
    default:
      return <FileOutlined style={{ fontSize: 32, color: '#8c8c8c' }} />;
  }
};

// Helper function to check if file is an image
const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ files, onRemove }) => {
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});

  // Generate image previews for image files
  useEffect(() => {
    const previews: { [key: number]: string } = {};

    files.forEach((file, index) => {
      if (isImageFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            previews[index] = e.target.result as string;
            setImagePreviews(prev => ({ ...prev, [index]: e.target?.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(imagePreviews).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [files]);

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="attachment-preview-container">
      <div className="attachment-preview-list">
        {files.map((file, index) => (
          <Card
            key={`${file.name}-${index}`}
            className="attachment-preview-card"
            styles={{ body: { padding: 8 } }}
          >
            <Button
              icon={<CloseOutlined />}
              className="attachment-remove-btn"
              size="small"
              type="text"
              onClick={() => onRemove(index)}
              danger
            />

            <div className="attachment-preview-content">
              {/* Image preview or file icon */}
              <div className="attachment-preview-icon">
                {isImageFile(file) && imagePreviews[index] ? (
                  <Image
                    src={imagePreviews[index]}
                    alt={file.name}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    preview={{
                      mask: 'Preview'
                    }}
                  />
                ) : (
                  <div className="attachment-file-icon">
                    {getFileIcon(file.name)}
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="attachment-preview-info">
                <Tooltip title={file.name}>
                  <div className="attachment-file-name">
                    {file.name.length > 20
                      ? `${file.name.substring(0, 17)}...`
                      : file.name
                    }
                  </div>
                </Tooltip>
                <div className="attachment-file-size">
                  {formatFileSize(file.size)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {files.length >= 5 && (
        <div className="attachment-limit-warning">
          Maximum 5 files reached
        </div>
      )}
    </div>
  );
};

export default AttachmentPreview;
