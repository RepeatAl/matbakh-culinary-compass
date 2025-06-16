
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const SUPPORTED_LANGUAGES = ['de', 'en', 'es', 'fr'];

// Farbige Console-Ausgaben
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function validateTranslations() {
  log('blue', '\n🔍 Validiere i18n Übersetzungen...\n');
  
  let hasErrors = false;
  const translations = {};
  
  // Lade alle Übersetzungsdateien
  for (const lang of SUPPORTED_LANGUAGES) {
    const filePath = path.join(LOCALES_DIR, lang, 'translation.json');
    if (!fs.existsSync(filePath)) {
      log('red', `❌ Fehlende Übersetzungsdatei: ${filePath}`);
      hasErrors = true;
      continue;
    }
    
    try {
      translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      log('green', `✅ ${lang}/translation.json geladen`);
    } catch (error) {
      log('red', `❌ Fehler beim Parsen von ${lang}/translation.json: ${error.message}`);
      hasErrors = true;
    }
  }
  
  if (hasErrors) {
    log('red', '\n❌ Abbruch wegen fehlender/defekter Dateien\n');
    process.exit(1);
  }
  
  // Sammle alle Keys von allen Sprachen
  const allKeys = new Set();
  const keysByLang = {};
  
  for (const [lang, data] of Object.entries(translations)) {
    const keys = getAllKeys(data);
    keysByLang[lang] = new Set(keys);
    keys.forEach(key => allKeys.add(key));
  }
  
  log('blue', `\n📊 Gefundene Keys insgesamt: ${allKeys.size}\n`);
  
  // Prüfe fehlende Keys pro Sprache
  let missingKeysFound = false;
  for (const lang of SUPPORTED_LANGUAGES) {
    const missingKeys = [...allKeys].filter(key => !keysByLang[lang].has(key));
    
    if (missingKeys.length > 0) {
      log('yellow', `⚠️  ${lang}: ${missingKeys.length} fehlende Keys:`);
      missingKeys.forEach(key => console.log(`   - ${key}`));
      console.log();
      missingKeysFound = true;
    } else {
      log('green', `✅ ${lang}: Alle Keys vorhanden`);
    }
  }
  
  // Prüfe doppelte Keys (sollten nicht vorkommen, aber sicherheitshalber)
  for (const lang of SUPPORTED_LANGUAGES) {
    const keys = getAllKeys(translations[lang]);
    const uniqueKeys = new Set(keys);
    if (keys.length !== uniqueKeys.size) {
      log('red', `❌ ${lang}: Doppelte Keys gefunden!`);
      hasErrors = true;
    }
  }
  
  // Zusammenfassung
  if (missingKeysFound) {
    log('yellow', '\n⚠️  Translation-Validierung mit Warnungen abgeschlossen');
    log('yellow', 'Tipp: Fehlende Keys sollten ergänzt werden für optimale UX');
  } else if (hasErrors) {
    log('red', '\n❌ Translation-Validierung fehlgeschlagen');
    process.exit(1);
  } else {
    log('green', '\n✅ Translation-Validierung erfolgreich - alle Keys synchron!');
  }
}

// Script ausführen
if (process.argv[1] === __filename) {
  validateTranslations();
}

export { validateTranslations };
