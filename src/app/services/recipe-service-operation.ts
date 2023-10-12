export enum RecipeServiceOperationType {
  SetIngredients,
  DisableSearchModes,
  SetSearchMode,
  SetPageNumber,
  SetOrderingAndFilters,
  SetExtraIngredientsRelation,
  SetExtraIngredientsRelationOptions,
  EnableExtraIngredientsRelation,
  DisableExtraIngredientsRelation,
  DisableIngredients,
  SetDisplayedIngredients
}

export interface RecipeServiceOperation {
  type: RecipeServiceOperationType
  payload: any;
}
