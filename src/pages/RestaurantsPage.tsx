
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const RestaurantsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.restaurants')}</h1>
      <p className="mt-4">{t('restaurants.info')}</p>
      <Link
        to="/restaurant-suche"
        className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary/90 transition"
      >
        {t('restaurants.searchLink')}
      </Link>
    </div>
  );
};

export default RestaurantsPage;
