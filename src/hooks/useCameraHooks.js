import { useState, useEffect, useRef } from 'react';
import { useCameraPermissions as useExpoCameraPermissions } from 'expo-camera';

export const useCameraPermissions = () => {
  const [permission, requestPermission] = useExpoCameraPermissions();

  return { permission, requestPermission };
};

export const useCameraCapture = (cameraEnabled, webviewRef) => {
  const cameraRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let intervalId;
    let isProcessing = false;

    const captureLoop = async () => {
      if (!cameraRef.current || isProcessing) return;

      isProcessing = true;
      try {
        const photo = await cameraRef.current.takePictureAsync({ 
          base64: true, 
          quality: 0.3,
          skipProcessing: true,
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
    };
    
    if (cameraEnabled) {
      intervalId = setInterval(captureLoop, 500);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cameraEnabled]);

  // Notify WebView when camera state changes
  useEffect(() => {
    if (webviewRef.current) {
      if (cameraEnabled) {
        console.log('Camera enabled - should start receiving frames');
      } else {
        console.log('Camera disabled - notifying WebView');
        webviewRef.current.postMessage(JSON.stringify({ 
          type: "camera-disabled" 
        }));
      }
    }
  }, [cameraEnabled]);

  return { cameraRef };
};
