import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ModelStatusBadge = ({ 
  isDownloaded, 
  modelName, 
  onPress, 
  size = 'medium',
  showText = true 
}) => {
  const sizeStyles = {
    small: {
      container: { paddingHorizontal: 8, paddingVertical: 4 },
      icon: { fontSize: 12 },
      text: { fontSize: 10 }
    },
    medium: {
      container: { paddingHorizontal: 12, paddingVertical: 6 },
      icon: { fontSize: 16 },
      text: { fontSize: 12 }
    },
    large: {
      container: { paddingHorizontal: 16, paddingVertical: 8 },
      icon: { fontSize: 20 },
      text: { fontSize: 14 }
    }
  };

  const currentSize = sizeStyles[size];
  
  if (onPress) {
    return (
      <TouchableOpacity 
        style={[
          styles.container,
          currentSize.container,
          isDownloaded ? styles.downloaded : styles.notDownloaded
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, currentSize.icon]}>
          {isDownloaded ? '✓' : '⚠️'}
        </Text>
        {showText && (
          <Text style={[
            styles.text, 
            currentSize.text,
            isDownloaded ? styles.downloadedText : styles.notDownloadedText
          ]}>
            {isDownloaded ? `${modelName} Ready` : `${modelName} Required`}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View 
      style={[
        styles.container,
        currentSize.container,
        isDownloaded ? styles.downloaded : styles.notDownloaded
      ]}
    >
      <Text style={[styles.icon, currentSize.icon]}>
        {isDownloaded ? '✓' : '⚠️'}
      </Text>
      {showText && (
        <Text style={[
          styles.text, 
          currentSize.text,
          isDownloaded ? styles.downloadedText : styles.notDownloadedText
        ]}>
          {isDownloaded ? `${modelName} Ready` : `${modelName} Required`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
  },
  downloaded: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  notDownloaded: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
  },
  downloadedText: {
    color: '#155724',
  },
  notDownloadedText: {
    color: '#721c24',
  },
});

export default ModelStatusBadge;
