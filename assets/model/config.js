// Utility to verify the downloaded model file is accessible and readable
export const verifyGestureModelFile = async () => {
  try {
    const ModelManagerModule = await import('../../src/utils/ModelManager');
    const ModelManager = ModelManagerModule.default;
    const path = await getModelPathAsync(DEFAULT_CATEGORY);
    console.log('[ModelConfig] Verifying model file at:', path);
    // Check file existence and size
    const FileSystem = (await import('expo-file-system')).default;
    const fileInfo = await FileSystem.getInfoAsync(path);
    console.log('[ModelConfig] File exists:', fileInfo.exists, 'Size:', fileInfo.size);
    // Try to fetch the file as the loader would
    try {
      const response = await fetch(path);
      const ok = response.ok;
      const status = response.status;
      console.log('[ModelConfig] Fetch result:', ok, 'Status:', status);
      if (!ok) throw new Error('Fetch failed with status ' + status);
      return { exists: fileInfo.exists, size: fileInfo.size, fetchOk: ok, status };
    } catch (fetchErr) {
      console.error('[ModelConfig] Fetch error:', fetchErr.message);
      return { exists: fileInfo.exists, size: fileInfo.size, fetchOk: false, error: fetchErr.message };
    }
  } catch (error) {
    console.error('[ModelConfig] Error verifying model file:', error.message);
    return { exists: false, error: error.message };
  }
};
// Legacy config file - now replaced by ModelConfig.js
// This file is kept for backwards compatibility

// Import the new model configuration
import { getModelPathAsync, DEFAULT_CATEGORY } from '../../src/config/ModelConfig';

// Async function to get the true model path (local if downloaded, else throws)
export const getGestureModelPath = async () => {
  try {
    const path = await getModelPathAsync(DEFAULT_CATEGORY);
    console.log('[ModelConfig] Using model path:', path);
    return path;
  } catch (error) {
    console.error('[ModelConfig] Error getting model path:', error.message);
    throw error;
  }
};

// Async function to check if the model is downloaded (exists in device storage and is valid)
export const isGestureModelDownloaded = async () => {
  try {
    const ModelManagerModule = await import('../../src/utils/ModelManager');
    const ModelManager = ModelManagerModule.default;
    const isDownloaded = await ModelManager.isModelDownloaded(DEFAULT_CATEGORY);
    console.log('[ModelConfig] Model downloaded:', isDownloaded);
    return isDownloaded;
  } catch (error) {
    console.error('[ModelConfig] Error checking model download:', error.message);
    return false;
  }
};
