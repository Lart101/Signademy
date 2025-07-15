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
        
        if (actualSize < 1000) { // Less than 1KB might be an error page
          console.warn(`Downloaded file seems very small (${actualSize} bytes). This might be an error page.`);
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

  static async getModelPath(category) {
    const isDownloaded = await this.isModelDownloaded(category);
    
    if (isDownloaded) {
      const localPath = this.getLocalModelPath(category);
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      
      if (fileInfo.exists) {
        console.log(`Using local model for ${category}:`, localPath);
        // Return remote URL for WebView compatibility, but local file exists for offline capability
        const modelConfig = MODEL_PATHS[category];
        console.log(`WebView will use remote URL for ${category}:`, modelConfig?.url);
        return modelConfig?.url;
      } else {
        // File was deleted but still marked as downloaded, clean up
        console.log(`Local file missing for ${category}, using remote URL`);
        const downloadedModels = await this.getDownloadedModels();
        delete downloadedModels[category];
        await this.setDownloadedModels(downloadedModels);
      }
    }
    
    // Fallback to remote URL
    const modelConfig = MODEL_PATHS[category];
    console.log(`Using remote model for ${category}:`, modelConfig?.url);
    return modelConfig?.url;
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
