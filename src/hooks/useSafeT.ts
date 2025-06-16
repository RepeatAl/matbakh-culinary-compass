
import { useTranslation } from 'react-i18next';

export const useSafeT = (namespace?: string) => {
  const { t: originalT, ready, i18n } = useTranslation(namespace ? [namespace, 'translation'] : ['translation', 'devdashboard', 'contact', 'footer', 'legal']);
  
  const t = (key: string, fallback?: string) => {
    try {
      const result = originalT(key);
      // If translation is the same as key, it means no translation was found
      if (result === key && fallback) {
        return fallback;
      }
      return result;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return fallback || key;
    }
  };

  return { t, ready, i18n };
};
