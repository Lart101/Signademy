import { useState } from 'react';

export const useModelState = () => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);

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

  const retryModel = () => {
    setModelError(false);
    setModelLoaded(false);
    // WebView will automatically retry when reloaded
  };

  return {
    modelLoaded,
    modelError,
    handleWebViewMessage,
    retryModel
  };
};
