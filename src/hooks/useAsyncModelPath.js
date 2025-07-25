import { useState, useEffect } from 'react';
import { getModelPathAsync } from '../config/ModelConfig';

export const useAsyncModelPath = (category) => {
  const [modelPath, setModelPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadModelPath = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const path = await getModelPathAsync(category);
        
        if (isMounted) {
          setModelPath(path);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading model path:', err);
        
        if (isMounted) {
          // Check if this is a "download required" error
          const isDownloadRequired = err.message.includes('download') || err.message.includes('Download');
          setError({
            message: err.message,
            isDownloadRequired,
            category
          });
          setLoading(false);
        }
      }
    };

    loadModelPath();

    return () => {
      isMounted = false;
    };
  }, [category]);

  return { modelPath, loading, error };
};

export default useAsyncModelPath;
