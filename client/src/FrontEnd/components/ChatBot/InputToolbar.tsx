import React, { useRef } from 'react';
import { Button, Tooltip, message } from 'antd';
import { PaperClipOutlined, PictureOutlined, SmileOutlined } from '@ant-design/icons';
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
  const imageInputRef = useRef<HTMLInputElement>(null);

  // File input handler
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

    // Validate file types
    const allowedExtensions = ['.pdf', '.xlsx', '.xls', '.docx', '.doc', '.txt', '.csv'];
    const invalidFiles = fileArray.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !allowedExtensions.includes(extension);
    });

    if (invalidFiles.length > 0) {
      message.error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`);
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

  // Image input handler
  const handleImageClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file count (max 5 images)
    if (files.length > 5) {
      message.warning('Maximum 5 images can be selected at once');
      return;
    }

    // Convert FileList to Array
    const imageArray = Array.from(files);

    // Validate image types
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const invalidImages = imageArray.filter(image => {
      const extension = '.' + image.name.split('.').pop()?.toLowerCase();
      return !allowedExtensions.includes(extension);
    });

    if (invalidImages.length > 0) {
      message.error(`Invalid image type. Allowed: ${allowedExtensions.join(', ')}`);
      return;
    }

    // Call the callback with selected images
    onImageSelect(imageArray);
    message.success(`${imageArray.length} image(s) selected`);

    // Reset input to allow selecting the same image again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="input-toolbar">
      {/* File attachment button */}
      <Tooltip title="Attach files (PDF, Excel, Word, TXT, CSV)">
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
        accept=".pdf,.xlsx,.xls,.docx,.doc,.txt,.csv"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Image attachment button */}
      <Tooltip title="Attach images (JPG, PNG, GIF, WebP)">
        <Button
          icon={<PictureOutlined />}
          onClick={handleImageClick}
          disabled={disabled}
          className="toolbar-button"
          size="small"
          type="text"
        />
      </Tooltip>
      <input
        ref={imageInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        multiple
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      {/* Emoji button (optional, nice-to-have) */}
      <Tooltip title="Emoji (coming soon)">
        <Button
          icon={<SmileOutlined />}
          disabled
          className="toolbar-button"
          size="small"
          type="text"
        />
      </Tooltip>
    </div>
  );
};

export default InputToolbar;
