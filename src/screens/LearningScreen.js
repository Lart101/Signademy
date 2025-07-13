import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Alert
} from 'react-native';
import { getModelInfo, MODEL_CATEGORIES } from '../config/ModelConfig';

// Import existing components
import CameraView from '../components/CameraView';
import DetectionWebView from '../components/DetectionWebView';
import LoadingOverlay from '../components/LoadingOverlay';

// Import hooks
import { useCameraPermissions, useCameraCapture } from '../hooks/useCameraHooks';
import { useModelState } from '../hooks/useModelState';

const LearningScreen = ({ category, onBack, onModelChange }) => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [facing, setFacing] = useState('front');
  
  // Refs
  const webviewRef = useRef(null);
  
  // Get model info for the selected category
  const modelInfo = getModelInfo(category.id);
  
  // Custom hooks
  const { permission, requestPermission } = useCameraPermissions();
  const { cameraRef } = useCameraCapture(cameraEnabled, webviewRef);
  const { modelLoaded, modelError, handleWebViewMessage, retryModel } = useModelState(modelInfo?.url);

  // Event handlers
  const toggleCamera = async () => {
    if (!cameraEnabled) {
      // Request permission before enabling camera
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          Alert.alert(
            'Camera Permission',
            'Camera access is required for sign language detection.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
    }
    setCameraEnabled(!cameraEnabled);
  };

  const handleFlipCamera = () => {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  };

  const handleCameraReady = () => {
    console.log('Camera is ready for learning mode');
  };

  if (!modelInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryIcon}>{modelInfo.icon}</Text>
          <View>
            <Text style={styles.categoryTitle}>{modelInfo.name}</Text>
            <Text style={styles.categoryDescription}>{modelInfo.description}</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Camera Component */}
        <CameraView
          cameraEnabled={cameraEnabled}
          hasPermission={permission?.granted}
          cameraRef={cameraRef}
          onCameraReady={handleCameraReady}
          facing={facing}
        />

        {/* WebView for AI Detection */}
        <DetectionWebView
          onMessage={handleWebViewMessage}
          webViewRef={webviewRef}
          modelPath={modelInfo.url} // Pass the specific model path
        />

        {/* Loading Overlay */}
        <LoadingOverlay
          modelLoaded={modelLoaded}
          modelError={modelError}
          onRetry={retryModel}
          modelName={modelInfo.name}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.controlButton, !cameraEnabled && styles.controlButtonActive]}
            onPress={toggleCamera}
          >
            <Text style={styles.controlButtonIcon}>
              {cameraEnabled ? '📷' : '📹'}
            </Text>
            <Text style={styles.controlButtonText}>
              {cameraEnabled ? 'Stop' : 'Start'} Camera
            </Text>
          </TouchableOpacity>

          {cameraEnabled && (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleFlipCamera}
            >
              <Text style={styles.controlButtonIcon}>🔄</Text>
              <Text style={styles.controlButtonText}>Flip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Learning Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Learning Tips:</Text>
          <Text style={styles.tipsText}>
            • Position your hand clearly in front of the camera
          </Text>
          <Text style={styles.tipsText}>
            • Ensure good lighting for better detection
          </Text>
          <Text style={styles.tipsText}>
            • Practice slowly and clearly
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  controls: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  controlButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  controlButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  tipsContainer: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#5a6c7d',
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
};

export default LearningScreen;
