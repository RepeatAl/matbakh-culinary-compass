
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.about')}</h1>
      <p className="mt-4">Content for the About Us page will go here.</p>
    </div>
  );
};

export default AboutPage;
