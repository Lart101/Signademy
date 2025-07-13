import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { mainStyles } from '../styles/MainStyles';
import { webViewHTML } from '../webview/MediaPipeHTML';

const DetectionWebView = ({ onMessage, webViewRef, modelPath }) => {
  // Send model change message when modelPath changes
  useEffect(() => {
    if (webViewRef.current && modelPath) {
      console.log('Sending model change message to WebView:', modelPath);
      webViewRef.current.postMessage(JSON.stringify({
        type: 'change-model',
        modelPath: modelPath
      }));
    }
  }, [modelPath, webViewRef]);

  return (
    <WebView
      ref={webViewRef}
      source={{ html: webViewHTML }}
      style={mainStyles.webview}
      onMessage={onMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      originWhitelist={['*']}
      mixedContentMode="compatibility"
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
    />
  );
};

export default DetectionWebView;
