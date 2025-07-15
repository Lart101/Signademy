import React, { useState } from 'react';
import { View } from 'react-native';

// Import screens
import HomeScreen from './HomeScreen';
import LearningScreen from './LearningScreen';
import PracticeScreen from './PracticeScreen';
import LettersLearningScreen from './LettersLearningScreen';
import ModelDownloadScreen from './ModelDownloadScreen';

// Import existing components for fallback
import SplashScreen from '../components/SplashScreen';

const AppNavigation = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigateToHome = () => {
    setCurrentScreen('home');
    setSelectedCategory(null);
  };

  const navigateToLearning = (category) => {
    setSelectedCategory(category);
    setCurrentScreen('learning');
  };

  const navigateToLettersLearning = () => {
    setCurrentScreen('letters-learning');
  };

  const navigateToPractice = () => {
    setCurrentScreen('practice');
  };

  const navigateToQuiz = () => {
    // Coming soon - for now just show an alert or stay on home
    console.log('Quiz coming soon!');
  };

  const navigateToDownloads = () => {
    setCurrentScreen('downloads');
  };

  const handleSplashFinish = () => {
    setCurrentScreen('home');
  };

  const handleSelectCategory = (categoryOrMode) => {
    if (categoryOrMode === 'learn') {
      // Show category selection in learning mode - for now just use letters
      navigateToLearning({ id: 'letters' });
    } else if (typeof categoryOrMode === 'object') {
      // Direct category selection - check if it's letters for special handling
      if (categoryOrMode.id === 'letters') {
        navigateToLettersLearning();
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
            onBack={navigateToHome}
          />
        );
      
      case 'letters-learning':
        return (
          <LettersLearningScreen
            onBack={navigateToHome}
          />
        );
      
      case 'practice':
        return (
          <PracticeScreen
            onBack={navigateToHome}
          />
        );
      
      case 'downloads':
        return (
          <ModelDownloadScreen
            onBack={navigateToHome}
          />
        );
      
      default:
        return <HomeScreen onSelectCategory={handleSelectCategory} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderCurrentScreen()}
    </View>
  );
};

export default AppNavigation;
