// Example usage of InputToolbar component
import React, { useState } from 'react';
import InputToolbar from './InputToolbar';

const ExampleUsage: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleFileSelect = (files: File[]) => {
    console.log('Files selected:', files);
    setSelectedFiles(files);
    // Here you would typically upload the files using the API from Task 3
  };

  const handleImageSelect = (images: File[]) => {
    console.log('Images selected:', images);
    setSelectedImages(images);
    // Here you would typically upload the images using the API from Task 3
  };

  return (
    <div>
      <h3>InputToolbar Example</h3>

      <InputToolbar
        onFileSelect={handleFileSelect}
        onImageSelect={handleImageSelect}
        disabled={false}
      />

      <div style={{ marginTop: '20px' }}>
        <h4>Selected Files:</h4>
        <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>
              {file.name} - {(file.size / 1024).toFixed(2)} KB
            </li>
          ))}
        </ul>

        <h4>Selected Images:</h4>
        <ul>
          {selectedImages.map((image, index) => (
            <li key={index}>
              {image.name} - {(image.size / 1024).toFixed(2)} KB
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExampleUsage;
