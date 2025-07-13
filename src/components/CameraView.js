import React from 'react';
import { View, Text } from 'react-native';
import { CameraView as ExpoCameraView } from 'expo-camera';
import { mainStyles } from '../styles/MainStyles';

const CameraView = ({ cameraEnabled, hasPermission, cameraRef, onCameraReady, facing }) => {
  if (!hasPermission) {
    return null; // Don't render anything - parent handles permission UI
  }

  if (!cameraEnabled) {
    return null; // Don't render anything - parent handles disabled state UI
  }

  return (
    <ExpoCameraView
      style={{ flex: 1, width: '100%', height: '100%' }}
      facing={facing}
      ref={cameraRef}
      onCameraReady={onCameraReady}
      animateShutter={false}
      ratio="16:9"
    />
  );
};

export default CameraView;
