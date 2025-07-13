// Legacy config file - now replaced by ModelConfig.js
// This file is kept for backwards compatibility

// Import the new model configuration
import { getModelPath, DEFAULT_CATEGORY } from '../../src/config/ModelConfig';

export const GESTURE_MODEL_URL = getModelPath(DEFAULT_CATEGORY);
