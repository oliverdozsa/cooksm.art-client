export enum SearchParamsOperationType {
  Ingredients
}

export interface SearchParamsOperation {
  type: SearchParamsOperationType
  payload: any;
}
