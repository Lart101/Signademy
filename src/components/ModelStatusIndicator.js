import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ModelStatusIndicator = ({ error, onDownloadPress, onBack, category }) => {
  if (!error) return null;

  const isDownloadRequired = error.isDownloadRequired || error.message.includes('Download Required');

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Model Required</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.icon}>
            {isDownloadRequired ? '📥' : '⚠️'}
          </Text>
          
          <View style={styles.cardContent}>
            <Text style={styles.title}>
              {isDownloadRequired ? 'Download Required' : 'Model Error'}
            </Text>
            
            <Text style={styles.message}>
              {isDownloadRequired 
                ? `To use ${category} recognition, you need to download the AI model first. This enables offline learning and faster performance.`
                : error.message
              }
            </Text>
            
            {isDownloadRequired && (
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => onDownloadPress(category)}
              >
                <Text style={styles.downloadButtonText}>
                  📦 Download Model
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Why download models?</Text>
          <Text style={styles.infoText}>
            • Works without internet connection{'\n'}
            • Faster recognition performance{'\n'}
            • More reliable and private{'\n'}
            • One-time download per model
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  placeholder: {
    width: 50, // Balance the header layout
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 15,
  },
  cardContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
});

export default ModelStatusIndicator;
