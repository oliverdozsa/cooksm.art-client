export enum RecipeServiceOperationType {
  Ingredients
}

export interface RecipeServiceOperation {
  type: RecipeServiceOperationType
  payload: any;
}
