import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  Animated,
  Dimensions
} from 'react-native';

// Import existing components
import CameraView from '../components/CameraView';
import DetectionWebView from '../components/DetectionWebView';
import LoadingOverlay from '../components/LoadingOverlay';
import LetterVideo from '../components/LetterVideo';

// Import hooks
import { useCameraPermissions, useCameraCapture } from '../hooks/useCameraHooks';
import { useModelState } from '../hooks/useModelState';
import { useAsyncModelPath } from '../hooks/useAsyncModelPath';
import { useFeedbackSounds, useUISounds } from '../hooks/useSoundEffects';
import { getModelInfo, MODEL_CATEGORIES } from '../config/ModelConfig';

const { width, height } = Dimensions.get('window');

const LettersLearningScreen = ({ onBack }) => {
  // State for learning progress
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [facing, setFacing] = useState('front');
  
  // Animation refs
  const successAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Refs
  const webviewRef = useRef(null);
  
  // Letters array
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const currentLetter = letters[currentLetterIndex];
  
  // Get model info
  const modelInfo = getModelInfo(MODEL_CATEGORIES.LETTERS);
  const { modelPath, loading: modelPathLoading } = useAsyncModelPath(MODEL_CATEGORIES.LETTERS);
  
  // Custom hooks
  const { permission, requestPermission } = useCameraPermissions();
  const { cameraRef } = useCameraCapture(cameraEnabled, webviewRef);
  const { modelLoaded, modelError, handleWebViewMessage, retryModel } = useModelState(modelPath);
  
  // Sound effects hooks
  const { playCorrect, playIncorrect, playSuccess, playCompletion } = useFeedbackSounds();
  const { playButtonPress, playCameraToggle, playPageSwipe } = useUISounds();

  // Enhanced message handler for letter detection
  const enhancedMessageHandler = (event) => {
    const parsedMessage = handleWebViewMessage(event);
    
    // Debug logging
    console.log('Parsed message:', parsedMessage);
    console.log('Current letter:', currentLetter);
    console.log('Show success:', showSuccess);
    
    // Check for successful letter detection
    if (parsedMessage && parsedMessage.type === 'gesture-detected' && parsedMessage.gesture) {
      const detectedLetter = parsedMessage.gesture.toUpperCase();
      console.log('Detected letter:', detectedLetter);
      console.log('Expected letter:', currentLetter);
      console.log('Letters match:', detectedLetter === currentLetter);
      
      if (detectedLetter === currentLetter && !showSuccess) {
        console.log('Triggering correct detection!');
        // Play correct detection sound
        playCorrect();
        handleCorrectDetection();
      }
    }
    
    return parsedMessage;
  };

  // Handle correct letter detection
  const handleCorrectDetection = () => {
    setShowSuccess(true);
    
    // Add to completed letters
    if (!completedLetters.includes(currentLetter)) {
      setCompletedLetters(prev => [...prev, currentLetter]);
    }
    
    // Animate success feedback
    Animated.sequence([
      Animated.timing(successAnim, { 
        toValue: 1, 
        duration: 300, 
        useNativeDriver: true 
      }),
      Animated.delay(1500),
      Animated.timing(successAnim, { 
        toValue: 0, 
        duration: 300, 
        useNativeDriver: true 
      })
    ]).start(() => {
      setShowSuccess(false);
      // Play success sound when advancing to next letter
      playSuccess();
      advanceToNextLetter();
    });

    // Update progress bar
    const progress = (currentLetterIndex + 1) / letters.length;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false
    }).start();
  };

  // Advance to next letter
  const advanceToNextLetter = () => {
    if (currentLetterIndex < letters.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
    } else {
      // All letters completed
      playCompletion();
      setShowCompletion(true);
      setCameraEnabled(false);
    }
  };

  // Go back to previous letter
  const goBackLetter = () => {
    playPageSwipe();
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(prev => prev - 1);
    }
  };

  // Toggle camera
  const toggleCamera = async () => {
    if (!cameraEnabled) {
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          Alert.alert(
            'Camera Permission',
            'Camera access is required for letter detection.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
      playCameraToggle();
    }
    setCameraEnabled(!cameraEnabled);
  };

  // Restart learning
  const restartLearning = () => {
    playButtonPress();
    setCurrentLetterIndex(0);
    setCompletedLetters([]);
    setShowCompletion(false);
    progressAnim.setValue(0);
  };

  // Calculate progress percentage
  const progressPercentage = ((currentLetterIndex + (completedLetters.includes(currentLetter) ? 1 : 0)) / letters.length) * 100;

  // Completion Screen
  if (showCompletion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completionContainer}>
          <Text style={styles.completionEmoji}>🎉</Text>
          <Text style={styles.completionTitle}>Congratulations!</Text>
          <Text style={styles.completionText}>
            You've learned all the letters!
          </Text>
          
          <View style={styles.completionButtons}>
            <TouchableOpacity 
              style={styles.completionButton}
              onPress={() => {
                playButtonPress();
                restartLearning();
              }}
            >
              <Text style={styles.completionButtonText}>Restart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.completionButton, styles.homeButton]}
              onPress={() => {
                playButtonPress();
                onBack();
              }}
            >
              <Text style={[styles.completionButtonText, styles.homeButtonText]}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              playButtonPress();
              currentLetterIndex === 0 ? onBack() : goBackLetter();
            }}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.currentLetter}>Sign: {currentLetter}</Text>
          
          <TouchableOpacity 
            style={[styles.cameraToggle, 
              !permission?.granted && styles.cameraToggleDisabled,
              cameraEnabled && styles.cameraToggleActive
            ]}
            onPress={toggleCamera}
            disabled={!permission?.granted}
          >
            <Text style={[styles.cameraToggleText,
              !permission?.granted && styles.cameraToggleTextDisabled
            ]}>
              {!permission?.granted ? '🚫' : cameraEnabled ? '📷' : '📹'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progressPercentage)}% ({currentLetterIndex + 1}/{letters.length})
          </Text>
        </View>
      </View>

      {/* Video Section */}
      <View style={styles.videoContainer}>
        <Text style={styles.videoTitle}>Learn: {currentLetter}</Text>
        <View style={styles.videoWrapper}>
          <LetterVideo
            letter={currentLetter}
            style={styles.video}
            onVideoReady={() => console.log(`Video ready for ${currentLetter}`)}
          />
        </View>
      </View>

      {/* Camera Section */}
      <View style={styles.cameraSectionCompact}>
        <Text style={styles.cameraSectionTitle}>Your Turn: Show "{currentLetter}"</Text>
        
        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          {!permission?.granted ? (
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={() => {
                playButtonPress();
                requestPermission();
              }}
            >
              <Text style={styles.permissionButtonText}>📷 Grant Camera Permission</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.cameraControlRow}>
              <TouchableOpacity 
                style={[styles.cameraControlButton, cameraEnabled ? styles.disableButton : styles.enableButton]}
                onPress={() => {
                  playButtonPress();
                  toggleCamera();
                }}
              >
                <Text style={styles.cameraControlButtonText}>
                  {cameraEnabled ? '📷 Disable Camera' : '📹 Enable Camera'}
                </Text>
              </TouchableOpacity>
              
              {cameraEnabled && (
                <TouchableOpacity 
                  style={styles.flipButton}
                  onPress={() => {
                    playButtonPress();
                    setFacing(facing === 'front' ? 'back' : 'front');
                  }}
                >
                  <Text style={styles.flipButtonText}>🔄</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.cameraContainerHidden}>
          {/* Camera Component - Hidden but functional for AI detection */}
          <CameraView
            cameraEnabled={cameraEnabled}
            hasPermission={permission?.granted}
            cameraRef={cameraRef}
            onCameraReady={() => console.log('Camera ready for letter learning')}
            facing={facing}
          />
        </View>
        
        {!cameraEnabled && permission?.granted && (
          <View style={styles.cameraPrompt}>
            <Text style={styles.cameraPromptText}>Enable camera to practice signing "{currentLetter}"</Text>
          </View>
        )}
        
        {!permission?.granted && (
          <View style={styles.cameraPrompt}>
            <Text style={styles.cameraPromptText}>Grant camera permission to practice sign language</Text>
          </View>
        )}
      </View>

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
        modelName="Letters Recognition Model"
      />

      {/* Success Feedback */}
      {showSuccess && (
        <Animated.View 
          style={[
            styles.successOverlay,
            {
              opacity: successAnim,
              transform: [{
                scale: successAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}
        >
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successText}>Correct!</Text>
          <Text style={styles.successSubtext}>Great job signing "{currentLetter}"</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  currentLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cameraToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  cameraToggleActive: {
    backgroundColor: '#d4edda',
  },
  cameraToggleDisabled: {
    backgroundColor: '#f8d7da',
    opacity: 0.6,
  },
  cameraToggleText: {
    fontSize: 20,
  },
  cameraToggleTextDisabled: {
    opacity: 0.5,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  videoContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  videoWrapper: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  cameraSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cameraSectionCompact: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cameraSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
    minHeight: 200,
  },
  cameraContainerDisabled: {
    flex: 0,
    minHeight: 0,
    height: 0,
    backgroundColor: 'transparent',
  },
  cameraContainerHidden: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    width: 1,
    height: 1,
    opacity: 0,
  },
  enableCameraButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  enableCameraButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 20,
  },
  successEmoji: {
    fontSize: 100,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  successText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  successSubtext: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#f8f9ff',
  },
  completionEmoji: {
    fontSize: 100,
    marginBottom: 30,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  completionText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
  },
  completionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  completionButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  completionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButtonText: {
    color: '#4A90E2',
  },
  // Camera Control Styles
  cameraControls: {
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraControlRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  cameraControlButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  enableButton: {
    backgroundColor: '#27ae60',
  },
  disableButton: {
    backgroundColor: '#e74c3c',
  },
  cameraControlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flipButton: {
    backgroundColor: '#3498db',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 24,
  },
  cameraPrompt: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    borderLeft: 4,
    borderLeftColor: '#ffc107',
  },
  cameraPromptText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
};

export default LettersLearningScreen;
