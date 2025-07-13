// Sound configuration for the app
export const SOUND_CONFIG = {
  // Volume levels (0.0 to 1.0)
  volumes: {
    feedback: {
      correct: 0.7,
      incorrect: 0.5,
      success: 0.8,
      completion: 1.0,
    },
    ui: {
      buttonPress: 0.3,
      buttonHover: 0.2,
      pageSwipe: 0.4,
      cameraToggle: 0.5,
      countdown: 0.6,
    },
    ambient: {
      learning: 0.2,
    }
  },

  // Enable/disable categories
  enabled: {
    feedback: true,
    ui: true,
    ambient: false, // Disabled by default for focus
  },

  // Playback settings
  fadeInDuration: 100, // ms
  fadeOutDuration: 200, // ms
  maxConcurrentSounds: 3,
};

// Sound event mappings for easier management
export const SOUND_EVENTS = {
  // Gesture detection
  CORRECT_GESTURE: 'correct',
  INCORRECT_GESTURE: 'incorrect',
  LEVEL_COMPLETE: 'success',
  COURSE_COMPLETE: 'completion',
  
  // User interactions
  BUTTON_PRESS: 'buttonPress',
  CAMERA_TOGGLE: 'cameraToggle',
  PAGE_NAVIGATION: 'pageSwipe',
  
  // System events
  APP_START: 'ambient',
  COUNTDOWN: 'countdown',
};

export default SOUND_CONFIG;
