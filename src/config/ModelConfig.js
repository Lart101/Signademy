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
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage//Asl14000imagePART3.task",
    localPath: "./assets/model/letters.task",
    name: "Letters (A-Z)",
    description: "Learn the alphabet in sign language",
    icon: "🔤",
    enabled: true,
  },
  [MODEL_CATEGORIES.NUMBERS]: {
    url: "https://rgxalrnmnlbmskupyhcm.supabase.co/storage/v1/object/public/signlanguage/numbers.task",
    localPath: "./assets/model/numbers.task", 
    name: "Numbers (1-20)",
    description: "Learn numbers in sign language",
    icon: "🔢",
    enabled: false, // Will be enabled when model is available
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
 * Get model path for a specific category
 */
export const getModelPath = (category) => {
  const model = MODEL_PATHS[category];
  if (!model) {
    throw new Error(`Model category '${category}' not found`);
  }
  return model.url; // Prefer cloud URL over local path
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
