
/**
 * Automatisch generierte TypeScript-Typen für i18n Keys
 * 
 * Basiert auf der Struktur von en/translation.json und stellt sicher,
 * dass nur existierende Translation-Keys verwendet werden können.
 */

// Rekursiver Typ-Generator für verschachtelte JSON-Strukturen
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>;
}[keyof TObj & (string | number)];

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}.${RecursiveKeyOf<TValue>}`
  : Text;

// Base Translation Interface - spiegelt die Struktur von en/translation.json wider
interface TranslationStructure {
  // App-weite Keys
  appTitle: string;
  common: {
    select: string;
  };
  
  // Navigation
  navigation: {
    sidebarHeader: string;
    profile: string;
    home: string;
    about: string;
    recipes: string;
    allRecipes: string;
    myRecipes: string;
    mealPlan: string;
    nutrition: string;
    restaurants: string;
    contact: string;
    login: string;
    logout: string;
  };
  
  // Welcome/Landing
  welcome: {
    title: string;
    subtitle: string;
  };
  valueProposition: {
    title: string;
  };
  forSingles: {
    title: string;
    point1: string;
    point2: string;
    point3: string;
  };
  forGastronomes: {
    title: string;
    point1: string;
    point2: string;
    point3: string;
  };
  
  // Profile
  profile: {
    title: string;
    save: string;
    saved: string;
    save_failed: string;
    loading: string;
    first_name: string;
    first_name_error: string;
    last_name: string;
    last_name_error: string;
    language_label: string;
    language_error: string;
    allergies: {
      label: string;
      gluten: string;
      lactose: string;
      nuts: string;
      soy: string;
      eggs: string;
      fish: string;
      shellfish: string;
      sesame: string;
      peanut: string;
      nightshades: string;
      histamine: string;
    };
    favorite_foods: {
      label: string;
    };
    disliked_foods: {
      label: string;
    };
    goals: {
      label: string;
      weight_loss: string;
      weight_maintenance: string;
      muscle_gain: string;
      high_protein: string;
      low_carb: string;
      vegan: string;
      vegetarian: string;
      keto: string;
      paleo: string;
      diabetic_friendly: string;
      heart_health: string;
      gut_health: string;
      anti_inflammatory: string;
      sustainable_eating: string;
      flexitarian: string;
      other: string;
    };
    health: {
      disclaimer: string;
    };
  };
  
  // Nutrition
  nutrition: {
    hero: {
      title: string;
      body: string;
    };
    disclaimer: string;
    recommendations: {
      title: string;
      noData: string;
      seeAll: string;
    };
    calc: {
      demo: {
        hint: string;
      };
      title: string;
      units: {
        label: string;
        placeholder: string;
        metric: string;
        imperial: string;
        hintWeight: string;
        hintHeight: string;
      };
      gender: {
        label: string;
        placeholder: string;
        male: string;
        female: string;
        other: string;
      };
      activity: {
        label: string;
        placeholder: string;
        sedentary: string;
        light: string;
        moderate: string;
        active: string;
        very_active: string;
      };
      weight: {
        label: string;
        lbs: string;
        placeholder: string;
      };
      height: {
        label: string;
        in: string;
        placeholder: string;
      };
      age: {
        label: string;
        placeholder: string;
      };
      submit: string;
      sending: string;
      error: {
        weight: string;
        height: string;
        age: string;
        gender: string;
        activity: string;
        units: string;
        fallback: string;
      };
      result: {
        title: string;
        bmr: string;
        tdee: string;
        macros: string;
        macroCarbs: string;
        macroProtein: string;
        macroFat: string;
        units: string;
      };
    };
    cta: {
      createProfile: string;
      info: string;
    };
    tiles: {
      fresh: {
        title: string;
        desc: string;
      };
      energy: {
        title: string;
        desc: string;
      };
      variety: {
        title: string;
        desc: string;
      };
      protein: {
        title: string;
        desc: string;
      };
    };
  };
  
  // Meal Plan
  mealPlan: {
    title: string;
    loading: string;
    error: string;
  };
  
  // Recipes
  myRecipes: {
    title: string;
    btnNew: string;
    btnEdit: string;
    loading: string;
    errorLoading: string;
    servings: string;
    published: string;
  };
  recipes: {
    description: string;
  };
  
  // Generic pages
  about: {
    description: string;
  };
  contact: {
    description: string;
  };
  restaurants: {
    info: string;
    searchLink: string;
  };
  
  // Footer
  footer: {
    headquarters: string;
    legalTitle: string;
    imprint: string;
    privacy: string;
    terms: string;
    gdprTitle: string;
    gdprCopy: string;
  };
  
  // Legal pages
  legal: {
    imprint: {
      title: string;
      body: string;
    };
    privacy: {
      title: string;
      body: string;
    };
    terms: {
      title: string;
      body: string;
    };
  };
  
  // Language switcher
  languageSwitcher: {
    label: string;
    selectedLabel: string;
  };
  languages: {
    de: string;
    en: string;
    es: string;
    fr: string;
  };
  
  // Cookie consent
  cookie: {
    message: string;
    accept: string;
    decline: string;
  };
}

// Generierter Union-Type für alle möglichen Translation-Keys
export type TranslationKey = RecursiveKeyOf<TranslationStructure>;

// Safe-T Function Interface mit TypeScript-Sicherheit
export interface SafeTFunction {
  (key: TranslationKey, fallback?: string): string;
}
