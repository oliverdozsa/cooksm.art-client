import {Menu} from "../../../data/menu";
import {Recipe} from "../../../data/recipe";

export function compareMenusByCommonIngredients(menuA: Menu, menuB: Menu) {
  const iA = calcIngredientsDifferenceFor(menuA);
  const iB = calcIngredientsDifferenceFor(menuB);

  if (iA < iB) {
    return 1;
  } else if (iA == iB) {
    return 0;
  } else {
    return -1;
  }
}

function calcIngredientsDifferenceFor(menu: Menu) {
  if(menu.groups.length == 0) {
    return 1;
  }

  const recipesOfMenu = menu.groups
    .map(g => g.recipes)
    .flat();

  const uniqueIngredients = new Set<number>();
  recipesOfMenu.forEach(r => addIngredientsOfRecipeTo(uniqueIngredients, r!));

  const totalIngredients = recipesOfMenu
    .reduce((a, c) => a + c!.ingredients.length, 0);

  return uniqueIngredients.size / totalIngredients;
}

function addIngredientsOfRecipeTo(uniqueIngredient: Set<number>, recipe: Recipe) {
  recipe.ingredients.forEach(i => uniqueIngredient.add(i.id));
}
