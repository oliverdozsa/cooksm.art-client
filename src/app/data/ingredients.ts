export class IngredientName {
  id: number = -1;
  name: string = '<NOT SET>';
  altNames: string[] = [];
}

export class IngredientCategory {
  id: number = -1;
  name: string = '<NOT SET>';
  ingredients: number[] = [];
}
