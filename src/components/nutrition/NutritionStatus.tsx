
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "@/components/ui/alert";

interface StatusProps {
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
}

/**
 * Auto-generierter Spinner (Tailwind Animation), solange keine separate Komponente verfügbar ist!
 */
const InlineSpinner = () => (
  <div className="flex justify-center items-center my-2">
    <span className="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
  </div>
);

export const NutritionStatus: FC<StatusProps> = ({ isPending, isError, errorMessage }) => {
  const { t } = useTranslation();
  if (isPending) return <InlineSpinner />;
  if (isError) return <Alert variant="destructive">{t(errorMessage || "nutrition.calc.error.fallback")}</Alert>;
  return null;
};
