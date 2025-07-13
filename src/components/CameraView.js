import React from 'react';
import { View, Text } from 'react-native';
import { CameraView as ExpoCameraView } from 'expo-camera';
import { mainStyles } from '../styles/MainStyles';

const CameraView = ({ cameraEnabled, hasPermission, cameraRef, onCameraReady, facing }) => {
  if (!hasPermission) {
    return (
      <View style={mainStyles.container}>
        <Text style={mainStyles.permissionText}>
          Camera permission is required for sign language detection
        </Text>
      </View>
    );
  }

  if (!cameraEnabled) {
    return (
      <View style={mainStyles.disabledCameraContainer}>
        <Text style={mainStyles.disabledCameraText}>Camera is disabled</Text>
        <Text style={mainStyles.disabledCameraSubtext}>
          Enable camera to start sign language detection
        </Text>
      </View>
    );
  }

  return (
    <View style={{ position: 'absolute', top: -1000, left: -1000, width: 1, height: 1 }}>
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
