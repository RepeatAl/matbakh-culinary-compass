
import { useTranslation } from 'react-i18next';
import type { TranslationKey, SafeTFunction } from '@/types/i18n';

/**
 * Globaler Hook für sichere Übersetzungen mit einheitlichen Fallbacks
 * 
 * - Single Source of Truth für alle Translation-Logik
 * - Konsistente englische Fallbacks
 * - Einheitliche Debug-Ausgaben
 * - TypeScript-Sicherheit für Translation-Keys
 * - Verhindert "Drift" zwischen verschiedenen safeT-Implementierungen
 */
export function useSafeT() {
  const { t, i18n } = useTranslation();

  const safeT: SafeTFunction = (key: TranslationKey, fallback?: string) => {
    const translation = t(key);
    
    // Debug-Warnung nur im Development-Modus
    if (import.meta.env.DEV && translation === key && fallback) {
      console.warn(`🔍 i18n: Missing translation for "${key}" in language "${i18n.language}"`);
      return `${fallback} [${key}]`;
    }
    
    // Fallback nur wenn Translation fehlt
    return translation !== key ? translation : fallback || key;
  };

  return {
    t: safeT,
    i18n,
    ready: i18n.isInitialized,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage
  };
}
