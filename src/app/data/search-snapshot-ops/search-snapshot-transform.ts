import {RecipeQueryParams} from "../../services/recipe-query-params";
import {SearchSnapshot} from "../search-snapshot";
import {determineAppSearchMode, SavedRecipeSearchQuery} from "../saved-recipe-search";
import {AppSearchMode} from "../app-search-mode";

export class SearchSnapshotTransform {
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

    queryParams.inIngs = this.toIncludedIngredientsQueryParam(searchQuery);
    queryParams.inIngTags = this.toIncludedIngredientTagsQueryParam(searchQuery);
    queryParams.exIngs = searchQuery.exIngs ? searchQuery.exIngs.map(i => i.id) : [];
    queryParams.exIngTags = searchQuery.exIngTags ? searchQuery.exIngTags.map(i => i.id) : [];
    queryParams.addIngs = this.toAdditionalIngredientsQueryParam(searchQuery);
    queryParams.addIngTags = this.toAdditionalIngredientTagsQueryParam(searchQuery);

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
    const jsonStr = JSON.stringify(snapshot);
    return JSON.parse(jsonStr);
  }

  private static toIncludedIngredientsQueryParam(query: SavedRecipeSearchQuery): number[] {
    const appSearchMode = determineAppSearchMode(query);
    if (appSearchMode === AppSearchMode.None) {
      return [];
    }

    return query.inIngs ? query.inIngs?.map(i => i.id) : [];
  }

  private static toIncludedIngredientTagsQueryParam(query: SavedRecipeSearchQuery): number[] {
    const appSearchMode = determineAppSearchMode(query);
    if (appSearchMode === AppSearchMode.None || appSearchMode === AppSearchMode.StrictlyComposedOf ||
      appSearchMode === AppSearchMode.Contains) {
      return [];
    }

    return query.inIngTags ? query.inIngTags.map(i => i.id) : [];
  }

  private static toAdditionalIngredientsQueryParam(query: SavedRecipeSearchQuery): number[] {
    const appSearchMode = determineAppSearchMode(query);
    if (appSearchMode === AppSearchMode.None || appSearchMode === AppSearchMode.StrictlyComposedOf ||
      appSearchMode === AppSearchMode.AnyOf) {
      return [];
    }

    return query.addIngs ? query.addIngs.map(i => i.id) : [];
  }

  private static toAdditionalIngredientTagsQueryParam(query: SavedRecipeSearchQuery): number[] {
    const appSearchMode = determineAppSearchMode(query);
    if (appSearchMode === AppSearchMode.None || appSearchMode === AppSearchMode.StrictlyComposedOf ||
      appSearchMode === AppSearchMode.AnyOf) {
      return [];
    }

    return query.addIngTags ? query.addIngTags.map(i => i.id) : [];
  }
}
