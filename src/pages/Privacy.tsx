
import { useSafeT } from "@/hooks/useSafeT";

const Privacy = () => {
  const { t } = useSafeT();
  
  return (
    <main className="container mx-auto px-4 py-8 prose dark:prose-invert">
      <h1>{t("legal:privacy.title", "Datenschutzerklärung")}</h1>
      <h2>Verantwortliche Stelle</h2>
      <p>
        Matbakh UG (haftungsbeschränkt)<br />
        E-Mail: write [at] rabiebal [dot] com
      </p>
      
      <h2>Datenverarbeitung</h2>
      <p>
        Diese Website nutzt Supabase als Backend-Service. Personenbezogene Daten werden nur im erforderlichen Umfang und zweckgebunden verarbeitet.
      </p>
      
      <h2>Google Maps</h2>
      <p>
        Diese Website nutzt Google Maps zur Anzeige von Restaurantstandorten. Google Maps wird nur geladen, wenn Sie explizit zustimmen. Ohne Ihre Zustimmung werden keine Daten an Google übertragen.
      </p>
      
      <h2>Cookies</h2>
      <p>
        Wir verwenden technisch notwendige Cookies für die Grundfunktionen der Website sowie zur Speicherung Ihrer Cookie-Präferenzen.
      </p>
      
      <h2>Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit Ihrer persönlichen Daten. Kontaktieren Sie uns unter der oben genannten E-Mail-Adresse.
      </p>
    </main>
  );
};

export default Privacy;
