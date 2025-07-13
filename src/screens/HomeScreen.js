import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  SafeAreaView
} from 'react-native';
import { getEnabledCategories } from '../config/ModelConfig';

const { width } = Dimensions.get('window');

const HomeScreen = ({ onSelectCategory, onStartPractice, onTakeQuiz }) => {
  const enabledCategories = getEnabledCategories();
  const [activeTab, setActiveTab] = useState('home');

  const MenuCard = ({ title, description, icon, onPress, disabled = false }) => (
    <TouchableOpacity 
      style={[
        styles.menuCard,
        disabled && styles.menuCardDisabled
      ]}
      onPress={disabled ? null : onPress}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, disabled && styles.cardTextDisabled]}>
            {title}
          </Text>
          <Text style={[styles.cardDescription, disabled && styles.cardTextDisabled]}>
            {description}
          </Text>
        </View>
        {!disabled && (
          <Text style={styles.cardArrow}>▶</Text>
        )}
        {disabled && (
          <Text style={styles.comingSoon}>Soon</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const CategoryCard = ({ category, onPress }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => onPress(category)}
      activeOpacity={0.8}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text style={styles.categoryTitle}>{category.name}</Text>
      </View>
      <Text style={styles.categoryDescription}>{category.description}</Text>
    </TouchableOpacity>
  );

  const BottomNavigation = () => (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'home' && styles.navItemActive]}
        onPress={() => setActiveTab('home')}
      >
        <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>🏠</Text>
        <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'learn' && styles.navItemActive]}
        onPress={() => setActiveTab('learn')}
      >
        <Text style={[styles.navIcon, activeTab === 'learn' && styles.navIconActive]}>📚</Text>
        <Text style={[styles.navText, activeTab === 'learn' && styles.navTextActive]}>Learn</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'practice' && styles.navItemActive]}
        onPress={() => setActiveTab('practice')}
      >
        <Text style={[styles.navIcon, activeTab === 'practice' && styles.navIconActive]}>🎯</Text>
        <Text style={[styles.navText, activeTab === 'practice' && styles.navTextActive]}>Practice</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>🤟 Signademy</Text>
              <Text style={styles.subtitle}>Learn Sign Language</Text>
            </View>

            {/* Welcome Info Section */}
            <View style={styles.section}>
              <View style={styles.welcomeCard}>
                <Text style={styles.welcomeTitle}>👋 Welcome to Signademy!</Text>
                <Text style={styles.welcomeText}>
                  Start your journey into American Sign Language (ASL). Learn letters, practice with AI detection, and master sign language at your own pace.
                </Text>
                <View style={styles.welcomeFeatures}>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureIcon}>🤖</Text>
                    <Text style={styles.featureText}>AI-Powered Detection</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureIcon}>📱</Text>
                    <Text style={styles.featureText}>Easy to Use</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureIcon}>🎯</Text>
                    <Text style={styles.featureText}>Practice Mode</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Main Menu */}
            <View style={styles.section}>
              <MenuCard
                title="Start Learning"
                description="Choose a category to learn"
                icon="📚"
                onPress={() => onSelectCategory('learn')}
              />
              
              <MenuCard
                title="Practice Mode"
                description="Test your knowledge"
                icon="🎯"
                onPress={onStartPractice}
              />
              
              <MenuCard
                title="Take Quiz"
                description="Challenge yourself"
                icon="🧠"
                onPress={onTakeQuiz}
                disabled={true} // Coming soon
              />
            </View>
          </>
        );

      case 'learn':
        return (
          <>
            <View style={styles.tabHeader}>
              <Text style={styles.tabTitle}>📚 Learning Categories</Text>
              <Text style={styles.tabSubtitle}>Choose what you want to learn</Text>
            </View>

            <View style={styles.section}>
              {enabledCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onPress={onSelectCategory}
                />
              ))}
              
              {/* Coming Soon Categories */}
              <View style={styles.comingSoonSection}>
                <Text style={styles.comingSoonTitle}>🚀 Coming Soon</Text>
                <View style={styles.comingSoonGrid}>
                  <View style={styles.comingSoonItem}>
                    <Text style={styles.comingSoonIcon}>🔢</Text>
                    <Text style={styles.comingSoonText}>Numbers</Text>
                  </View>
                  <View style={styles.comingSoonItem}>
                    <Text style={styles.comingSoonIcon}>👋</Text>
                    <Text style={styles.comingSoonText}>Greetings</Text>
                  </View>
                  <View style={styles.comingSoonItem}>
                    <Text style={styles.comingSoonIcon}>👨‍👩‍👧‍👦</Text>
                    <Text style={styles.comingSoonText}>Family</Text>
                  </View>
                  <View style={styles.comingSoonItem}>
                    <Text style={styles.comingSoonIcon}>🍎</Text>
                    <Text style={styles.comingSoonText}>Food</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        );

      case 'practice':
        return (
          <>
            <View style={styles.tabHeader}>
              <Text style={styles.tabTitle}>🎯 Practice Mode</Text>
              <Text style={styles.tabSubtitle}>Test and improve your skills</Text>
            </View>

            <View style={styles.section}>
              <MenuCard
                title="Quick Practice"
                description="Random letters practice"
                icon="⚡"
                onPress={onStartPractice}
              />
              
              <MenuCard
                title="Timed Challenge"
                description="Beat the clock!"
                icon="⏰"
                onPress={() => console.log('Timed challenge coming soon')}
                disabled={true}
              />
              
              <MenuCard
                title="Custom Practice"
                description="Choose specific letters"
                icon="🎨"
                onPress={() => console.log('Custom practice coming soon')}
                disabled={true}
              />
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  tabHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  tabTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  tabSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Welcome Card Styles
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#5a6c7d',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  cardTextDisabled: {
    color: '#bdc3c7',
  },
  cardArrow: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  comingSoon: {
    fontSize: 12,
    color: '#e67e22',
    fontWeight: 'bold',
    backgroundColor: '#fdf2e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 36,
  },
  comingSoonSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 16,
    textAlign: 'center',
  },
  comingSoonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  comingSoonItem: {
    width: (width - 80) / 2 - 10,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fdf2e9',
    borderRadius: 12,
    marginBottom: 10,
  },
  comingSoonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#e67e22',
    fontWeight: '600',
  },
  // Bottom Navigation Styles
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#4A90E2',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navIconActive: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  navTextActive: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
};

export default HomeScreen;
