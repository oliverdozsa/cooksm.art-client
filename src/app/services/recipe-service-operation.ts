import {AppSearchMode} from "../data/app-search-mode";

export enum RecipeServiceOperationType {
  SetIngredients,
  DisableSearchModes,
  SetSearchMode
}

export interface RecipeServiceOperation {
  type: RecipeServiceOperationType
  payload: any;
}