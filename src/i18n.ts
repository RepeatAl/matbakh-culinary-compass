
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Development-Mode Cache-Cleanup
if (import.meta.env.DEV) {
  // Clear potentially corrupted i18next localStorage entries
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('i18next') || key.includes('translation'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log('🧹 i18n: Cleared localStorage cache in development mode');
}

i18n
  .use(HttpApi) // Lädt Übersetzungen von einem Server (z.B. /public/locales)
  .use(LanguageDetector) // Erkennt die Benutzersprache
  .use(initReactI18next) // Übergibt i18n Instanz an react-i18next
  .init({
    supportedLngs: ['de', 'en', 'es', 'fr'],
    fallbackLng: 'en', // Stabilisiert auf Englisch als einzigen Fallback
    debug: import.meta.env.DEV, // Debug-Ausgaben nur im Entwicklungsmodus
    
    // Optimierte Detection-Order: User-Präferenz hat Vorrang
    detection: {
      order: ['localStorage', 'cookie', 'sessionStorage', 'querystring', 'navigator', 'htmlTag'],
      caches: import.meta.env.DEV ? [] : ['localStorage', 'cookie'], // Dev: keine Cache-Persistierung
      lookupLocalStorage: 'i18nextLng',
    },
    
    interpolation: {
      escapeValue: false, // React erledigt bereits das Escaping
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Multi-Namespace Support
      
      // Force-Reload für Development + Cache-Buster
      requestOptions: {
        cache: import.meta.env.DEV ? 'no-cache' : 'default',
        headers: import.meta.env.DEV ? {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        } : {}
      },
      
      // Query-Parameter Cache-Buster in Development
      queryStringParams: import.meta.env.DEV ? {
        v: Date.now().toString()
      } : {},
      
      // Aggressive Retry-Politik für Development
      crossDomain: true,
      withCredentials: false
    },
    
    // Performance-Optimierung für Production, Zuverlässigkeit für Development
    load: 'languageOnly', // Lädt nur 'en' statt 'en-US', 'en-GB' etc.
    preload: import.meta.env.DEV ? ['en'] : ['en', 'de'], // Dev: nur Basis-Sprache vorladen
    
    // Multi-Namespace Konfiguration (Future-Proof)
    defaultNS: 'translation', // Backward-Compatibility für bestehende t() calls
    ns: [
      'translation',    // Hauptnamespace (bestehende Komponenten)
      'legal',         // Legal-Pages (Imprint, Privacy, Terms)  
      'footer',        // Footer-spezifische Texte
      'navigation',    // Navigation & Sidebar
      'profile',       // Profil-bezogene Inhalte
      'nutrition',     // Ernährungs-spezifische Texte
      'recipes',       // Rezept-bezogene Inhalte
      'restaurants',   // Restaurant-bezogene Inhalte
      'common'         // Gemeinsame UI-Elemente (Buttons, etc.)
    ],
    
    // Development: Aggressives Error-Handling
    saveMissing: false,
    updateMissing: false,
    
    // React-spezifische Optimierungen
    react: {
      useSuspense: false // Verhindert Suspense-Probleme
    },
    
    // Development-Overrides für Cache-Probleme
    ...(import.meta.env.DEV && {
      initImmediate: false, // Erlaubt manuelles Laden
      cleanCode: true, // Bereinigt Code bei jedem Load
      
      // Fallback-Strategien bei Load-Fehlern
      partialBundledLanguages: false,
      nonExplicitSupportedLngs: false
    })
  });

// Development: Force-Reload bei Cache-Problemen
if (import.meta.env.DEV) {
  i18n.on('failedLoading', (lng, ns, msg) => {
    console.warn(`🔄 i18n: Retrying load for ${lng}/${ns} due to: ${msg}`);
    // Force-reload nach kurzem Timeout
    setTimeout(() => {
      i18n.reloadResources(lng, ns);
    }, 100);
  });
  
  i18n.on('loaded', (loaded) => {
    console.log('✅ i18n: Successfully loaded resources:', Object.keys(loaded));
  });
}

export default i18n;
