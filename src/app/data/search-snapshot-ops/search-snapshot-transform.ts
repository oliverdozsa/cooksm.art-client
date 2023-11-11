import {RecipeQueryParams} from "../../services/recipe-query-params";
import {SearchSnapshot} from "../search-snapshot";
import {determineAppSearchMode, SavedRecipeSearchQuery} from "../saved-recipe-search";
import {AppSearchMode} from "../app-search-mode";
import {TargetIngredients} from "../target-ingredients";
import {DisplayedIngredient} from "../displayed-ingredient";
import {IngredientCategory, IngredientName} from "../ingredients";

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
    queryParams.unknownIngs = searchQuery.unknownIngs;
    queryParams.unknownIngsRel = searchQuery.unknownIngsRel;

    queryParams.inIngs = this.toIncludedIngredientsQueryParam(searchQuery);
    queryParams.inIngTags = this.toIncludedIngredientTagsQueryParam(searchQuery);
    queryParams.exIngs = searchQuery.exIngs ? searchQuery.exIngs.map(i => i.id) : [];
    queryParams.exIngTags = searchQuery.exIngTags ? searchQuery.exIngTags.map(i => i.id) : [];
    queryParams.addIngs = this.toAdditionalIngredientsQueryParam(searchQuery);
    queryParams.addIngTags = this.toAdditionalIngredientTagsQueryParam(searchQuery);

    const isAdditionalIngredientsOrTagsPresent = queryParams.addIngs.length > 0 || queryParams.addIngTags.length > 0
    queryParams.goodAdditionalIngs = isAdditionalIngredientsOrTagsPresent ? searchQuery.goodAdditionalIngs : undefined;
    queryParams.goodAdditionalIngsRel = isAdditionalIngredientsOrTagsPresent ? searchQuery.goodAdditionalIngsRel : undefined;

    queryParams.nameLike = searchQuery.nameLike;
    queryParams.orderBy = searchQuery.orderBy;
    queryParams.orderBySort = searchQuery.orderBySort;
    queryParams.times = searchQuery.times ? searchQuery.times : [];
    queryParams.minIngs = searchQuery.minIngs;
    queryParams.maxIngs = searchQuery.maxIngs;
    queryParams.useFavoritesOnly = searchQuery.useFavoritesOnly;

    queryParams.recipeBooks = searchQuery.recipeBooks == undefined ? [] : searchQuery.recipeBooks.map(b => b.id);

    queryParams.sourcePages = searchQuery.sourcePages == undefined ? [] : searchQuery.sourcePages.map(s => s.id);

    return queryParams;
  }

  static clone(snapshot: SearchSnapshot): SearchSnapshot {
    const jsonStr = JSON.stringify(snapshot);
    return JSON.parse(jsonStr);
  }

  static toDisplayedIngredients(snapshot: SearchSnapshot): Map<TargetIngredients, DisplayedIngredient[]> {
    const displayedIngredients = new Map<TargetIngredients, DisplayedIngredient[]>();

    const targets = [TargetIngredients.Included, TargetIngredients.Excluded, TargetIngredients.Extra];
    for (const target of targets) {
      displayedIngredients.set(target, SearchSnapshotTransform.extractAsDisplayedIngredients(target, snapshot));
    }

    return displayedIngredients;
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

  private static extractAsDisplayedIngredients(target: TargetIngredients, snapshot: SearchSnapshot): DisplayedIngredient[] {
    let sourceIngredientNames: IngredientName[] | undefined;
    let sourceIngredientCategories: IngredientCategory[] | undefined;

    const query = snapshot.search.query;
    if (target === TargetIngredients.Included) {
      sourceIngredientNames = query.inIngs;
      sourceIngredientCategories = query.inIngTags;
    }

    if (target === TargetIngredients.Excluded) {
      sourceIngredientNames = query.exIngs;
      sourceIngredientCategories = query.exIngTags;
    }

    if (target === TargetIngredients.Extra) {
      sourceIngredientNames = query.addIngs;
      sourceIngredientCategories = query.addIngTags;
    }

    let ingredients: DisplayedIngredient[] = [];
    let ingredientCategories: DisplayedIngredient[] = [];

    if (sourceIngredientNames) {
      ingredients = sourceIngredientNames.map(i => DisplayedIngredient.fromIngredientName(i));
    }

    if (sourceIngredientCategories) {
      ingredientCategories = sourceIngredientCategories.map(c => DisplayedIngredient.fromIngredientCategory(c));
    }

    return ingredients.concat(ingredientCategories);
  }
}
