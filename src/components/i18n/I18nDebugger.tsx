
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const I18nDebugger: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showDebugger, setShowDebugger] = useState(false);
  
  // Nur im Development-Modus und wenn URL-Parameter gesetzt
  const isDebugMode = import.meta.env.DEV && new URLSearchParams(window.location.search).has('debug-i18n');
  
  if (!isDebugMode) return null;

  const testKeys = [
    'profile.title',
    'profile.save',
    'profile.goals.weight_loss',
    'profile.favorite_foods.label',
    'nutrition.calc.title',
    'nutrition.calc.gender.male',
    'non.existing.key'
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebugger(!showDebugger)}
        className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg"
      >
        🔍 i18n Debug
      </button>
      
      {showDebugger && (
        <div className="absolute bottom-12 right-0 w-80 bg-white border rounded-md shadow-xl p-4 text-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">i18n Debug Panel</h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              Lang: {i18n.language}
            </span>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testKeys.map(key => {
              const translation = t(key);
              const isMissing = translation === key;
              
              return (
                <div key={key} className={`p-2 rounded border-l-2 ${
                  isMissing ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'
                }`}>
                  <div className="font-mono text-xs text-gray-600">{key}</div>
                  <div className={`mt-1 ${isMissing ? 'text-red-700' : 'text-green-700'}`}>
                    {isMissing ? '❌ Missing' : `✅ "${translation}"`}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 pt-2 border-t text-xs text-gray-500">
            💡 Tipp: Fehlende Keys werden in der Console protokolliert
          </div>
        </div>
      )}
    </div>
  );
};
