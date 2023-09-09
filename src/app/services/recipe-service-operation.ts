export enum RecipeServiceOperationType {
  SetIngredients,
  DisableSearchModes,
  SetSearchMode,
  SetPageNumber
}

export interface RecipeServiceOperation {
  type: RecipeServiceOperationType
  payload: any;
}
