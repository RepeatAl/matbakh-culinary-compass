
import { Link } from "react-router-dom";
import { useSafeT } from "@/hooks/useSafeT";

const AppFooter = () => {
  const { t } = useSafeT();

  return (
    <footer className="border-t mt-8 px-4 py-6 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col md:flex-row gap-4 md:items-start">
        {/* Block 1 – Headquarter */}
        <div className="flex-1">
          <h2 className="font-semibold">
            {t("footer.headquarters", "Headquarters")}
          </h2>
          <p>Matbakh UG (haftungsbeschränkt)<br/>Munich, Germany</p>
        </div>

        {/* Block 2 – Links */}
        <div className="flex-1">
          <h2 className="font-semibold">
            {t("footer.legalTitle", "Legal")}
          </h2>
          <ul className="space-y-1">
            <li><Link to="/imprint" className="hover:underline">{t("footer.imprint", "Imprint")}</Link></li>
            <li><Link to="/privacy" className="hover:underline">{t("footer.privacy", "Privacy")}</Link></li>
            <li><Link to="/terms" className="hover:underline">{t("footer.terms", "Terms & Conditions")}</Link></li>
          </ul>
        </div>

        {/* Block 3 – GDPR Hinweis */}
        <div className="flex-1">
          <h2 className="font-semibold">
            {t("footer.gdprTitle", "GDPR")}
          </h2>
          <p>{t("footer.gdprCopy",
            "This website stores only technically required cookies. No personal data is shared with third parties without consent.")}</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
