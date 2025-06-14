
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col items-start space-y-2 my-4">
      <Label htmlFor="language-select">{t('languageSwitcher.label')}</Label>
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger id="language-select" className="w-[180px]">
          <SelectValue placeholder={t('languageSwitcher.selectedLabel')} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {t(lang.nameKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
