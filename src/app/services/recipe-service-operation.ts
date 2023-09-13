export enum RecipeServiceOperationType {
  SetIngredients,
  DisableSearchModes,
  SetSearchMode,
  SetPageNumber,
  SetOrderingAndFilters
}

export interface RecipeServiceOperation {
  type: RecipeServiceOperationType
  payload: any;
}
