import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { MODEL_PATHS, MODEL_CATEGORIES } from '../config/ModelConfig';

const MODEL_STORAGE_KEY = 'downloaded_models';
const MODEL_DOWNLOAD_DIR = FileSystem.documentDirectory + 'models/';

export class ModelManager {
  static async initializeStorage() {
    // Ensure the models directory exists
    const dirInfo = await FileSystem.getInfoAsync(MODEL_DOWNLOAD_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(MODEL_DOWNLOAD_DIR, { intermediates: true });
    }
  }

  static async getDownloadedModels() {
    try {
      const stored = await AsyncStorage.getItem(MODEL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting downloaded models:', error);
      return {};
    }
  }

  static async setDownloadedModels(models) {
    try {
      await AsyncStorage.setItem(MODEL_STORAGE_KEY, JSON.stringify(models));
    } catch (error) {
      console.error('Error setting downloaded models:', error);
    }
  }

  static async isModelDownloaded(category) {
    const downloadedModels = await this.getDownloadedModels();
    return downloadedModels[category] && downloadedModels[category].downloaded;
  }

  static getLocalModelPath(category) {
    return MODEL_DOWNLOAD_DIR + `${category}.task`;
  }

  static async downloadModel(category, onProgress = null) {
    try {
      await this.initializeStorage();
      
      const modelConfig = MODEL_PATHS[category];
      if (!modelConfig) {
        throw new Error(`Model category '${category}' not found`);
      }

      const localPath = this.getLocalModelPath(category);
      
      // Check if already downloaded and file exists
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (fileInfo.exists) {
        const downloadedModels = await this.getDownloadedModels();
        if (downloadedModels[category]?.downloaded) {
          return { success: true, path: localPath, alreadyExists: true };
        }
      }

      console.log(`Downloading model ${category} from:`, modelConfig.url);
      
      // Create download resumable for progress tracking
      const downloadResumable = FileSystem.createDownloadResumable(
        modelConfig.url,
        localPath,
        {},
        onProgress
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result && result.uri) {
        // Get the actual file size after download
        const fileInfo = await FileSystem.getInfoAsync(localPath);
        const actualSize = fileInfo.exists ? fileInfo.size : 0;
        
        console.log(`Download result size: ${result.size}, Actual file size: ${actualSize}`);
        
        // Check if the file is empty or too small (likely an error page)
        if (actualSize === 0) {
          // Delete the empty file
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(localPath);
          }
          throw new Error('Downloaded file is empty. The model may not exist at the specified URL.');
        }
        
        if (actualSize < 10000) { // Less than 10KB is definitely too small for a model
          console.warn(`Downloaded file seems very small (${actualSize} bytes). This might be an error page.`);
          // Delete the suspicious file
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(localPath);
          }
          throw new Error('Downloaded file is too small to be a valid model file.');
        }
        
        // Validate the downloaded model
        const validation = await this.validateModel(category);
        if (!validation.valid) {
          console.error(`Model validation failed: ${validation.reason}`);
          // Delete invalid file
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(localPath);
          }
          throw new Error(`Downloaded model is invalid: ${validation.reason}`);
        }
        
        // Mark as downloaded in storage
        const downloadedModels = await this.getDownloadedModels();
        downloadedModels[category] = {
          downloaded: true,
          downloadDate: new Date().toISOString(),
          localPath: localPath,
          size: actualSize,
          version: '1.0.0' // Could be used for future updates
        };
        
        await this.setDownloadedModels(downloadedModels);
        
        console.log(`Model ${category} downloaded successfully to: ${localPath}, Size: ${this.formatFileSize(actualSize)}`);
        return { success: true, path: localPath };
      } else {
        throw new Error('Download failed - no result returned');
      }
    } catch (error) {
      console.error(`Error downloading model ${category}:`, error);
      return { success: false, error: error.message };
    }
  }

  static async deleteModel(category) {
    try {
      const localPath = this.getLocalModelPath(category);
      
      // Delete the file
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(localPath);
      }
      
      // Update storage
      const downloadedModels = await this.getDownloadedModels();
      delete downloadedModels[category];
      await this.setDownloadedModels(downloadedModels);
      
      console.log(`Model ${category} deleted successfully`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting model ${category}:`, error);
      return { success: false, error: error.message };
    }
  }

  static async validateModel(category) {
    try {
      const localPath = this.getLocalModelPath(category);
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      
      if (!fileInfo.exists) {
        return { valid: false, reason: 'File does not exist' };
      }
      
      if (fileInfo.size < 1000) {
        return { valid: false, reason: 'File too small (likely corrupted)' };
      }
      
      // Basic file format check - .task files should have specific headers
      try {
        const uri = localPath;
        // Simple validation that the file can be accessed
        const response = await fetch('file://' + uri);
        if (!response.ok) {
          return { valid: false, reason: 'File not accessible' };
        }
        
        return { valid: true, size: fileInfo.size };
      } catch (error) {
        return { valid: false, reason: 'File access error: ' + error.message };
      }
    } catch (error) {
      return { valid: false, reason: 'Validation error: ' + error.message };
    }
  }

  static async getModelPathWithOfflineCheck(category) {
    const modelConfig = MODEL_PATHS[category];
    if (!modelConfig) {
      throw new Error(`Model category '${category}' not found`);
    }
    
    const isDownloaded = await this.isModelDownloaded(category);
    
    if (isDownloaded) {
      const localPath = this.getLocalModelPath(category);
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      
      if (fileInfo.exists && fileInfo.size > 10000) { // Ensure file is substantial
        console.log(`✓ Using local model for ${category}: ${localPath} (${this.formatFileSize(fileInfo.size)})`);
        return { path: localPath, isLocal: true };
      } else {
        // File was deleted, corrupted, or too small - clean up storage
        console.warn(`⚠️ Local file missing/corrupted for ${category}, cleaning up`);
        const downloadedModels = await this.getDownloadedModels();
        delete downloadedModels[category];
        await this.setDownloadedModels(downloadedModels);
        
        // Delete the bad file
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(localPath);
        }
      }
    }
    
    // If no local model available, force user to download
    console.log(`❌ No local model for ${category} - download required for offline use`);
    throw new Error(`Model '${category}' not downloaded. Please download it from the model manager for offline use.`);
  }

  static async getModelPath(category) {
    const modelConfig = MODEL_PATHS[category];
    if (!modelConfig) {
      throw new Error(`Model category '${category}' not found`);
    }
    
    const isDownloaded = await this.isModelDownloaded(category);
    
    if (isDownloaded) {
      const localPath = this.getLocalModelPath(category);
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      
      if (fileInfo.exists && fileInfo.size > 1000) { // Ensure file is not empty/corrupted
        console.log(`✓ Using local model for ${category}: ${localPath} (${this.formatFileSize(fileInfo.size)})`);
        // Return local file URI for WebView to use offline model
        return localPath;
      } else {
        // File was deleted, corrupted, or too small - clean up storage
        console.warn(`⚠️ Local file missing/corrupted for ${category}, cleaning up and using remote URL`);
        const downloadedModels = await this.getDownloadedModels();
        delete downloadedModels[category];
        await this.setDownloadedModels(downloadedModels);
        
        // Optionally delete the bad file
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(localPath);
        }
      }
    }
    
    // Fallback to remote URL only if no local model
    console.log(`🌐 Using remote model for ${category}: ${modelConfig.url}`);
    return modelConfig.url;
  }

  static async getDownloadInfo() {
    const downloadedModels = await this.getDownloadedModels();
    const totalSize = Object.values(downloadedModels).reduce((sum, model) => sum + (model.size || 0), 0);
    const count = Object.keys(downloadedModels).length;
    
    return {
      totalModels: count,
      totalSize: totalSize,
      models: downloadedModels
    };
  }

  static async clearAllModels() {
    try {
      await this.initializeStorage();
      
      // Delete all model files
      const dirInfo = await FileSystem.getInfoAsync(MODEL_DOWNLOAD_DIR);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(MODEL_DOWNLOAD_DIR);
        await FileSystem.makeDirectoryAsync(MODEL_DOWNLOAD_DIR, { intermediates: true });
      }
      
      // Clear storage
      await AsyncStorage.removeItem(MODEL_STORAGE_KEY);
      
      console.log('All models cleared successfully');
      return { success: true };
    } catch (error) {
      console.error('Error clearing all models:', error);
      return { success: false, error: error.message };
    }
  }

  static async refreshModelSizes() {
    try {
      const downloadedModels = await this.getDownloadedModels();
      let updated = false;
      
      for (const [category, modelInfo] of Object.entries(downloadedModels)) {
        if (modelInfo.downloaded && modelInfo.localPath) {
          const fileInfo = await FileSystem.getInfoAsync(modelInfo.localPath);
          if (fileInfo.exists && fileInfo.size !== modelInfo.size) {
            console.log(`Updating size for ${category} from ${modelInfo.size} to ${fileInfo.size}`);
            downloadedModels[category].size = fileInfo.size;
            updated = true;
          }
        }
      }
      
      if (updated) {
        await this.setDownloadedModels(downloadedModels);
        console.log('Model sizes updated');
      }
      
      return downloadedModels;
    } catch (error) {
      console.error('Error refreshing model sizes:', error);
      return await this.getDownloadedModels();
    }
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default ModelManager;
