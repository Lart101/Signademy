import React, { useState, useRef } from 'react';
import { View } from 'react-native';

// Import modular components
import SplashScreen from './src/components/SplashScreen';
import LoadingOverlay from './src/components/LoadingOverlay';
import CameraView from './src/components/CameraView';
import DetectionWebView from './src/components/DetectionWebView';
import CameraControls from './src/components/CameraControls';

// Import custom hooks
import { useCameraPermissions, useCameraCapture } from './src/hooks/useCameraHooks';
import { useModelState } from './src/hooks/useModelState';

// Import styles
import { mainStyles } from './src/styles/MainStyles';

export default function App() {
  // Application state
  const [showSplash, setShowSplash] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [facing, setFacing] = useState('front'); // Add camera facing state
  
  // Refs
  const webviewRef = useRef(null);
  
  // Custom hooks
  const { permission, requestPermission } = useCameraPermissions();
  const { cameraRef } = useCameraCapture(cameraEnabled, webviewRef);
  const { modelLoaded, modelError, handleWebViewMessage, retryModel } = useModelState();

  // Event handlers
  const handleSplashFinish = () => {
    setShowSplash(false);
    // Don't auto-enable camera - let user enable it manually
  };

  const toggleCamera = async () => {
    if (!cameraEnabled) {
      // Request permission before enabling camera
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          console.log('Camera permission denied');
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
    console.log('Camera is ready');
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <View style={mainStyles.container}>
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
      />

      {/* Loading Overlay */}
      <LoadingOverlay
        modelLoaded={modelLoaded}
        modelError={modelError}
        onRetry={retryModel}
      />

      {/* Bottom Controls - Only show when model is loaded and no error */}
      {(modelLoaded && !modelError) && (
        <CameraControls
          cameraEnabled={cameraEnabled}
          onToggleCamera={toggleCamera}
          onFlipCamera={handleFlipCamera}
        />
      )}
    </View>
  );
}
