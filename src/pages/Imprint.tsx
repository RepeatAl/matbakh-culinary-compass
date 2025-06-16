
import { useSafeT } from "@/hooks/useSafeT";

const Imprint = () => {
  const { t } = useSafeT();
  
  return (
    <main className="container mx-auto px-4 py-8 prose dark:prose-invert">
      <h1>{t("footer.imprint", "Impressum")}</h1>
      <p>
        Matbakh UG (haftungsbeschränkt)<br />
        Hauptsitz: München, Deutschland<br />
        E-Mail: write [at] rabiebal [dot] com
      </p>
      <p>
        Inhaltlich verantwortlich gemäß § 7 Abs.1 TMG für alle Inhalte dieser Website.
      </p>
      <p>
        Haftungsausschluss: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
      </p>
    </main>
  );
};

export default Imprint;
