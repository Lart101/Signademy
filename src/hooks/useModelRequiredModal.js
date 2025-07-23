import { useState, useEffect } from 'react';
import ModelManager from '../utils/ModelManager';
import { MODEL_CATEGORIES } from '../config/ModelConfig';

export const useModelAvailability = () => {
  const [modelStatus, setModelStatus] = useState({
    letters: false,
    numbers: false,
    loading: true
  });

  const checkModelAvailability = async () => {
    try {
      setModelStatus(prev => ({ ...prev, loading: true }));
      
      const lettersAvailable = await ModelManager.isModelDownloaded(MODEL_CATEGORIES.LETTERS);
      const numbersAvailable = await ModelManager.isModelDownloaded(MODEL_CATEGORIES.NUMBERS);
      
      setModelStatus({
        letters: lettersAvailable,
        numbers: numbersAvailable,
        loading: false
      });
    } catch (error) {
      console.error('Error checking model availability:', error);
      setModelStatus({
        letters: false,
        numbers: false,
        loading: false
      });
    }
  };

  useEffect(() => {
    checkModelAvailability();
  }, []);

  const isModelAvailable = (category) => {
    if (category === MODEL_CATEGORIES.LETTERS || category === 'letters') {
      return modelStatus.letters;
    }
    if (category === MODEL_CATEGORIES.NUMBERS || category === 'numbers') {
      return modelStatus.numbers;
    }
    return false;
  };

  const refreshModelStatus = () => {
    checkModelAvailability();
  };

  return {
    modelStatus,
    isModelAvailable,
    refreshModelStatus,
    loading: modelStatus.loading
  };
};

export const useModelRequiredModal = (onNavigateToDownloads) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModelType, setCurrentModelType] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const { isModelAvailable, refreshModelStatus } = useModelAvailability();

  const checkAndShowModal = (category, featureName = 'this feature') => {
    const available = isModelAvailable(category);
    
    if (!available) {
      let modelType = '';
      let description = '';
      
      if (category === MODEL_CATEGORIES.LETTERS || category === 'letters') {
        modelType = 'Letters Recognition Model';
        description = `To use the Letters Learning feature, you need to download the AI model that recognizes sign language letters (A-Z).`;
      } else if (category === MODEL_CATEGORIES.NUMBERS || category === 'numbers') {
        modelType = 'Numbers Recognition Model';
        description = `To use the Numbers Learning feature, you need to download the AI model that recognizes sign language numbers (0-9).`;
      } else {
        modelType = 'AI Recognition Model';
        description = `To use ${featureName}, you need to download the required AI model for offline recognition.`;
      }
      
      setCurrentModelType(modelType);
      setCurrentDescription(description);
      setModalVisible(true);
      return false; // Model not available
    }
    
    return true; // Model available, proceed
  };

  const handleDownload = () => {
    setModalVisible(false);
    if (onNavigateToDownloads) {
      onNavigateToDownloads();
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const ModelRequiredModalComponent = ({ visible = modalVisible }) => {
    const ModelRequiredModal = require('../components/ModelRequiredModal').default;
    
    return (
      <ModelRequiredModal
        visible={visible}
        onClose={handleClose}
        onDownload={handleDownload}
        modelType={currentModelType}
        description={currentDescription}
      />
    );
  };

  return {
    checkAndShowModal,
    refreshModelStatus,
    ModelRequiredModalComponent,
    isModalVisible: modalVisible,
  };
};
