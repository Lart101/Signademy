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
    <View style={{ position: 'absolute', top: -1000, left: -1000, width: 1, height: 1, opacity: 0 }}>
      <ExpoCameraView
        style={{ width: 1, height: 1 }}
        facing={facing}
        ref={cameraRef}
        onCameraReady={onCameraReady}
        animateShutter={false}
        ratio="16:9"
      />
    </View>
  );
};

export default CameraView;
