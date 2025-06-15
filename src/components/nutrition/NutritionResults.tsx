
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ResultsProps {
  bmr: number;
  tdee: number;
  macros?: { carbs: {grams:number;ratio:number}, protein:{grams:number;ratio:number}, fat:{grams:number;ratio:number} }
}

export const NutritionResults: FC<ResultsProps> = ({ bmr, tdee, macros }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('nutrition.calc.result.title')}</CardTitle>
        <CardDescription>{t('nutrition.calc.result.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{t('nutrition.calc.result.bmr', { value: bmr })}</p>
        <p>{t('nutrition.calc.result.tdee', { value: tdee })}</p>
        {macros && (
          <div>
            <h4>{t('nutrition.calc.result.macros')}</h4>
            <ul>
              <li>
                {t('nutrition.calc.result.macroCarbs')}: {macros.carbs.grams}g ({macros.carbs.ratio}%)
              </li>
              <li>
                {t('nutrition.calc.result.macroProtein')}: {macros.protein.grams}g ({macros.protein.ratio}%)
              </li>
              <li>
                {t('nutrition.calc.result.macroFat')}: {macros.fat.grams}g ({macros.fat.ratio}%)
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
