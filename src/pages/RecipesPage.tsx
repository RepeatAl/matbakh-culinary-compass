
import { useSafeT } from '@/hooks/useSafeT';

const RecipesPage = () => {
  const { t } = useSafeT();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.recipes', 'Recipes')}</h1>
      <p className="mt-4">{t('recipes.description', 'Discover amazing recipes from our community.')}</p>
    </div>
  );
};

export default RecipesPage;
