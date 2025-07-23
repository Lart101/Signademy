import React, { useState, useEffect } from 'react';
import { View, BackHandler, Alert } from 'react-native';

// Import screens
import HomeScreen from './HomeScreen';
import LearningScreen from './LearningScreen';
import PracticeScreen from './PracticeScreen';
import LettersLearningScreen from './LettersLearningScreen';
import NumbersLearningScreen from './NumbersLearningScreen';
import ModelDownloadScreen from './ModelDownloadScreen';

// Import existing components for fallback
import SplashScreen from '../components/SplashScreen';
import BackNavigationToast from '../components/BackNavigationToast';
import { useModelRequiredModal } from '../hooks/useModelRequiredModal';

const AppNavigation = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [navigationStack, setNavigationStack] = useState(['splash']);
  const [showBackToast, setShowBackToast] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);
  
  // Initialize model required modal for app-level navigation
  const { 
    checkAndShowModal, 
    ModelRequiredModalComponent 
  } = useModelRequiredModal(() => navigateToScreen('downloads'));

  // Helper function to navigate with stack management
  const navigateToScreen = (screenName, categoryData = null) => {
    setNavigationStack(prev => [...prev, screenName]);
    setCurrentScreen(screenName);
    if (categoryData) {
      setSelectedCategory(categoryData);
    }
    
    // Show back navigation toast on first navigation (except from splash)
    if (!hasShownToast && screenName !== 'splash' && screenName !== 'home') {
      setShowBackToast(true);
      setHasShownToast(true);
    }
  };

  // Helper function to go back in navigation stack
  const goBack = () => {
    if (navigationStack.length <= 1) {
      // If we're at the root, show exit confirmation
      Alert.alert(
        "Exit App",
        "Are you sure you want to exit the app?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "Exit",
            onPress: () => BackHandler.exitApp(),
            style: "destructive"
          }
        ]
      );
      return true; // Prevent default back action
    }

    // Remove current screen from stack and go to previous
    const newStack = navigationStack.slice(0, -1);
    const previousScreen = newStack[newStack.length - 1];
    
    setNavigationStack(newStack);
    setCurrentScreen(previousScreen);
    
    // Clear category data if going back to home or earlier
    if (previousScreen === 'home' || previousScreen === 'splash') {
      setSelectedCategory(null);
    }
    
    return true; // Prevent default back action
  };

  // Hardware back button handler
  useEffect(() => {
    const backAction = () => {
      return goBack();
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigationStack]);

  const navigateToHome = () => {
    setNavigationStack(['home']);
    setCurrentScreen('home');
    setSelectedCategory(null);
  };

  const navigateToLearning = (category) => {
    setSelectedCategory(category);
    navigateToScreen('learning', category);
  };

  const navigateToLettersLearning = () => {
    navigateToScreen('letters-learning');
  };

  const navigateToNumbersLearning = () => {
    navigateToScreen('numbers-learning');
  };

  const navigateToPractice = () => {
    navigateToScreen('practice');
  };

  const navigateToQuiz = () => {
    // Coming soon - for now just show an alert or stay on home
    console.log('Quiz coming soon!');
  };

  const navigateToDownloads = () => {
    navigateToScreen('downloads');
  };

  const handleSplashFinish = () => {
    setNavigationStack(['home']);
    setCurrentScreen('home');
  };

  const handleSelectCategory = (categoryOrMode) => {
    if (categoryOrMode === 'learn') {
      // Show category selection in learning mode - for now just use letters
      navigateToLearning({ id: 'letters' });
    } else if (typeof categoryOrMode === 'object') {
      // Direct category selection - check category type
      if (categoryOrMode.id === 'letters') {
        navigateToLettersLearning();
      } else if (categoryOrMode.id === 'numbers') {
        navigateToNumbersLearning();
      } else {
        navigateToLearning(categoryOrMode);
      }
    } else {
      // Handle other modes
      console.log('Selected:', categoryOrMode);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      
      case 'home':
        return (
          <HomeScreen
            onSelectCategory={handleSelectCategory}
            onStartPractice={navigateToPractice}
            onTakeQuiz={navigateToQuiz}
            onOpenDownloads={navigateToDownloads}
          />
        );
      
      case 'learning':
        return (
          <LearningScreen
            category={selectedCategory}
            onBack={goBack}
          />
        );
      
      case 'letters-learning':
        return (
          <LettersLearningScreen
            onBack={goBack}
          />
        );
      
      case 'numbers-learning':
        return (
          <NumbersLearningScreen
            onBack={goBack}
          />
        );
      
      case 'practice':
        return (
          <PracticeScreen
            onBack={goBack}
          />
        );
      
      case 'downloads':
        return (
          <ModelDownloadScreen
            onBack={goBack}
          />
        );
      
      default:
        return <HomeScreen onSelectCategory={handleSelectCategory} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderCurrentScreen()}
      <BackNavigationToast 
        visible={showBackToast} 
        onHide={() => setShowBackToast(false)} 
      />
      <ModelRequiredModalComponent />
    </View>
  );
};

export default AppNavigation;
