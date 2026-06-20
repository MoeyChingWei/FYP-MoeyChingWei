import visionService from './services/vision-ai-service.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Test script for Vision AI Service
 * Tests image analysis with a public image URL
 */

async function testVisionService() {
  console.log('🧪 Testing Vision AI Service\n');

  // Check if service is enabled
  console.log('1. Checking service status...');
  if (!visionService.isEnabled()) {
    console.log('❌ Vision service is not enabled');
    console.log('   Please set OPENAI_API_KEY in .env file');
    return;
  }
  console.log('✅ Vision service is enabled\n');

  // Test image file detection
  console.log('2. Testing image file detection...');
  const testCases = [
    { mimeType: 'image/jpeg', fileName: 'test.jpg', expected: true },
    { mimeType: 'image/png', fileName: 'test.png', expected: true },
    { mimeType: 'application/pdf', fileName: 'test.pdf', expected: false },
    { mimeType: null, fileName: 'photo.JPG', expected: true },
  ];

  for (const test of testCases) {
    const result = visionService.isImageFile(test.mimeType, test.fileName);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`   ${status} ${test.fileName} (${test.mimeType || 'no mime'}): ${result}`);
  }
  console.log('');

  // Test image analysis with a public image
  console.log('3. Testing image analysis...');
  console.log('   Using sample image: OpenAI logo');

  const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png';

  try {
    const result = await visionService.analyzeImage(testImageUrl, 'chatgpt-logo.png');

    if (result.success) {
      console.log('✅ Image analysis successful!\n');
      console.log('📝 Analysis Result:');
      console.log('━'.repeat(60));
      console.log(result.analysis);
      console.log('━'.repeat(60));
      console.log(`\n📊 Token Usage:`);
      console.log(`   - Prompt tokens: ${result.usage.prompt_tokens}`);
      console.log(`   - Completion tokens: ${result.usage.completion_tokens}`);
      console.log(`   - Total tokens: ${result.usage.total_tokens}`);
      console.log(`   - Model: ${result.model}`);
    } else {
      console.log('❌ Image analysis failed');
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.log('❌ Test failed with error:');
    console.log(`   ${error.message}`);
  }

  console.log('\n✅ Test complete');
}

// Run test
testVisionService().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
