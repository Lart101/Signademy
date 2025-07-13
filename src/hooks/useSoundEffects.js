import { Audio } from 'expo-av';
import { useRef, useEffect } from 'react';

// Sound effect mappings - you'll place your actual sound files here
const SOUNDS = {
  // Feedback sounds (for correct/incorrect detection)
  correct: require('../../assets/sounds/feedback/correct.mp3'),
  incorrect: require('../../assets/sounds/feedback/incorrect.mp3'),
  success: require('../../assets/sounds/feedback/success.mp3'),
  completion: require('../../assets/sounds/feedback/completion.mp3'),
  
  // UI interaction sounds
  buttonPress: require('../../assets/sounds/ui/button_press.mp3'),
  buttonHover: require('../../assets/sounds/ui/button_hover.mp3'),
  pageSwipe: require('../../assets/sounds/ui/page_swipe.mp3'),
  cameraToggle: require('../../assets/sounds/ui/camera_toggle.mp3'),
  
  // Ambient/background sounds
  ambient: require('../../assets/sounds/ambient/learning_ambient.mp3'),
  countdown: require('../../assets/sounds/ui/countdown.mp3'),
};

export const useSoundEffects = () => {
  const soundObjects = useRef({});
  const isEnabled = useRef(true);

  useEffect(() => {
    // Configure audio mode for better mobile experience
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.warn('Audio configuration failed:', error);
      }
    };

    configureAudio();

    // Cleanup function
    return () => {
      Object.values(soundObjects.current).forEach(async (sound) => {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.warn('Error unloading sound:', error);
        }
      });
    };
  }, []);

  const loadSound = async (soundKey) => {
    if (soundObjects.current[soundKey]) {
      return soundObjects.current[soundKey];
    }

    try {
      const { sound } = await Audio.Sound.createAsync(SOUNDS[soundKey]);
      soundObjects.current[soundKey] = sound;
      return sound;
    } catch (error) {
      console.warn(`Failed to load sound ${soundKey}:`, error);
      return null;
    }
  };

  const playSound = async (soundKey, options = {}) => {
    if (!isEnabled.current) return;

    try {
      const sound = await loadSound(soundKey);
      if (sound) {
        // Stop and reset if already playing
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        
        // Apply options
        if (options.volume !== undefined) {
          await sound.setVolumeAsync(options.volume);
        }
        if (options.rate !== undefined) {
          await sound.setRateAsync(options.rate, true);
        }

        await sound.playAsync();
      }
    } catch (error) {
      console.warn(`Failed to play sound ${soundKey}:`, error);
    }
  };

  const stopSound = async (soundKey) => {
    try {
      const sound = soundObjects.current[soundKey];
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.warn(`Failed to stop sound ${soundKey}:`, error);
    }
  };

  const stopAllSounds = async () => {
    try {
      await Promise.all(
        Object.values(soundObjects.current).map(sound => sound.stopAsync())
      );
    } catch (error) {
      console.warn('Failed to stop all sounds:', error);
    }
  };

  const setEnabled = (enabled) => {
    isEnabled.current = enabled;
    if (!enabled) {
      stopAllSounds();
    }
  };

  const getIsEnabled = () => isEnabled.current;

  return {
    playSound,
    stopSound,
    stopAllSounds,
    setEnabled,
    getIsEnabled,
  };
};

// Convenience functions for common sound effects
export const useFeedbackSounds = () => {
  const { playSound } = useSoundEffects();

  return {
    playCorrect: (volume = 0.7) => playSound('correct', { volume }),
    playIncorrect: (volume = 0.5) => playSound('incorrect', { volume }),
    playSuccess: (volume = 0.8) => playSound('success', { volume }),
    playCompletion: (volume = 1.0) => playSound('completion', { volume }),
  };
};

export const useUISounds = () => {
  const { playSound } = useSoundEffects();

  return {
    playButtonPress: (volume = 0.3) => playSound('buttonPress', { volume }),
    playButtonHover: (volume = 0.2) => playSound('buttonHover', { volume }),
    playPageSwipe: (volume = 0.4) => playSound('pageSwipe', { volume }),
    playCameraToggle: (volume = 0.5) => playSound('cameraToggle', { volume }),
    playCountdown: (volume = 0.6) => playSound('countdown', { volume }),
  };
};
