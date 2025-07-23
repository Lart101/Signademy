import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const BackButton = ({ onPress, title = "Back", style = {}, textStyle = {} }) => {
  return (
    <TouchableOpacity 
      style={[styles.backButton, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={title + " button"}
      accessibilityRole="button"
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <View style={styles.buttonContent}>
        <Text style={[styles.backArrow, textStyle]}>←</Text>
        <Text style={[styles.backText, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default BackButton;
