import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

// Splash Screen Component
const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [showGetStarted, setShowGetStarted] = useState(false);

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Show get started button after logo animation
    const timer = setTimeout(() => {
      setShowGetStarted(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={splashStyles.container}>
      {/* Background Gradient Effect */}
      <View style={splashStyles.backgroundGradient} />
      
      {/* Main Content */}
      <View style={splashStyles.content}>
        {/* Logo/Icon Area */}
        <Animated.View 
          style={[
            splashStyles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Hand Sign Icon */}
          <View style={splashStyles.iconCircle}>
            <Text style={splashStyles.handIcon}>🤟</Text>
          </View>
          
          {/* App Name */}
          <Text style={splashStyles.appName}>Signademy</Text>
          <Text style={splashStyles.tagline}>Learn Sign Language</Text>
        </Animated.View>

        {/* Features Icons */}
        <Animated.View 
          style={[
            splashStyles.featuresContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={splashStyles.featureRow}>
            <View style={splashStyles.featureItem}>
              <Text style={splashStyles.featureIcon}>📱</Text>
              <Text style={splashStyles.featureText}>Easy</Text>
            </View>
            <View style={splashStyles.featureItem}>
              <Text style={splashStyles.featureIcon}>🎯</Text>
              <Text style={splashStyles.featureText}>Accurate</Text>
            </View>
            <View style={splashStyles.featureItem}>
              <Text style={splashStyles.featureIcon}>⚡</Text>
              <Text style={splashStyles.featureText}>Fast</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Get Started Button */}
      {showGetStarted && (
        <Animated.View 
          style={[
            splashStyles.buttonContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity 
            style={splashStyles.getStartedButton}
            onPress={onFinish}
            activeOpacity={0.8}
          >
            <Text style={splashStyles.buttonText}>Get Started</Text>
            <Text style={splashStyles.buttonIcon}>👋</Text>
          </TouchableOpacity>
          
          <Text style={splashStyles.disclaimer}>
            Kid-friendly • Adult-friendly • Accessible
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Language Detection</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #f0f0f0;
            text-align: center;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 24px;
        }
        .frame-container {
            position: relative;
            width: 100%;
            max-width: 400px;
            margin: 0 auto 20px;
            border-radius: 8px;
            overflow: hidden;
            background: #000;
            min-height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #cameraFrame {
            max-width: 100%;
            max-height: 100%;
            border-radius: 8px;
        }
        #overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        .status {
            text-align: center;
            margin: 15px 0;
            padding: 10px;
            border-radius: 6px;
            font-weight: 500;
        }
        .status.active {
            background: #d4edda;
            color: #155724;
        }
        .status.inactive {
            background: #f8d7da;
            color: #721c24;
        }
        #gesture_output {
            background: #e7f3ff;
            color: #0066cc;
            padding: 15px;
            border-radius: 6px;
            margin-top: 15px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            display: none;
        }
        .loading {
            text-align: center;
            color: #666;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤟 Signademy Detection</h1>
        
        <div class="loading" id="loading">Initializing AI model...</div>
        
        <div class="frame-container">
            <img id="cameraFrame" style="display: none;" />
            <canvas id="overlay"></canvas>
            <div id="placeholder" style="color: white; text-align: center;">
                Waiting for camera frames...
            </div>
        </div>
        
        <div class="status inactive" id="status">Camera disabled</div>
        <div id="gesture_output"></div>
    </div>

    <script type="module">
        import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

        let gestureRecognizer;
        let isProcessing = false;
        
        const cameraFrame = document.getElementById('cameraFrame');
        const overlay = document.getElementById('overlay');
        const overlayCtx = overlay.getContext('2d');
        const gestureOutput = document.getElementById('gesture_output');
        const statusDiv = document.getElementById('status');
        const loadingDiv = document.getElementById('loading');
        const placeholder = document.getElementById('placeholder');

        // Initialize the GestureRecognizer with your custom model
        const createGestureRecognizer = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
                
                // Use your custom model hosted on Supabase
                gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage//Asl14000imagePART3.task",
                        delegate: "GPU"
                    },
                    runningMode: "IMAGE"
                });
                
                loadingDiv.style.display = 'none';
                statusDiv.textContent = 'Signademy Ready - Start signing!';
                statusDiv.className = 'status active';
                console.log('Custom ASL model initialized successfully from Supabase');
                
                // Notify React Native that model is loaded
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'model-loaded'
                }));
            } catch (error) {
                console.error('Error loading custom model:', error);
                loadingDiv.textContent = 'Error loading AI model - Check connection';
                statusDiv.textContent = 'Model loading failed - check network connection';
                statusDiv.className = 'status inactive';
                
                // Notify React Native about the error
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'model-error',
                    error: error.message
                }));
            }
        };

        // Process image frame for gesture recognition
        async function processFrame(imageData) {
            if (!gestureRecognizer || isProcessing) return;
            
            isProcessing = true;
            
            try {
                // Create image element from base64
                const img = new Image();
                img.onload = async () => {
                    try {
                        // Update overlay canvas size to match image (with throttling)
                        if (overlay.width !== img.width || overlay.height !== img.height) {
                            overlay.width = img.width;
                            overlay.height = img.height;
                        }
                        
                        // Run gesture recognition
                        const results = await gestureRecognizer.recognize(img);
                        
                        // Clear previous drawings efficiently
                        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
                        
                        // Draw hand landmarks with reduced complexity
                        if (results.landmarks && results.landmarks.length > 0) {
                            const drawingUtils = new DrawingUtils(overlayCtx);
                            
                            for (const landmarks of results.landmarks) {
                                // Simplified drawing for better performance
                                drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
                                    color: "#00FF00",
                                    lineWidth: 2 // Reduced line width
                                });
                                drawingUtils.drawLandmarks(landmarks, {
                                    color: "#FF0000",
                                    lineWidth: 1 // Reduced line width
                                });
                            }
                        }
                        
                        // Display gesture results with throttling
                        if (results.gestures && results.gestures.length > 0) {
                            gestureOutput.style.display = "block";
                            const categoryName = results.gestures[0][0].categoryName;
                            const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(0); // Less precision
                            gestureOutput.innerText = \`✋ \${categoryName} (\${categoryScore}%)\`;
                        } else {
                            gestureOutput.style.display = "none";
                        }
                        
                        isProcessing = false;
                    } catch (drawError) {
                        console.error('Drawing error:', drawError);
                        isProcessing = false;
                    }
                };
                
                img.onerror = () => {
                    isProcessing = false;
                };
                
                img.src = "data:image/jpeg;base64," + imageData;
            } catch (error) {
                console.error('Error processing frame:', error);
                isProcessing = false;
            }
        }

        // Throttle frame processing to prevent lag
        let lastProcessTime = 0;
        const PROCESS_THROTTLE = 300; // Process at most every 300ms

        // Listen for messages from React Native
        document.addEventListener("message", function(event) {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type === "camera-frame") {
                    const now = Date.now();
                    
                    // Show the camera frame immediately for smooth visual feedback
                    cameraFrame.src = "data:image/jpeg;base64," + payload.data;
                    cameraFrame.style.display = 'block';
                    placeholder.style.display = 'none';
                    
                    console.log('Received camera frame at:', now);
                    statusDiv.textContent = 'Camera Active - Receiving frames';
                    statusDiv.className = 'status active';
                    
                    // Throttle AI processing to prevent lag
                    if (now - lastProcessTime > PROCESS_THROTTLE) {
                        processFrame(payload.data);
                        lastProcessTime = now;
                        statusDiv.textContent = 'Analyzing...';
                        statusDiv.className = 'status active';
                    }
                } else if (payload.type === "camera-disabled") {
                    console.log('Camera disabled message received');
                    cameraFrame.style.display = 'none';
                    placeholder.style.display = 'block';
                    placeholder.textContent = 'Camera disabled';
                    gestureOutput.style.display = 'none';
                    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
                    statusDiv.textContent = 'Camera disabled';
                    statusDiv.className = 'status inactive';
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        // For iOS WebView with same throttling
        window.addEventListener('message', function(event) {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type === "camera-frame") {
                    const now = Date.now();
                    
                    cameraFrame.src = "data:image/jpeg;base64," + payload.data;
                    cameraFrame.style.display = 'block';
                    placeholder.style.display = 'none';
                    
                    console.log('iOS: Received camera frame at:', now);
                    statusDiv.textContent = 'Camera Active - Receiving frames';
                    statusDiv.className = 'status active';
                    
                    // Throttle processing for iOS too
                    if (now - lastProcessTime > PROCESS_THROTTLE) {
                        processFrame(payload.data);
                        lastProcessTime = now;
                        statusDiv.textContent = 'Analyzing...';
                        statusDiv.className = 'status active';
                    }
                } else if (payload.type === "camera-disabled") {
                    console.log('iOS: Camera disabled message received');
                    cameraFrame.style.display = 'none';
                    placeholder.style.display = 'block';
                    placeholder.textContent = 'Camera disabled';
                    gestureOutput.style.display = 'none';
                    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
                    statusDiv.textContent = 'Camera disabled';
                    statusDiv.className = 'status inactive';
                }
            } catch (error) {
                console.error('Error handling iOS message:', error);
            }
        });

        // Initialize when page loads
        createGestureRecognizer();
    </script>
</body>
</html>
`;

export default function App() {
  const cameraRef = useRef(null);
  const webviewRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [facing, setFacing] = useState('front');
  const [showSplash, setShowSplash] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  // Optimized smooth frame capture without shutter effect
  useEffect(() => {
    let intervalId;
    let isProcessing = false;
    
    const captureLoop = async () => {
      if (cameraEnabled && cameraRef.current && !isProcessing) {
        isProcessing = true;
        try {
          const photo = await cameraRef.current.takePictureAsync({ 
            base64: true, 
            quality: 0.3, // Increased quality to ensure frames work
            skipProcessing: true, // Skip all processing for speed
            // Removed potentially problematic options
          });
          
          if (webviewRef.current && photo.base64) {
            webviewRef.current.postMessage(JSON.stringify({ 
              type: "camera-frame", 
              data: photo.base64 
            }));
          }
        } catch (error) {
          console.log('Camera capture error:', error);
        }
        isProcessing = false;
      }
    };
    
    if (cameraEnabled) {
      // Use setInterval with slightly slower frequency for stability
      intervalId = setInterval(captureLoop, 500); // Increased to 500ms for stability
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cameraEnabled]);

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    // The useEffect above will handle WebView messaging
  };

  const flipCamera = () => {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  };

  // Handle splash screen finish
  const handleSplashFinish = () => {
    setShowSplash(false);
    // Auto-enable camera when entering main app
    setCameraEnabled(true);
  };

  // Update WebView when camera state changes
  useEffect(() => {
    if (webviewRef.current) {
      if (cameraEnabled) {
        console.log('Camera enabled - should start receiving frames');
        // Don't send camera-disabled message when enabling
      } else {
        console.log('Camera disabled - notifying WebView');
        // Notify WebView that camera is disabled
        webviewRef.current.postMessage(JSON.stringify({ 
          type: "camera-disabled" 
        }));
      }
    }
  }, [cameraEnabled]);

  // Handle WebView messages for model status
  const handleWebViewMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      if (message.type === 'model-loaded') {
        setModelLoaded(true);
        setModelError(false);
      } else if (message.type === 'model-error') {
        setModelLoaded(false);
        setModelError(true);
      }
    } catch (error) {
      console.log('WebView message:', event.nativeEvent.data);
    }
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Hidden Native Camera Feed - runs in background */}
      <View style={styles.hiddenCameraSection}>
        {cameraEnabled && (
          <CameraView
            style={styles.hiddenCamera}
            facing={facing}
            ref={cameraRef}
            animateShutter={false}
          />
        )}
      </View>

      {/* Model Loading Overlay */}
      {!modelLoaded && !modelError && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <View style={styles.loadingIconContainer}>
              <Text style={styles.loadingIcon}>🤟</Text>
            </View>
            <Text style={styles.loadingTitle}>Signademy</Text>
            <Text style={styles.loadingText}>Loading AI Model...</Text>
            
            {/* Loading Bar */}
            <View style={styles.loadingBarContainer}>
              <View style={styles.loadingBar}>
                <View style={styles.loadingBarFill} />
              </View>
            </View>
            
            <Text style={styles.loadingSubtext}>Please wait while we prepare your sign language detection</Text>
          </View>
        </View>
      )}

      {/* Model Error Overlay */}
      {modelError && (
        <View style={styles.errorOverlay}>
          <View style={styles.errorContent}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorText}>Unable to load the AI model</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setModelError(false);
                // Reload WebView to retry
                if (webviewRef.current) {
                  webviewRef.current.reload();
                }
              }}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Sign Language Detection Interface */}
      <View style={styles.webviewSection}>
        <WebView
          ref={webviewRef}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlaybook={true}
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          onMessage={handleWebViewMessage}
        />
      </View>

      {/* Fixed Camera Controls */}
      {modelLoaded && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, cameraEnabled ? styles.cameraDisableButton : styles.cameraEnableButton]} 
            onPress={toggleCamera}
          >
            <Text style={styles.controlButtonText}>
              {cameraEnabled ? '🔴 Disable Camera' : '🟢 Enable Camera'}
            </Text>
          </TouchableOpacity>
          
          {cameraEnabled && (
            <TouchableOpacity 
              style={[styles.controlButton, styles.flipButton]} 
              onPress={flipCamera}
            >
              <Text style={styles.controlButtonText}>
                🔄 Flip to {facing === 'front' ? 'Back' : 'Front'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hiddenCameraSection: {
    position: 'absolute',
    top: -1000, // Hide off-screen
    left: -1000,
    width: 1,
    height: 1,
  },
  hiddenCamera: {
    width: 1,
    height: 1,
  },
  webviewSection: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  // Loading Overlay Styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  loadingIcon: {
    fontSize: 48,
    color: '#ffffff',
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 30,
    fontWeight: '500',
  },
  loadingBarContainer: {
    width: 250,
    marginBottom: 20,
  },
  loadingBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
    animation: 'loading 2s ease-in-out infinite',
    width: '70%',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Error Overlay Styles
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  errorContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Fixed Bottom Controls
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 30, // Extra padding for safe area
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraEnableButton: {
    backgroundColor: '#27ae60', // Green for enable
  },
  cameraDisableButton: {
    backgroundColor: '#e74c3c', // Red for disable
  },
  flipButton: {
    backgroundColor: '#4A90E2', // Blue for flip
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Legacy styles for backward compatibility
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});

// Splash Screen Styles
const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9ff',
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  handIcon: {
    fontSize: 56,
    color: '#ffffff',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
  },
  featureItem: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 80,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  getStartedButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#27ae60',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    fontSize: 24,
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    fontWeight: '500',
  },
});
