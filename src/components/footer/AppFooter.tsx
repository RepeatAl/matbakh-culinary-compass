
import { Link } from "react-router-dom";
import { useSafeT } from "@/hooks/useSafeT";

const AppFooter = () => {
  const { t } = useSafeT();

  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground border-t mt-16">
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        {/* Spalte 1: Copyright */}
        <div>
          <p className="font-semibold">
            © {year} Matbakh UG (haftungsbeschränkt)
          </p>
          <p>{t("footer.headquarters", "Headquarters: Munich, Germany")}</p>
        </div>

        {/* Spalte 2: Rechtliches */}
        <div className="space-y-2">
          <h3 className="font-semibold">
            {t("footer.legalTitle", "Legal")}
          </h3>
          <nav className="flex flex-col space-y-1">
            <Link to="/imprint" className="hover:underline">
              {t("footer.imprint", "Impressum")}
            </Link>
            <Link to="/privacy" className="hover:underline">
              {t("footer.privacy", "Privacy Policy")}
            </Link>
            <Link to="/terms" className="hover:underline">
              {t("footer.terms", "Terms & Conditions")}
            </Link>
          </nav>
        </div>

        {/* Spalte 3: DSGVO-Hinweis */}
        <div>
          <h3 className="font-semibold">
            {t("footer.gdprTitle", "GDPR Notice")}
          </h3>
          <p className="text-sm">
            {t(
              "footer.gdprCopy",
              "Matbakh uses Google Maps for the restaurant search. The map is only loaded after you give consent in the cookie banner."
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
