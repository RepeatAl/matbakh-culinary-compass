
import { useSafeT } from "@/hooks/useSafeT";

const Terms = () => {
  const { t } = useSafeT();
  
  return (
    <main className="container mx-auto px-4 py-8 prose dark:prose-invert">
      <h1>{t("legal:terms.title", "Allgemeine Geschäftsbedingungen")}</h1>
      
      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Leistungen der Matbakh UG (haftungsbeschränkt) gegenüber ihren Nutzern.
      </p>
      
      <h2>§ 2 Leistungsumfang</h2>
      <p>
        Matbakh stellt eine Plattform für Ernährungsplanung und Rezeptverwaltung zur Verfügung. Die Basis-Funktionen sind kostenlos nutzbar.
      </p>
      
      <h2>§ 3 Nutzungsrechte</h2>
      <p>
        Der Nutzer erhält ein nicht-exklusives, nicht-übertragbares Recht zur Nutzung der Plattform im Rahmen der bereitgestellten Funktionen.
      </p>
      
      <h2>§ 4 Datenschutz</h2>
      <p>
        Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den gesetzlichen Bestimmungen.
      </p>
      
      <h2>§ 5 Haftung</h2>
      <p>
        Matbakh haftet nur für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen. Die Ernährungsempfehlungen ersetzen keine medizinische Beratung.
      </p>
      
      <h2>§ 6 Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
      </p>
    </main>
  );
};

export default Terms;
