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
  DisableIngredients
}

export interface RecipeServiceOperation {
  type: RecipeServiceOperationType
  payload: any;
}
