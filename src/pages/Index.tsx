
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher'; // Importiere den LanguageSwitcher
import { Button } from '@/components/ui/button'; // Beispiel für Button, falls benötigt

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('welcome.title')}</h1>
          <p className="text-2xl text-muted-foreground">{t('welcome.subtitle')}</p>
        </header>

        <LanguageSwitcher /> {/* Füge den LanguageSwitcher hinzu */}

        <section className="my-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">{t('valueProposition.title')}</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-primary">{t('forSingles.title')}</h3>
              <ul className="list-disc list-inside space-y-2 text-card-foreground">
                <li>{t('forSingles.point1')}</li>
                <li>{t('forSingles.point2')}</li>
                <li>{t('forSingles.point3')}</li>
              </ul>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-primary">{t('forGastronomes.title')}</h3>
              <ul className="list-disc list-inside space-y-2 text-card-foreground">
                <li>{t('forGastronomes.point1')}</li>
                <li>{t('forGastronomes.point2')}</li>
                <li>{t('forGastronomes.point3')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Beispiel für weitere Abschnitte oder einen Call to Action Button */}
        {/*
        <section className="text-center my-16">
          <Button size="lg">{t('cta.learnMore', 'Erfahre mehr')}</Button>
        </section>
        */}
      </div>
    </div>
  );
};

export default Index;
