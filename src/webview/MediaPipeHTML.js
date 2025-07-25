export const webViewHTML = `
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

        // Initialize the GestureRecognizer with dynamic model
        const createGestureRecognizer = async (modelPath) => {
            try {
                if (!modelPath) {
                    console.log('No model path provided, waiting...');
                    return;
                }
                
                const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
                
                console.log('Loading model from:', modelPath);
                
                // Check if this is a local file path or remote URL
                const isLocalFile = modelPath.startsWith('file://') || modelPath.includes('/models/');
                
                let modelAssetPath = modelPath;
                
                // For local files, we need to ensure proper handling
                if (isLocalFile) {
                    console.log('Using local model file:', modelPath);
                    // Convert to proper file URI if needed
                    if (!modelPath.startsWith('file://')) {
                        modelAssetPath = 'file://' + modelPath;
                    }
                    console.log('Local model path prepared:', modelAssetPath);
                } else {
                    console.log('Using remote model URL:', modelPath);
                    // For remote URLs, add offline prevention check
                    if (!navigator.onLine) {
                        throw new Error('No internet connection available for remote model');
                    }
                }
                
                gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: modelAssetPath,
                        delegate: "GPU"
                    },
                    runningMode: "IMAGE"
                });
                
                loadingDiv.style.display = 'none';
                statusDiv.textContent = isLocalFile ? 'Offline Model Ready!' : 'Online Model Ready!';
                statusDiv.className = 'status active';
                console.log(\`\${isLocalFile ? 'Local' : 'Remote'} ASL model initialized successfully\`);
                
                // Notify React Native that model is loaded
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'model-loaded',
                    modelPath: modelPath,
                    isLocal: isLocalFile
                }));
            } catch (error) {
                console.error('Error loading model:', error);
                loadingDiv.textContent = 'Error loading AI model';
                statusDiv.textContent = \`Model loading failed: \${error.message}\`;
                statusDiv.className = 'status inactive';
                
                // Notify React Native about the error
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'model-error',
                    error: 'Failed to load model: ' + modelPath + ' (' + (error.message || error) + ')',
                    modelPath: modelPath
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
                        
                        // Send gesture detection results to React Native
                        if (results.gestures && results.gestures.length > 0) {
                            gestureOutput.style.display = "block";
                            const categoryName = results.gestures[0][0].categoryName;
                            const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(0);
                            gestureOutput.innerText = \`✋ \${categoryName} (\${categoryScore}%)\`;
                            
                            // Notify React Native about detected gesture
                            window.ReactNativeWebView?.postMessage(JSON.stringify({
                                type: 'gesture-detected',
                                gesture: categoryName,
                                confidence: categoryScore
                            }));
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
                } else if (payload.type === "change-model") {
                    console.log('Changing model to:', payload.modelPath);
                    loadingDiv.style.display = 'block';
                    loadingDiv.textContent = 'Loading new model...';
                    statusDiv.textContent = 'Loading model...';
                    statusDiv.className = 'status inactive';
                    createGestureRecognizer(payload.modelPath);
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        // For iOS WebView with same throttling and model switching
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
                } else if (payload.type === "change-model") {
                    console.log('iOS: Changing model to:', payload.modelPath);
                    loadingDiv.style.display = 'block';
                    loadingDiv.textContent = 'Loading new model...';
                    statusDiv.textContent = 'Loading model...';
                    statusDiv.className = 'status inactive';
                    createGestureRecognizer(payload.modelPath);
                }
            } catch (error) {
                console.error('Error handling iOS message:', error);
            }
        });

        // Don't initialize automatically - wait for model path from React Native
        console.log('WebView ready, waiting for model path...');
        statusDiv.textContent = 'Waiting for model...';
        statusDiv.className = 'status inactive';
    </script>
</body>
</html>
`;
