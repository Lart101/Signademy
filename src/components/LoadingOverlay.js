import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { mainStyles } from '../styles/MainStyles';

const LoadingOverlay = ({ modelLoaded, modelError, onRetry }) => {
  if (modelLoaded && !modelError) return null;

  if (modelError) {
    return (
      <View style={mainStyles.errorOverlay}>
        <View style={mainStyles.errorContent}>
          <Text style={mainStyles.errorIcon}>⚠️</Text>
          <Text style={mainStyles.errorTitle}>Connection Error</Text>
          <Text style={mainStyles.errorText}>Unable to load the AI model</Text>
          <TouchableOpacity style={mainStyles.retryButton} onPress={onRetry}>
            <Text style={mainStyles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={mainStyles.loadingOverlay}>
      <View style={mainStyles.loadingContent}>
        <View style={mainStyles.loadingIconContainer}>
          <Text style={mainStyles.loadingIcon}>🤟</Text>
        </View>
        <Text style={mainStyles.loadingTitle}>Signademy</Text>
        <Text style={mainStyles.loadingText}>Loading AI Model...</Text>
        
        {/* Loading Bar */}
        <View style={mainStyles.loadingBarContainer}>
          <View style={mainStyles.loadingBar}>
            <View style={mainStyles.loadingBarFill} />
          </View>
        </View>
        
        <Text style={mainStyles.loadingSubtext}>
          Please wait while we prepare your sign language detection
        </Text>
      </View>
    </View>
  );
};

export default LoadingOverlay;
