import React from 'react';
import { Card, Button, Image, Tooltip, Tag } from 'antd';
import {
  DownloadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileTextOutlined,
  FileOutlined,
  EyeOutlined
} from '@ant-design/icons';
import './MessageAttachment.css';

interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  mimeType?: string;
  thumbnailUrl?: string;
  aiAnalysis?: string;
}

interface MessageAttachmentProps {
  attachments: MessageAttachment[];
  messageRole: 'user' | 'assistant';
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
const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FilePdfOutlined style={{ fontSize: 24, color: '#f5222d' }} />;
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileExcelOutlined style={{ fontSize: 24, color: '#52c41a' }} />;
    case 'docx':
    case 'doc':
      return <FileWordOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
    case 'txt':
      return <FileTextOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />;
    default:
      return <FileOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />;
  }
};

// Helper function to check if file is an image
const isImageType = (attachment: MessageAttachment): boolean => {
  const fileType = attachment.fileType?.toLowerCase() || '';
  const mimeType = attachment.mimeType?.toLowerCase() || '';
  const fileName = attachment.fileName?.toLowerCase() || '';
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

  return (
    fileType === 'image' ||
    mimeType.startsWith('image/') ||
    imageTypes.includes(fileType) ||
    imageTypes.some((extension) => fileName.endsWith(`.${extension}`))
  );
};

const normalizeFileUrl = (fileUrl?: string): string => {
  if (!fileUrl) return '';
  if (/^(https?:|data:|blob:)/i.test(fileUrl)) return fileUrl;
  return fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
};

// Helper function to handle download
const handleDownload = (fileUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ attachments, messageRole }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className={`message-attachment-container ${messageRole}`}>
      {attachments.map((attachment) => {
        const isImage = isImageType(attachment);
        const fileUrl = normalizeFileUrl(attachment.fileUrl);
        const thumbnailUrl = normalizeFileUrl(attachment.thumbnailUrl || attachment.fileUrl);

        return (
          <div key={attachment.id} className="message-attachment-item">
            {isImage ? (
              // Image attachment with lightbox
              <div className="attachment-image-wrapper">
                <Image
                  src={thumbnailUrl}
                  alt={attachment.fileName}
                  className="attachment-image"
                  preview={{
                    src: fileUrl,
                    mask: (
                      <div className="image-preview-mask">
                        <EyeOutlined />
                        <span>View</span>
                      </div>
                    )
                  }}
                />
                {attachment.aiAnalysis && (
                  <div className="attachment-ai-analysis">
                    <Tag color="blue" icon={<EyeOutlined />}>
                      AI Analysis
                    </Tag>
                    <Tooltip title={attachment.aiAnalysis} placement="top">
                      <span className="ai-analysis-preview">
                        {attachment.aiAnalysis.length > 50
                          ? `${attachment.aiAnalysis.substring(0, 50)}...`
                          : attachment.aiAnalysis
                        }
                      </span>
                    </Tooltip>
                  </div>
                )}
              </div>
            ) : (
              // File attachment with download button
              <Card
                className="attachment-file-card"
                bodyStyle={{ padding: '12px' }}
              >
                <div className="attachment-file-content">
                  <div className="attachment-file-icon">
                    {getFileIcon(attachment.fileType)}
                  </div>
                  <div className="attachment-file-info">
                    <Tooltip title={attachment.fileName}>
                      <div className="attachment-file-name">
                        {attachment.fileName.length > 30
                          ? `${attachment.fileName.substring(0, 27)}...`
                          : attachment.fileName
                        }
                      </div>
                    </Tooltip>
                    <div className="attachment-file-meta">
                      <span className="file-type">{attachment.fileType.toUpperCase()}</span>
                      <span className="file-size">{formatFileSize(attachment.fileSize)}</span>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    size="small"
                    className="attachment-download-btn"
                    onClick={() => handleDownload(fileUrl, attachment.fileName)}
                  >
                    Download
                  </Button>
                </div>
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageAttachment;
