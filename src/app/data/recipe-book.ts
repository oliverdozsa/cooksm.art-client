export class RecipeBook {
  id: number = -1;
  name: string = "<NOT SET>";
  lastAccessed: string = "<NOT SET>";
}

export class RecipeBookWithRecipes {
  id: number = -1;
  name: string = "<NOT SET>";
  lastAccessed: string = "<NOT SET>";
  recipeSummaries: RecipeInRecipeBookSummary[] = [];
}

export class RecipeInRecipeBookSummary {
  id: number = -1;
  name: string = "<NOT SET>";
  url: string = "<NOT SET>";
}

export class RecipeBooksOfRecipe {
  recipeBookIds: number[] = [];
}
