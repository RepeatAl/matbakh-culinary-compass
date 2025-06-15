
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  // Text mit Umbrüchen
  const description = t("about.description")
    .split("\n")
    .map((para, i) => (
      <p className="mt-4" key={i}>{para}</p>
    ));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.about')}</h1>
      {description}
    </div>
  );
};

export default AboutPage;
