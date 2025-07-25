/**
 * Model Configuration Manager for Signademy
 * Manages different AI models for various sign language categories
 */

export const MODEL_CATEGORIES = {
  LETTERS: 'letters',
  NUMBERS: 'numbers', 
  GREETINGS: 'greetings',
  FAMILY: 'family',
  FOOD: 'food',
  EMOTIONS: 'emotions',
  COLORS: 'colors',
  ACTIONS: 'actions',
};

export const MODEL_PATHS = {
  [MODEL_CATEGORIES.LETTERS]: {
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage/letters.task",
    localPath: "./assets/model/letters.task",
    name: "Letters (A-Z)",
    description: "Learn the alphabet in sign language",
    icon: "🔤",
    enabled: true,
  },
  [MODEL_CATEGORIES.NUMBERS]: {
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage/numbers.task",
    localPath: "./assets/model/numbers.task", 
    name: "Numbers (0-9)",
    description: "Learn numbers in sign language",
    icon: "🔢",
    enabled: true, // Enabled - videos are available!
  },
  [MODEL_CATEGORIES.GREETINGS]: {
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage/greetings.task",
    localPath: "./assets/model/greetings.task",
    name: "Greetings",
    description: "Hello, goodbye, thank you, etc.",
    icon: "👋",
    enabled: false,
  },
  [MODEL_CATEGORIES.FAMILY]: {
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage/family.task",
    localPath: "./assets/model/family.task",
    name: "Family",
    description: "Mom, dad, sister, brother, etc.",
    icon: "👨‍👩‍👧‍👦",
    enabled: false,
  },
  [MODEL_CATEGORIES.FOOD]: {
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage/food.task",
    localPath: "./assets/model/food.task",
    name: "Food",
    description: "Common food and drink signs",
    icon: "🍎",
    enabled: false,
  },
  [MODEL_CATEGORIES.EMOTIONS]: {
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage/emotions.task",
    localPath: "./assets/model/emotions.task",
    name: "Emotions",
    description: "Happy, sad, angry, excited, etc.",
    icon: "😊",
    enabled: false,
  },
  [MODEL_CATEGORIES.COLORS]: {
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage/colors.task",
    localPath: "./assets/model/colors.task",
    name: "Colors",
    description: "Red, blue, green, yellow, etc.",
    icon: "🌈",
    enabled: false,
  },
  [MODEL_CATEGORIES.ACTIONS]: {
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage/actions.task",
    localPath: "./assets/model/actions.task",
    name: "Actions",
    description: "Run, walk, sit, stand, etc.",
    icon: "🏃",
    enabled: false,
  },
};

/**
 * Get all available model categories
 */
export const getAvailableCategories = () => {
  return Object.values(MODEL_CATEGORIES).map(category => ({
    id: category,
    ...MODEL_PATHS[category]
  }));
};

/**
 * Get enabled model categories only
 */
export const getEnabledCategories = () => {
  return getAvailableCategories().filter(category => category.enabled);
};

/**
 * Get model path for a specific category (sync version)
 */
export const getModelPath = (category) => {
  const model = MODEL_PATHS[category];
  if (!model) {
    throw new Error(`Model category '${category}' not found`);
  }
  return model.url; // Remote URL for sync usage
};

/**
 * Get model path for a specific category (async version that prioritizes local downloads)
 * This function will ONLY use local downloaded models to ensure offline functionality
 */
export const getModelPathAsync = async (category) => {
  const model = MODEL_PATHS[category];
  if (!model) {
    throw new Error(`Model category '${category}' not found`);
  }
  
  // Try to get local path first (MANDATORY for offline use)
  try {
    const ModelManagerModule = await import('../utils/ModelManager');
    const ModelManager = ModelManagerModule.default;
    
    // Use offline-first approach - will throw error if no local model
    const result = await ModelManager.getModelPathWithOfflineCheck(category);
    return result.path;
  } catch (error) {
    console.error('Local model not available:', error.message);
    
    // NO FALLBACK - Force user to download models
    throw new Error(`Model Download Required: ${model.name} model is not downloaded. Please download it to use this feature offline.`);
  }
};

/**
 * Get model path with fallback to online (use with caution - for emergency only)
 * This should only be used in development or as a last resort
 */
export const getModelPathWithFallback = async (category) => {
  try {
    return await getModelPathAsync(category);
  } catch (error) {
    console.warn('⚠️ FALLBACK TO ONLINE MODEL - This requires internet connection!');
    const model = MODEL_PATHS[category];
    return model?.url;
  }
};

/**
 * Get model info for a specific category
 */
export const getModelInfo = (category) => {
  return MODEL_PATHS[category];
};

/**
 * Check if a category is enabled
 */
export const isCategoryEnabled = (category) => {
  return MODEL_PATHS[category]?.enabled || false;
};

/**
 * Default category (currently available)
 */
export const DEFAULT_CATEGORY = MODEL_CATEGORIES.LETTERS;
