
/**
 * TypeScript-Definitionen für i18n Keys
 * 
 * Verhindert Tippfehler und stellt sicher, dass nur existierende
 * Translation-Keys verwendet werden.
 */

export type TranslationKey = 
  // App-weite Keys
  | 'appTitle'
  | 'common.select'
  
  // Navigation
  | 'navigation.sidebarHeader'
  | 'navigation.profile'
  | 'navigation.home'
  | 'navigation.about'
  | 'navigation.recipes'
  | 'navigation.allRecipes'
  | 'navigation.myRecipes'
  | 'navigation.mealPlan'
  | 'navigation.nutrition'
  | 'navigation.restaurants'
  | 'navigation.contact'
  | 'navigation.login'
  | 'navigation.logout'
  
  // Welcome/Landing
  | 'welcome.title'
  | 'welcome.subtitle'
  | 'valueProposition.title'
  | 'forSingles.title'
  | 'forSingles.point1'
  | 'forSingles.point2'
  | 'forSingles.point3'
  | 'forGastronomes.title'
  | 'forGastronomes.point1'
  | 'forGastronomes.point2'
  | 'forGastronomes.point3'
  
  // Profile
  | 'profile.title'
  | 'profile.save'
  | 'profile.allergies.label'
  | 'profile.favorite_foods.label'
  | 'profile.disliked_foods.label'
  | 'profile.goals.label'
  | 'profile.health.disclaimer'
  
  // Profile Goals (dynamische Keys)
  | 'profile.goals.weight_loss'
  | 'profile.goals.weight_maintenance'
  | 'profile.goals.muscle_gain'
  | 'profile.goals.high_protein'
  | 'profile.goals.low_carb'
  | 'profile.goals.vegan'
  | 'profile.goals.vegetarian'
  | 'profile.goals.keto'
  | 'profile.goals.paleo'
  | 'profile.goals.diabetic_friendly'
  | 'profile.goals.heart_health'
  | 'profile.goals.gut_health'
  | 'profile.goals.anti_inflammatory'
  | 'profile.goals.sustainable_eating'
  | 'profile.goals.flexitarian'
  | 'profile.goals.other'
  
  // Nutrition
  | 'nutrition.hero.title'
  | 'nutrition.hero.body'
  | 'nutrition.disclaimer'
  | 'nutrition.recommendations.title'
  | 'nutrition.recommendations.noData'
  | 'nutrition.calc.demo.hint'
  | 'nutrition.cta.createProfile'
  | 'nutrition.cta.info'
  
  // Meal Plan
  | 'mealPlan.title'
  | 'mealPlan.loading'
  | 'mealPlan.error'
  
  // Recipes
  | 'myRecipes.title'
  | 'myRecipes.btnNew'
  | 'myRecipes.btnEdit'
  | 'myRecipes.loading'
  | 'myRecipes.errorLoading'
  | 'myRecipes.servings'
  | 'myRecipes.published'
  | 'recipes.description'
  
  // Generic pages
  | 'about.description'
  | 'contact.description'
  | 'restaurants.info'
  | 'restaurants.searchLink'
  
  // Language switcher
  | 'languageSwitcher.label'
  | 'languageSwitcher.selectedLabel'
  | 'languages.de'
  | 'languages.en'
  | 'languages.es'
  | 'languages.fr';

/**
 * Erweiterte useSafeT Hook-Definition mit TypeScript-Sicherheit
 */
export interface SafeTFunction {
  (key: TranslationKey, fallback?: string): string;
}
