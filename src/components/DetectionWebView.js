import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { mainStyles } from '../styles/MainStyles';
import { webViewHTML } from '../webview/MediaPipeHTML';

const DetectionWebView = ({ onMessage, webViewRef, modelPath }) => {
  // Send model path when WebView loads or when modelPath changes
  const sendModelPath = () => {
    if (webViewRef.current && modelPath) {
      console.log('Sending model path to WebView:', modelPath);
      webViewRef.current.postMessage(JSON.stringify({
        type: 'change-model',
        modelPath: modelPath
      }));
    }
  };

  // Send model change message when modelPath changes
  useEffect(() => {
    sendModelPath();
  }, [modelPath, webViewRef]);

  // Handle WebView load - send model path once loaded
  const handleWebViewLoad = () => {
    console.log('WebView loaded, sending model path...');
    // Small delay to ensure WebView is ready
    setTimeout(() => {
      sendModelPath();
    }, 100);
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ html: webViewHTML }}
      style={mainStyles.webview}
      onMessage={onMessage}
      onLoad={handleWebViewLoad}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      originWhitelist={['*']}
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowUniversalAccessFromFileURLs={true}
      mixedContentMode="compatibility"
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
    />
  );
};

export default DetectionWebView;
