import {SavedRecipeSearch} from "./saved-recipe-search";
import {RecipeQueryParams} from "../services/recipe-query-params";
import {TargetIngredients} from "./target-ingredients";
import {DisplayedIngredient} from "./displayed-ingredient";
import {AppSearchMode} from "./app-search-mode";

export class SearchSnapshot {
  search: SavedRecipeSearch = new SavedRecipeSearch();
  currentPageNumber = 1;
  limit = 10;

  static toQueryParams(snapshot: SearchSnapshot): RecipeQueryParams {
    const queryParams = new RecipeQueryParams();
    const searchQuery = snapshot.search.query;

    queryParams.limit = snapshot.limit;
    queryParams.setOffsetByPage(snapshot.currentPageNumber);

    queryParams.searchMode = searchQuery.searchMode;
    queryParams.goodIngs = searchQuery.goodIngs;
    queryParams.goodIngsRel = searchQuery.goodIngsRel;
    queryParams.goodIngsRatio = searchQuery.goodIngsRatio;
    queryParams.goodAdditionalIngs = searchQuery.goodAdditionalIngs;
    queryParams.goodAdditionalIngsRel = searchQuery.goodAdditionalIngsRel;
    queryParams.unknownIngs = searchQuery.unknownIngs;
    queryParams.unknownIngsRel = searchQuery.unknownIngsRel;

    queryParams.inIngs = searchQuery.inIngs ? searchQuery.inIngs?.map(i => i.id) : [];
    queryParams.inIngTags = searchQuery.inIngTags ? searchQuery.inIngTags.map(i => i.id) : [];
    queryParams.exIngs = searchQuery.exIngs ? searchQuery.exIngs.map(i => i.id) : [];
    queryParams.exIngTags = searchQuery.exIngTags ? searchQuery.exIngTags.map(i => i.id) : [];
    queryParams.addIngs = searchQuery.addIngs ? searchQuery.addIngs.map(i => i.id) : [];
    queryParams.addIngTags = searchQuery.addIngTags ? searchQuery.addIngTags.map(i => i.id) : [];

    queryParams.nameLike = searchQuery.nameLike;
    queryParams.orderBy = searchQuery.orderBy;
    queryParams.orderBySort = searchQuery.orderBySort;
    queryParams.times = searchQuery.times ? searchQuery.times : [];
    queryParams.minIngs = searchQuery.minIngs;
    queryParams.maxIngs = searchQuery.maxIngs;
    queryParams.useFavoritesOnly = searchQuery.useFavoritesOnly;

    queryParams.recipeBooks = searchQuery.recipeBooks == undefined ? [] : searchQuery.recipeBooks.map(b => b.id);

    return queryParams;
  }

  static clone(snapshot: SearchSnapshot): SearchSnapshot {
    // TODO
    return new SearchSnapshot();
  }

  static updateWithIngredients(target: TargetIngredients, items: DisplayedIngredient[], snapshot: SearchSnapshot) {
    const categories = items
      .filter(i => i.isCategory)
      .map(i => i.ingredientCategory!);

    const ingredients = items
      .filter(i => !i.isCategory)
      .map(i => i.ingredientName!);

    if(target == TargetIngredients.Included) {
      snapshot.search.query.inIngs = ingredients;
      snapshot.search.query.inIngTags = categories;
    } else if(target == TargetIngredients.Excluded) {
      snapshot.search.query.exIngs = ingredients;
      snapshot.search.query.exIngTags = categories;
    } else if(target == TargetIngredients.Extra) {
      snapshot.search.query.addIngs = ingredients;
      snapshot.search.query.addIngTags = categories;
    }
  }

  static updateWithSearchMode(appSearchMode: AppSearchMode, snapshot: SearchSnapshot) {
    // TODO
  }
}
