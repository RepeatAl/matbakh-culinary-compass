
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type RecipeFormActionsProps = {
  isEdit: boolean;
  onDelete?: () => void;
};

export default function RecipeFormActions({ isEdit, onDelete }: RecipeFormActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center gap-3 pt-2">
      <Button type="submit">{t("myRecipes.btnSave")}</Button>
      {isEdit && (
        <Button type="button" variant="destructive" onClick={onDelete}>
          {t("myRecipes.btnDelete")}
        </Button>
      )}
    </div>
  );
}
