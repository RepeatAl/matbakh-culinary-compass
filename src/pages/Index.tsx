
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher'; // Importiere den LanguageSwitcher
import { Button } from '@/components/ui/button'; // Beispiel für Button, falls benötigt

const Index = () => {
  const { t, i18n, ready } = useTranslation();

  // Debug: Log aktuelle Sprache und ob Übersetzungen geladen sind
  console.log('Active language:', i18n.language);
  console.log('i18n ready:', ready);
  console.log('Translation welcome.title:', t('welcome.title'));

  // Helper für Fallback: Wenn noch nicht übersetzt, Ladeanzeige
  const isTranslated = (key: string) => {
    const translation = t(key);
    // Wenn der Rückgabewert gleich dem Key ist, dann nicht übersetzt
    return translation && translation !== key;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">
            {isTranslated('welcome.title') ? t('welcome.title') : <span className="animate-pulse text-gray-400">...</span>}
          </h1>
          <p className="text-2xl text-muted-foreground">
            {isTranslated('welcome.subtitle') ? t('welcome.subtitle') : <span className="animate-pulse text-gray-400">...</span>}
          </p>
        </header>

        <LanguageSwitcher /> {/* Füge den LanguageSwitcher hinzu */}

        <section className="my-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            {isTranslated('valueProposition.title') ? t('valueProposition.title') : <span className="animate-pulse text-gray-400">...</span>}
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                {isTranslated('forSingles.title') ? t('forSingles.title') : <span className="animate-pulse text-gray-400">...</span>}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-card-foreground">
                <li>
                  {isTranslated('forSingles.point1') ? t('forSingles.point1') : <span className="animate-pulse text-gray-400">...</span>}
                </li>
                <li>
                  {isTranslated('forSingles.point2') ? t('forSingles.point2') : <span className="animate-pulse text-gray-400">...</span>}
                </li>
                <li>
                  {isTranslated('forSingles.point3') ? t('forSingles.point3') : <span className="animate-pulse text-gray-400">...</span>}
                </li>
              </ul>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                {isTranslated('forGastronomes.title') ? t('forGastronomes.title') : <span className="animate-pulse text-gray-400">...</span>}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-card-foreground">
                <li>
                  {isTranslated('forGastronomes.point1') ? t('forGastronomes.point1') : <span className="animate-pulse text-gray-400">...</span>}
                </li>
                <li>
                  {isTranslated('forGastronomes.point2') ? t('forGastronomes.point2') : <span className="animate-pulse text-gray-400">...</span>}
                </li>
                <li>
                  {isTranslated('forGastronomes.point3') ? t('forGastronomes.point3') : <span className="animate-pulse text-gray-400">...</span>}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
