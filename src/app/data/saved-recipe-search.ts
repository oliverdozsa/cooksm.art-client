import {IngredientCategory, IngredientName} from "./ingredients";
import {SourcePage} from "./source-page";
import {RecipeBook} from "./recipe-book";
import {AppSearchMode} from "./app-search-mode";
import {ApiSearchMode} from "../services/recipe-query-params";

export class SavedRecipeSearch {
  query: SavedRecipeSearchQuery = new SavedRecipeSearchQuery();
}

export class SavedRecipeSearchQuery {
  searchMode?: string;
  minIngs?: number;
  maxIngs?: number;
  orderBy?: string;
  orderBySort?: string;
  unknownIngs?: number;
  unknownIngsRel?: string;
  goodIngs?: number;
  goodAdditionalIngs?: number;
  goodAdditionalIngsRel?: string;
  goodIngsRel?: string;
  goodIngsRatio?: number;
  nameLike?: string;
  exIngs?: IngredientName[];
  exIngTags?: IngredientCategory[];
  inIngs?: IngredientName[];
  inIngTags?: IngredientCategory[];
  addIngs?: IngredientName[];
  addIngTags?: IngredientCategory[];
  sourcePages?: SourcePage[];
  times?: number[];
  languageId?: number;
  useFavoritesOnly?: boolean;
  recipeBooks?: RecipeBook[];
}

export function determineAppSearchMode(query: SavedRecipeSearchQuery): AppSearchMode {
  if (query.searchMode === ApiSearchMode.NumberBased && query.unknownIngsRel === 'ge' && query.goodIngsRel === 'ge') {
    return AppSearchMode.Contains;
  }

  if (query.searchMode === ApiSearchMode.RatioBased) {
    return AppSearchMode.ComposedOf;
  }

  if (query.searchMode === ApiSearchMode.NumberBased && query.unknownIngsRel === 'ge' && query.goodIngsRel === 'gt' &&
    query.goodIngs === 0) {
    return AppSearchMode.AnyOf;
  }

  if (query.inIngs && (query.searchMode === ApiSearchMode.NumberBased && query.unknownIngsRel === 'eq' && query.unknownIngs === 0 &&
    query.goodIngsRel === 'eq' && query.goodIngs === query.inIngs.length)) {
    return AppSearchMode.StrictlyComposedOf;
  }

  return AppSearchMode.None;
}
