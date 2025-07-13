import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { splashStyles } from '../styles/MainStyles';

const { width, height } = Dimensions.get('window');

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

export default SplashScreen;
