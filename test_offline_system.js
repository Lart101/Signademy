// Test script to verify offline-first model system
const ModelManager = require('./src/utils/ModelManager').default;
const { MODEL_CATEGORIES } = require('./src/config/ModelConfig');

async function testOfflineSystem() {
  console.log('Testing Offline-First Model System');
  console.log('====================================');
  
  try {
    // Test letters model path
    console.log('\n1. Testing Letters Model Path:');
    try {
      const lettersPath = await ModelManager.getModelPathWithOfflineCheck(MODEL_CATEGORIES.LETTERS);
      console.log('✓ Letters model path:', lettersPath);
    } catch (error) {
      console.log('✗ Letters model error:', error.message);
    }
    
    // Test numbers model path
    console.log('\n2. Testing Numbers Model Path:');
    try {
      const numbersPath = await ModelManager.getModelPathWithOfflineCheck(MODEL_CATEGORIES.NUMBERS);
      console.log('✓ Numbers model path:', numbersPath);
    } catch (error) {
      console.log('✗ Numbers model error:', error.message);
    }
    
    // Test model validation
    console.log('\n3. Testing Model Validation:');
    try {
      const isValid = await ModelManager.validateModel('nonexistent_file.tflite');
      console.log('Validation result for nonexistent file:', isValid);
    } catch (error) {
      console.log('Validation error (expected):', error.message);
    }
    
    console.log('\n4. Testing Model Download Status:');
    const lettersDownloaded = await ModelManager.isModelDownloaded(MODEL_CATEGORIES.LETTERS);
    const numbersDownloaded = await ModelManager.isModelDownloaded(MODEL_CATEGORIES.NUMBERS);
    console.log('Letters downloaded:', lettersDownloaded);
    console.log('Numbers downloaded:', numbersDownloaded);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOfflineSystem();
