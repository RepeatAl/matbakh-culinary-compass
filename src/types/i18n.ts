
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
  | 'profile.saved'
  | 'profile.save_failed'
  | 'profile.loading'
  | 'profile.first_name'
  | 'profile.first_name_error'
  | 'profile.last_name'
  | 'profile.last_name_error'
  | 'profile.language_label'
  | 'profile.language_error'
  | 'profile.allergies.label'
  | 'profile.allergies.gluten'
  | 'profile.allergies.lactose'
  | 'profile.allergies.nuts'
  | 'profile.allergies.soy'
  | 'profile.allergies.eggs'
  | 'profile.allergies.fish'
  | 'profile.allergies.shellfish'
  | 'profile.allergies.sesame'
  | 'profile.allergies.peanut'
  | 'profile.allergies.nightshades'
  | 'profile.allergies.histamine'
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
  | 'nutrition.recommendations.seeAll'
  | 'nutrition.calc.demo.hint'
  | 'nutrition.cta.createProfile'
  | 'nutrition.cta.info'
  | 'nutrition.calc.title'
  | 'nutrition.calc.units.label'
  | 'nutrition.calc.units.placeholder'
  | 'nutrition.calc.units.metric'
  | 'nutrition.calc.units.imperial'
  | 'nutrition.calc.units.hintWeight'
  | 'nutrition.calc.units.hintHeight'
  | 'nutrition.calc.gender.label'
  | 'nutrition.calc.gender.placeholder'
  | 'nutrition.calc.gender.male'
  | 'nutrition.calc.gender.female'
  | 'nutrition.calc.gender.other'
  | 'nutrition.calc.activity.label'
  | 'nutrition.calc.activity.placeholder'
  | 'nutrition.calc.activity.sedentary'
  | 'nutrition.calc.activity.light'
  | 'nutrition.calc.activity.moderate'
  | 'nutrition.calc.activity.active'
  | 'nutrition.calc.activity.very_active'
  | 'nutrition.calc.weight.label'
  | 'nutrition.calc.weight.lbs'
  | 'nutrition.calc.weight.placeholder'
  | 'nutrition.calc.height.label'
  | 'nutrition.calc.height.in'
  | 'nutrition.calc.height.placeholder'
  | 'nutrition.calc.age.label'
  | 'nutrition.calc.age.placeholder'
  | 'nutrition.calc.submit'
  | 'nutrition.calc.sending'
  | 'nutrition.calc.error.weight'
  | 'nutrition.calc.error.height'
  | 'nutrition.calc.error.age'
  | 'nutrition.calc.error.gender'
  | 'nutrition.calc.error.activity'
  | 'nutrition.calc.error.units'
  | 'nutrition.calc.error.fallback'
  | 'nutrition.calc.result.title'
  | 'nutrition.calc.result.bmr'
  | 'nutrition.calc.result.tdee'
  | 'nutrition.calc.result.macros'
  | 'nutrition.calc.result.macroCarbs'
  | 'nutrition.calc.result.macroProtein'
  | 'nutrition.calc.result.macroFat'
  | 'nutrition.calc.result.units'
  | 'nutrition.tiles.fresh.title'
  | 'nutrition.tiles.fresh.desc'
  | 'nutrition.tiles.energy.title'
  | 'nutrition.tiles.energy.desc'
  | 'nutrition.tiles.variety.title'
  | 'nutrition.tiles.variety.desc'
  | 'nutrition.tiles.protein.title'
  | 'nutrition.tiles.protein.desc'
  
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
  | 'languages.fr'
  
  // Cookie consent
  | 'cookie.message'
  | 'cookie.accept'
  | 'cookie.decline';

/**
 * Erweiterte useSafeT Hook-Definition mit TypeScript-Sicherheit
 */
export interface SafeTFunction {
  (key: TranslationKey, fallback?: string): string;
}
