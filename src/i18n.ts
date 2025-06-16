
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
    fallbackLng: 'en', // Einfacher String statt Array
    debug: import.meta.env.DEV, // Debug-Ausgaben im Entwicklungsmodus
    detection: {
      order: ['localStorage', 'cookie', 'querystring', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false, // React erledigt bereits das Escaping
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Pfad zu den Übersetzungsdateien
    },
  });

export default i18n;
