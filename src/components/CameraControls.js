import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { mainStyles } from '../styles/MainStyles';

const CameraControls = ({ cameraEnabled, onToggleCamera, onFlipCamera, hasPermission }) => {
  const getButtonText = () => {
    if (!hasPermission && !cameraEnabled) {
      return '📷 Grant Permission';
    }
    return cameraEnabled ? '📷 Disable' : '📷 Enable';
  };

  return (
    <View style={mainStyles.bottomControls}>
      <TouchableOpacity 
        style={mainStyles.controlButton} 
        onPress={onToggleCamera}
      >
        <Text style={mainStyles.controlButtonText}>
          {getButtonText()}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          mainStyles.controlButton,
          !cameraEnabled && mainStyles.captureButtonDisabled
        ]} 
        onPress={onFlipCamera}
        disabled={!cameraEnabled}
      >
        <Text style={mainStyles.controlButtonText}>
          {cameraEnabled ? '🔄 Flip Camera' : '🔄 Flip'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraControls;
