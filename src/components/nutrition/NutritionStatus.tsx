
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";

interface StatusProps {
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
}

export const NutritionStatus: FC<StatusProps> = ({ isPending, isError, errorMessage }) => {
  const { t } = useTranslation();
  if (isPending) return <Spinner />;
  if (isError) return <Alert variant="destructive">{t(errorMessage || "nutrition.calc.error.fallback")}</Alert>;
  return null;
};
