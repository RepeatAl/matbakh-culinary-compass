
import { useSafeT } from "@/hooks/useSafeT";

const TermsPage = () => {
  const { t } = useSafeT();

  const paragraphs = t("legal:terms.body", "")
    .split("\n")
    .filter(p => p.trim())
    .map((p, i) => <p key={i} className="mt-4">{p}</p>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">
        {t("legal:terms.title", "Allgemeine Geschäftsbedingungen")}
      </h1>
      {paragraphs}
    </div>
  );
};

export default TermsPage;
