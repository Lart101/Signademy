import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';

const LetterVideo = ({ letter, style, onVideoReady }) => {
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Get video source for the letter or number
  const getVideoSource = (character) => {
    // Load local video files from assets directory
    try {
      // For local assets in Expo, we need to use require() with dynamic imports
      // Since require() paths must be static, we'll use a mapping approach
      const videoMap = {
        // Letters A-Z
        'A': require('../../assets/sign_language_mp4/A.mp4'),
        'B': require('../../assets/sign_language_mp4/B.mp4'),
        'C': require('../../assets/sign_language_mp4/C.mp4'),
        'D': require('../../assets/sign_language_mp4/D.mp4'),
        'E': require('../../assets/sign_language_mp4/E.mp4'),
        'F': require('../../assets/sign_language_mp4/F.mp4'),
        'G': require('../../assets/sign_language_mp4/G.mp4'),
        'H': require('../../assets/sign_language_mp4/H.mp4'),
        'I': require('../../assets/sign_language_mp4/I.mp4'),
        'J': require('../../assets/sign_language_mp4/J.mp4'),
        'K': require('../../assets/sign_language_mp4/K.mp4'),
        'L': require('../../assets/sign_language_mp4/L.mp4'),
        'M': require('../../assets/sign_language_mp4/M.mp4'),
        'N': require('../../assets/sign_language_mp4/N.mp4'),
        'O': require('../../assets/sign_language_mp4/O.mp4'),
        'P': require('../../assets/sign_language_mp4/P.mp4'),
        'Q': require('../../assets/sign_language_mp4/Q.mp4'),
        'R': require('../../assets/sign_language_mp4/R.mp4'),
        'S': require('../../assets/sign_language_mp4/S.mp4'),
        'T': require('../../assets/sign_language_mp4/T.mp4'),
        'U': require('../../assets/sign_language_mp4/U.mp4'),
        'V': require('../../assets/sign_language_mp4/V.mp4'),
        'W': require('../../assets/sign_language_mp4/W.mp4'),
        'X': require('../../assets/sign_language_mp4/X.mp4'),
        'Y': require('../../assets/sign_language_mp4/Y.mp4'),
        'Z': require('../../assets/sign_language_mp4/Z.mp4'),
        // Numbers 0-9
        '0': require('../../assets/sign_language_mp4/0.mp4'),
        '1': require('../../assets/sign_language_mp4/1.mp4'),
        '2': require('../../assets/sign_language_mp4/2.mp4'),
        '3': require('../../assets/sign_language_mp4/3.mp4'),
        '4': require('../../assets/sign_language_mp4/4.mp4'),
        '5': require('../../assets/sign_language_mp4/5.mp4'),
        '6': require('../../assets/sign_language_mp4/6.mp4'),
        '7': require('../../assets/sign_language_mp4/7.mp4'),
        '8': require('../../assets/sign_language_mp4/8.mp4'),
        '9': require('../../assets/sign_language_mp4/9.mp4'),
      };
      
      return videoMap[character] || null;
    } catch (error) {
      console.log(`Could not load video for character ${character}:`, error);
      return null;
    }
  };

  const handleVideoError = (error) => {
    console.log(`Video error for character ${letter}:`, error);
    setHasError(true);
  };

  const handlePlaybackStatus = (status) => {
    if (status.isLoaded && onVideoReady) {
      onVideoReady();
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Check if we have a valid video source
  const videoSource = getVideoSource(letter);
  if (!videoSource || hasError) {
    return (
      <View style={[style, styles.placeholderContainer]}>
        <Text style={styles.placeholderIcon}>🎥</Text>
        <Text style={styles.placeholderTitle}>Video: {letter}.mp4</Text>
        <Text style={styles.placeholderSubtext}>
          Add video files to assets/sign_language_mp4/
        </Text>
        <Text style={styles.placeholderInstruction}>
          Watch how to sign "{letter}"
        </Text>
        
        {/* Demo placeholder with letter */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoLetter}>{letter}</Text>
          <Text style={styles.demoText}>Sign Language Demo</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.playButton}
          onPress={togglePlayback}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸️ Pause' : '▶️ Play'} Demo
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Video
      source={videoSource}
      style={style}
      shouldPlay={isPlaying}
      isLooping={true}
      isMuted={true}
      resizeMode="contain"
      onError={handleVideoError}
      onPlaybackStatusUpdate={handlePlaybackStatus}
    />
  );
};

const styles = {
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
  },
  placeholderInstruction: {
    fontSize: 14,
    color: '#5a6c7d',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  demoContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 120,
  },
  demoLetter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  playButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
};

export default LetterVideo;
