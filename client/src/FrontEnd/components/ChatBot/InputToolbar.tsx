import React, { useRef } from 'react';
import { Button, Tooltip, message } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './InputToolbar.css';

interface InputToolbarProps {
  onFileSelect: (files: File[]) => void;
  onImageSelect: (images: File[]) => void;
  disabled?: boolean;
}

const InputToolbar: React.FC<InputToolbarProps> = ({
  onFileSelect,
  onImageSelect,
  disabled
}) => {
  const { t: tMsg } = useTranslation('messages');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File input handler (now handles both files and images)
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file count (max 5 files)
    if (files.length > 5) {
      message.warning('Maximum 5 files can be selected at once');
      return;
    }

    // Convert FileList to Array
    const fileArray = Array.from(files);

    // Validate file types (now includes images)
    const allowedExtensions = ['.pdf', '.xlsx', '.xls', '.docx', '.doc', '.txt', '.csv', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const invalidFiles = fileArray.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !allowedExtensions.includes(extension);
    });

    if (invalidFiles.length > 0) {
      message.error(`Invalid file type. Allowed: PDF, Excel, Word, TXT, CSV, JPG, PNG, GIF, WebP`);
      return;
    }

    // Call the callback with selected files
    onFileSelect(fileArray);
    message.success(`${fileArray.length} file(s) selected`);

    // Reset input to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="input-toolbar">
      {/* File attachment button */}
      <Tooltip title="Attach files (PDF, Excel, Word, TXT, CSV) or images (JPG, PNG, GIF)">
        <Button
          icon={<PaperClipOutlined />}
          onClick={handleFileClick}
          disabled={disabled}
          className="toolbar-button"
          size="small"
          type="text"
        />
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.xlsx,.xls,.docx,.doc,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default InputToolbar;
