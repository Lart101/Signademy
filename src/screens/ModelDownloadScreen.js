import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import ModelManager from '../utils/ModelManager';
import { getAvailableCategories } from '../config/ModelConfig';

const { width } = Dimensions.get('window');

const ModelDownloadScreen = ({ onBack }) => {
  const [downloadedModels, setDownloadedModels] = useState({});
  const [downloading, setDownloading] = useState({});
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadInfo, setDownloadInfo] = useState({ totalModels: 0, totalSize: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const availableCategories = getAvailableCategories();

  useEffect(() => {
    loadDownloadInfo();
  }, []);

  const loadDownloadInfo = async () => {
    try {
      setRefreshing(true);
      // Refresh model sizes first in case they were stored as 0
      const refreshedModels = await ModelManager.refreshModelSizes();
      const info = await ModelManager.getDownloadInfo();
      setDownloadedModels(refreshedModels);
      setDownloadInfo(info);
    } catch (error) {
      console.error('Error loading download info:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownload = async (category) => {
    setDownloading(prev => ({ ...prev, [category]: true }));
    setDownloadProgress(prev => ({ ...prev, [category]: 0 }));

    try {
      const result = await ModelManager.downloadModel(
        category,
        (downloadProgress) => {
          if (downloadProgress.totalBytesExpectedToWrite > 0) {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            setDownloadProgress(prev => ({ ...prev, [category]: progress }));
          }
        }
      );

      if (result.success) {
        if (result.alreadyExists) {
          Alert.alert('Already Downloaded', 'This model is already available offline.');
        } else {
          Alert.alert('Download Complete', 'Model downloaded successfully and is now available offline!');
        }
        await loadDownloadInfo();
      } else {
        Alert.alert('Download Failed', result.error || 'Failed to download model. Please check your internet connection.');
      }
    } catch (error) {
      Alert.alert('Download Error', 'An unexpected error occurred during download.');
      console.error('Download error:', error);
    } finally {
      setDownloading(prev => ({ ...prev, [category]: false }));
      setDownloadProgress(prev => ({ ...prev, [category]: 0 }));
    }
  };

  const handleDelete = async (category) => {
    Alert.alert(
      'Delete Model',
      'Are you sure you want to delete this model? You will need to download it again to use offline.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await ModelManager.deleteModel(category);
            if (result.success) {
              await loadDownloadInfo();
              Alert.alert('Deleted', 'Model removed from device.');
            } else {
              Alert.alert('Error', 'Failed to delete model.');
            }
          }
        }
      ]
    );
  };

  const handleClearAll = async () => {
    if (downloadInfo.totalModels === 0) {
      Alert.alert('No Models', 'No downloaded models to clear.');
      return;
    }

    Alert.alert(
      'Clear All Models',
      `This will delete all ${downloadInfo.totalModels} downloaded models (${ModelManager.formatFileSize(downloadInfo.totalSize)}). Are you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const result = await ModelManager.clearAllModels();
            if (result.success) {
              await loadDownloadInfo();
              Alert.alert('Cleared', 'All models removed from device.');
            } else {
              Alert.alert('Error', 'Failed to clear models.');
            }
          }
        }
      ]
    );
  };

  const ModelCard = ({ category }) => {
    const isDownloaded = downloadedModels[category.id]?.downloaded;
    const isDownloading = downloading[category.id];
    const progress = downloadProgress[category.id] || 0;
    const model = downloadedModels[category.id];

    return (
      <View style={styles.modelCard}>
        <View style={styles.modelHeader}>
          <View style={styles.modelInfo}>
            <Text style={styles.modelIcon}>{category.icon}</Text>
            <View style={styles.modelText}>
              <Text style={styles.modelName}>{category.name}</Text>
              <Text style={styles.modelDescription}>{category.description}</Text>
              {isDownloaded && model && (
                <Text style={styles.modelSize}>
                  Size: {ModelManager.formatFileSize(model.size)} • Downloaded: {new Date(model.downloadDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.modelActions}>
            {isDownloaded ? (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(category.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]}
                onPress={() => handleDownload(category.id)}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.downloadButtonText}>Download</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {isDownloading && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
          </View>
        )}
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, isDownloaded ? styles.statusOnline : styles.statusOffline]} />
          <Text style={styles.statusText}>
            {isDownloaded ? 'Available Offline' : 'Requires Internet'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>📦 Download Models</Text>
          <Text style={styles.subtitle}>Download AI models for offline use</Text>
        </View>
      </View>

      {/* Storage Info */}
      <View style={styles.storageInfo}>
        <View style={styles.storageCard}>
          <Text style={styles.storageTitle}>📊 Storage Usage</Text>
          <View style={styles.storageStats}>
            <View style={styles.storageStat}>
              <Text style={styles.storageNumber}>{downloadInfo.totalModels}</Text>
              <Text style={styles.storageLabel}>Models</Text>
            </View>
            <View style={styles.storageStat}>
              <Text style={styles.storageNumber}>{ModelManager.formatFileSize(downloadInfo.totalSize)}</Text>
              <Text style={styles.storageLabel}>Used</Text>
            </View>
          </View>
          {downloadInfo.totalModels > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
              <Text style={styles.clearButtonText}>Clear All Models</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Models List */}
      <ScrollView 
        style={styles.scrollView} 
        refreshing={refreshing}
        onRefresh={loadDownloadInfo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Models</Text>
          <Text style={styles.sectionDescription}>
            Download models to use Signademy offline. Each model enables recognition for its category.
          </Text>
          
          {availableCategories.map((category) => (
            <ModelCard key={category.id} category={category} />
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 About Offline Models</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⚡</Text>
            <Text style={styles.infoText}>Faster loading when using the app</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📱</Text>
            <Text style={styles.infoText}>Works without internet connection</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🔒</Text>
            <Text style={styles.infoText}>Models are stored securely on your device</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🗑️</Text>
            <Text style={styles.infoText}>Delete anytime to free up space</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  storageInfo: {
    padding: 20,
  },
  storageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  storageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  storageStat: {
    alignItems: 'center',
  },
  storageNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  storageLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    lineHeight: 20,
  },
  modelCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  modelIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  modelText: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  modelSize: {
    fontSize: 12,
    color: '#95a5a6',
  },
  modelActions: {
    marginLeft: 10,
  },
  downloadButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusOnline: {
    backgroundColor: '#2ecc71',
  },
  statusOffline: {
    backgroundColor: '#f39c12',
  },
  statusText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoSection: {
    padding: 20,
    paddingTop: 0,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
};

export default ModelDownloadScreen;
