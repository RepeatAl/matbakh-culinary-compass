
import { useSafeT } from '@/hooks/useSafeT';

const AboutPage = () => {
  const { t } = useSafeT();

  // Text mit Umbrüchen
  const description = t("about.description", "Learn more about Matbakh and our mission to transform the culinary experience.\n\nWe believe in sustainable cooking and smart resource management.")
    .split("\n")
    .map((para, i) => (
      <p className="mt-4" key={i}>{para}</p>
    ));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.about', 'About')}</h1>
      {description}
    </div>
  );
};

export default AboutPage;
