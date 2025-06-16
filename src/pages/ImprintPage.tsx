
import { useSafeT } from "@/hooks/useSafeT";

const ImprintPage = () => {
  const { t } = useSafeT();

  const paragraphs = t("legal:imprint.body", "")
    .split("\n")
    .filter(p => p.trim())
    .map((p, i) => <p key={i} className="mt-4">{p}</p>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">
        {t("legal:imprint.title", "Impressum")}
      </h1>
      {paragraphs}
    </div>
  );
};

export default ImprintPage;
