
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

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
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    interpolation: {
      escapeValue: false, // React erledigt bereits das Escaping
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Pfad zu den Übersetzungsdateien
      
      // Retry-Mechanismus für stabilere Ladevorgänge
      requestOptions: {
        cache: 'default'
      }
    },
    
    // Performance-Optimierung
    load: 'languageOnly', // Lädt nur 'en' statt 'en-US', 'en-GB' etc.
    preload: ['en', 'de'], // Lädt die wichtigsten Sprachen vorab
    
    // Verhindert leere Namespaces
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Bessere Fehlerbehandlung
    saveMissing: false, // Keine automatischen Saves von fehlenden Keys
    updateMissing: false,
    
    // React-spezifische Optimierungen
    react: {
      useSuspense: false // Verhindert Suspense-Probleme
    }
  });

export default i18n;
