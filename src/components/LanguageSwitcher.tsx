
import React from 'react';
import { useSafeT } from '@/hooks/useSafeT';
import type { TranslationKey } from '@/i18n/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const languages = [
  { code: 'de', nameKey: 'languages.de' },
  { code: 'en', nameKey: 'languages.en' },
  { code: 'es', nameKey: 'languages.es' },
  { code: 'fr', nameKey: 'languages.fr' },
];

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useSafeT();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col items-start space-y-2 my-4">
      <Label htmlFor="language-select">{t('languageSwitcher.label', 'Choose language')}</Label>
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger id="language-select" className="w-[180px]">
          <SelectValue placeholder={t('languageSwitcher.selectedLabel', 'Language')} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {t(lang.nameKey as TranslationKey, lang.code.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
