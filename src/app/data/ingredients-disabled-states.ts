import {TargetIngredients} from "./target-ingredients";

export enum DisabledIngredients {
  None = 0,
  NamesAndCategories = 1,
  Categories = 2
}

export class IngredientsDisabledStates {
  values = new Map<TargetIngredients, DisabledIngredients>();

  constructor() {
    this.values.set(TargetIngredients.Included, DisabledIngredients.None);
    this.values.set(TargetIngredients.Excluded, DisabledIngredients.None);
    this.values.set(TargetIngredients.Extra, DisabledIngredients.None);
  }
}
