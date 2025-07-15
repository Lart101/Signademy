import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  Animated
} from 'react-native';
import { getModelInfo, getEnabledCategories, MODEL_CATEGORIES } from '../config/ModelConfig';

// Import existing components
import CameraView from '../components/CameraView';
import DetectionWebView from '../components/DetectionWebView';
import LoadingOverlay from '../components/LoadingOverlay';

// Import hooks
import { useCameraPermissions, useCameraCapture } from '../hooks/useCameraHooks';
import { useModelState } from '../hooks/useModelState';
import { useAsyncModelPath } from '../hooks/useAsyncModelPath';

const PracticeScreen = ({ onBack }) => {
  const [currentCategory, setCurrentCategory] = useState(MODEL_CATEGORIES.LETTERS);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [facing, setFacing] = useState('front');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  
  // Animation refs
  const scoreAnim = useRef(new Animated.Value(1)).current;
  
  // Refs
  const webviewRef = useRef(null);
  
  // Get available categories
  const enabledCategories = getEnabledCategories();
  const modelInfo = getModelInfo(currentCategory);
  const { modelPath, loading: modelPathLoading } = useAsyncModelPath(currentCategory);
  
  // Custom hooks
  const { permission, requestPermission } = useCameraPermissions();
  const { cameraRef } = useCameraCapture(cameraEnabled, webviewRef);
  const { modelLoaded, modelError, handleWebViewMessage, retryModel } = useModelState(modelPath);

  // Generate random challenge based on category
  const generateChallenge = () => {
    if (currentCategory === MODEL_CATEGORIES.LETTERS) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      setCurrentChallenge({
        type: 'letter',
        target: randomLetter,
        instruction: `Show the letter: ${randomLetter}`,
      });
    }
    // Add more challenge types for other categories when they're available
  };

  // Handle successful detection
  const handleSuccessfulDetection = (detected) => {
    if (currentChallenge && detected.toUpperCase() === currentChallenge.target) {
      setScore(prev => prev + 1);
      setAttempts(prev => prev + 1);
      
      // Animate score update
      Animated.sequence([
        Animated.scale(scoreAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.scale(scoreAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      
      // Generate new challenge after a short delay
      setTimeout(() => {
        generateChallenge();
      }, 1500);
    } else if (currentChallenge) {
      setAttempts(prev => prev + 1);
    }
  };

  // Enhanced message handler for practice mode
  const enhancedMessageHandler = (message) => {
    const result = handleWebViewMessage(message);
    
    // Check for successful gesture detection
    if (message.type === 'gesture-detected' && message.gesture) {
      handleSuccessfulDetection(message.gesture);
    }
    
    return result;
  };

  useEffect(() => {
    if (modelLoaded && !currentChallenge) {
      generateChallenge();
    }
  }, [modelLoaded, currentCategory]);

  const toggleCamera = async () => {
    if (!cameraEnabled) {
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          Alert.alert(
            'Camera Permission',
            'Camera access is required for practice mode.',
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

  const resetPractice = () => {
    setScore(0);
    setAttempts(0);
    generateChallenge();
  };

  const switchCategory = (categoryId) => {
    setCurrentCategory(categoryId);
    resetPractice();
  };

  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🎯 Practice Mode</Text>
          <Text style={styles.headerSubtitle}>{modelInfo?.name}</Text>
        </View>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetPractice}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Animated.View style={[styles.statBox, { transform: [{ scale: scoreAnim }] }]}>
          <Text style={styles.statNumber}>{score}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </Animated.View>
        
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{attempts}</Text>
          <Text style={styles.statLabel}>Attempts</Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: accuracy >= 70 ? '#27ae60' : accuracy >= 40 ? '#f39c12' : '#e74c3c' }]}>
            {accuracy}%
          </Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Challenge */}
      {currentChallenge && (
        <View style={styles.challengeContainer}>
          <Text style={styles.challengeTitle}>Current Challenge</Text>
          <Text style={styles.challengeInstruction}>{currentChallenge.instruction}</Text>
          <Text style={styles.challengeTarget}>{currentChallenge.target}</Text>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Camera Component */}
        <CameraView
          cameraEnabled={cameraEnabled}
          hasPermission={permission?.granted}
          cameraRef={cameraRef}
          onCameraReady={() => console.log('Camera ready for practice')}
          facing={facing}
        />

        {/* WebView for AI Detection */}
        <DetectionWebView
          onMessage={enhancedMessageHandler}
          webViewRef={webviewRef}
          modelPath={modelPath}
        />

        {/* Loading Overlay */}
        <LoadingOverlay
          modelLoaded={modelLoaded && !modelPathLoading}
          modelError={modelError}
          onRetry={retryModel}
          modelName={modelInfo?.name}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Category Selector */}
        <View style={styles.categorySelector}>
          <Text style={styles.categorySelectorTitle}>Categories:</Text>
          <View style={styles.categoryButtons}>
            {enabledCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  currentCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => switchCategory(category.id)}
              >
                <Text style={styles.categoryButtonIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryButtonText,
                  currentCategory === category.id && styles.categoryButtonTextActive
                ]}>
                  {category.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={[styles.controlButton, cameraEnabled && styles.controlButtonActive]}
            onPress={toggleCamera}
          >
            <Text style={styles.controlButtonIcon}>
              {cameraEnabled ? '📷' : '📹'}
            </Text>
            <Text style={styles.controlButtonText}>
              {cameraEnabled ? 'Stop' : 'Start'}
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
    justifyContent: 'space-between',
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
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  resetButton: {
    padding: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    marginBottom: 1,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  challengeContainer: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
  },
  challengeInstruction: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  challengeTarget: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
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
  categorySelector: {
    marginBottom: 16,
  },
  categorySelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  categoryButtonActive: {
    backgroundColor: '#4A90E2',
  },
  categoryButtonIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 80,
  },
  controlButtonActive: {
    backgroundColor: '#27ae60',
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
};

export default PracticeScreen;
