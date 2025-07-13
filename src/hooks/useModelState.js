import { useState, useEffect } from 'react';

export const useModelState = (modelPath = null) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [currentModelPath, setCurrentModelPath] = useState(modelPath);

  // Reset state when model path changes
  useEffect(() => {
    if (modelPath && modelPath !== currentModelPath) {
      setModelLoaded(false);
      setModelError(false);
      setCurrentModelPath(modelPath);
    }
  }, [modelPath, currentModelPath]);

  const handleWebViewMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      if (message.type === 'model-loaded') {
        console.log('Model loaded:', message.modelPath);
        setModelLoaded(true);
        setModelError(false);
        setCurrentModelPath(message.modelPath);
      } else if (message.type === 'model-error') {
        console.log('Model error:', message.error);
        setModelLoaded(false);
        setModelError(true);
      } else if (message.type === 'gesture-detected') {
        // Handle gesture detection for practice mode or other features
        console.log('Gesture detected:', message.gesture, 'Confidence:', message.confidence);
      }
      
      // Return the parsed message for further processing
      return message;
    } catch (error) {
      console.log('WebView message:', event.nativeEvent.data);
      return null;
    }
  };

  const retryModel = () => {
    setModelError(false);
    setModelLoaded(false);
    // WebView will automatically retry when reloaded
  };

  return {
    modelLoaded,
    modelError,
    handleWebViewMessage,
    retryModel,
    currentModelPath
  };
};
