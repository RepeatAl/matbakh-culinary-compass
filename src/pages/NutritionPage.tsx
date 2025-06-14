
import { useTranslation } from 'react-i18next';

const NutritionPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.nutrition')}</h1>
      <p className="mt-4">Content for the Nutrition page will go here.</p>
    </div>
  );
};

export default NutritionPage;
