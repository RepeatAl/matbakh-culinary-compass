
import { useSafeT } from '@/hooks/useSafeT';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { I18nDebugger } from '@/components/i18n/I18nDebugger';

const Index = () => {
  const { t, ready } = useSafeT();

  // Fallback für noch nicht geladene Übersetzungen
  if (!ready) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            {t('welcome.title', 'Welcome to Matbakh')}
          </h1>
          <p className="text-2xl text-muted-foreground">
            {t('welcome.subtitle', 'Your culinary companion for sustainable cooking')}
          </p>
        </header>

        <LanguageSwitcher />

        <section className="my-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            {t('valueProposition.title', 'Our Value Proposition')}
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                {t('forSingles.title', 'For Singles')}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-card-foreground">
                <li>{t('forSingles.point1', 'Create personalized weekly meal plans')}</li>
                <li>{t('forSingles.point2', 'Generate smart shopping lists')}</li>
                <li>{t('forSingles.point3', 'Discover seasonal recipes')}</li>
              </ul>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                {t('forGastronomes.title', 'For Gastronomes')}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-card-foreground">
                <li>{t('forGastronomes.point1', 'Professional resource management')}</li>
                <li>{t('forGastronomes.point2', 'Waste reduction strategies')}</li>
                <li>{t('forGastronomes.point3', 'Cost optimization tools')}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      
      <I18nDebugger />
    </div>
  );
};

export default Index;
