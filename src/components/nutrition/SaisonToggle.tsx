
import { useState } from "react";
import { useSafeT } from "@/hooks/useSafeT";

/**
 * Saisonaler Toggle: Verbesserte UI mit Card-Design und responsivem Layout
 */
export default function SaisonToggle() {
  const { t } = useSafeT();
  const [isSeasonal, setIsSeasonal] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
      {/* Beschriftung */}
      <span className="text-base font-medium text-gray-700 dark:text-gray-200">
        {t('nutrition.season.info', 'Saison auswählen')}
      </span>
      
      {/* Toggle-Optionen */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setIsSeasonal(false)}
          className={`px-4 py-2 rounded-lg transition-all ${
            !isSeasonal 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
          }`}
        >
          {t('nutrition.season.wholeyear', 'Ganzjährig')}
        </button>
        <button
          type="button"
          onClick={() => setIsSeasonal(true)}
          className={`px-4 py-2 rounded-lg transition-all ${
            isSeasonal 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
          }`}
        >
          {t('nutrition.season.seasonal', 'Saisonal')}
        </button>
      </div>
    </div>
  );
}
