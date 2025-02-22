export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strMeasure1?: string;
  strMeasure2?: string;
}

export interface MealResponse {
  meals: Meal[];
}

export interface MealSuggestion {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}
