import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test script for upload-attachment endpoint
 * This creates a test file and sends it to the endpoint
 */

async function testUploadEndpoint() {
  console.log('🧪 Testing upload-attachment endpoint...\n');

  // Create a test text file
  const testFilePath = path.join(__dirname, 'test-file.txt');
  const testContent = 'This is a test file for upload endpoint testing.\nCreated at: ' + new Date().toISOString();

  try {
    fs.writeFileSync(testFilePath, testContent);
    console.log('✅ Created test file:', testFilePath);
  } catch (error) {
    console.error('❌ Failed to create test file:', error);
    return;
  }

  // Test parameters - you need to provide valid sessionId and userId
  const testData = {
    sessionId: 'test-session-id', // Replace with a valid session ID from your database
    userId: '1' // Replace with a valid user ID
  };

  console.log('\n📝 Test parameters:');
  console.log('  sessionId:', testData.sessionId);
  console.log('  userId:', testData.userId);
  console.log('\n⚠️  NOTE: You need to update these values with valid session and user IDs from your database');
  console.log('     To create a test session, use: POST /api/chatbot/new-session with userId');
  console.log('\n🔧 Manual test command:');
  console.log(`
curl -X POST http://localhost:4000/api/chatbot/upload-attachment \\
  -F "file=@${testFilePath}" \\
  -F "sessionId=${testData.sessionId}" \\
  -F "userId=${testData.userId}"
`);

  console.log('\n✨ Expected response:');
  console.log(`{
  "success": true,
  "attachment": {
    "id": "temp_1234567890",
    "fileName": "test-file.txt",
    "fileUrl": "/uploads/messages/{sessionId}/{uniqueFilename}",
    "thumbnailUrl": null,
    "fileSize": ${testContent.length},
    "fileType": "text",
    "mimeType": "text/plain"
  }
}`);

  console.log('\n📋 To run the test:');
  console.log('1. Start the server: npm run dev');
  console.log('2. Create a test session or use an existing one');
  console.log('3. Update sessionId and userId in this script or use curl directly');
  console.log('4. Run: node test-upload-endpoint.js\n');

  // Clean up test file
  try {
    fs.unlinkSync(testFilePath);
    console.log('🧹 Cleaned up test file\n');
  } catch (error) {
    console.warn('⚠️  Could not clean up test file:', error.message);
  }
}

testUploadEndpoint();
