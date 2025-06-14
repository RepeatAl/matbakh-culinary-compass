
import { useTranslation } from 'react-i18next';

const RestaurantsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.restaurants')}</h1>
      <p className="mt-4">Content for the Restaurants page will go here.</p>
    </div>
  );
};

export default RestaurantsPage;
