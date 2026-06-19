import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// Image processing configuration
const THUMBNAIL_SIZE = 400;
const THUMBNAIL_QUALITY = 80;
const COMPRESSION_THRESHOLD = 2 * 1024 * 1024; // 2MB in bytes
const COMPRESSION_QUALITY = 75;

/**
 * Generate a thumbnail for an image
 * @param {string} imagePath - Path to the source image
 * @param {string} outputPath - Path where thumbnail will be saved
 * @returns {Promise<string>} - Path to the generated thumbnail
 */
export async function generateThumbnail(imagePath, outputPath) {
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Generate thumbnail: resize to fit within 400x400, maintain aspect ratio
    await sharp(imagePath)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: THUMBNAIL_QUALITY })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    throw new Error(`Failed to generate thumbnail: ${error.message}`);
  }
}

/**
 * Compress an image if it exceeds the size threshold
 * @param {string} imagePath - Path to the image file
 * @param {string} outputPath - Path where compressed image will be saved (can be same as input)
 * @returns {Promise<{compressed: boolean, size: number, path: string}>}
 */
export async function compressImage(imagePath, outputPath) {
  try {
    // Check file size
    const stats = await fs.stat(imagePath);
    const fileSize = stats.size;

    // If file is under threshold, no compression needed
    if (fileSize <= COMPRESSION_THRESHOLD) {
      return {
        compressed: false,
        size: fileSize,
        path: imagePath
      };
    }

    // Compress the image
    const metadata = await sharp(imagePath).metadata();

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Compress based on format
    let sharpInstance = sharp(imagePath);

    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      sharpInstance = sharpInstance.jpeg({ quality: COMPRESSION_QUALITY });
    } else if (metadata.format === 'png') {
      sharpInstance = sharpInstance.png({ quality: COMPRESSION_QUALITY });
    } else if (metadata.format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality: COMPRESSION_QUALITY });
    } else {
      // For other formats, convert to JPEG
      sharpInstance = sharpInstance.jpeg({ quality: COMPRESSION_QUALITY });
    }

    await sharpInstance.toFile(outputPath);

    // Get new file size
    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size;

    return {
      compressed: true,
      size: newSize,
      path: outputPath,
      originalSize: fileSize,
      savedBytes: fileSize - newSize
    };
  } catch (error) {
    throw new Error(`Failed to compress image: ${error.message}`);
  }
}

/**
 * Get image metadata
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Object>} - Image metadata (width, height, format, size)
 */
export async function getImageMetadata(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const stats = await fs.stat(imagePath);

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size
    };
  } catch (error) {
    throw new Error(`Failed to get image metadata: ${error.message}`);
  }
}

export default {
  generateThumbnail,
  compressImage,
  getImageMetadata,
  THUMBNAIL_SIZE,
  THUMBNAIL_QUALITY,
  COMPRESSION_THRESHOLD,
  COMPRESSION_QUALITY
};
