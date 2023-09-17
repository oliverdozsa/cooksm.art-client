import {TargetIngredients} from "../target-ingredients";
import {DisplayedIngredient} from "../displayed-ingredient";
import {AppSearchMode} from "../app-search-mode";
import {ApiSearchMode} from "../../services/recipe-query-params";
import {SearchSnapshot} from "../search-snapshot";
import {OrderingAndFiltersParams} from "../ordering-and-filters-params";

export class SearchSnapshotUpdate {
  static withIngredients(target: TargetIngredients, items: DisplayedIngredient[], snapshot: SearchSnapshot) {
    const categories = items
      .filter(i => i.isCategory)
      .map(i => i.ingredientCategory!);

    const ingredients = items
      .filter(i => !i.isCategory)
      .map(i => i.ingredientName!);

    if (target == TargetIngredients.Included) {
      snapshot.search.query.inIngs = ingredients;
      snapshot.search.query.inIngTags = categories;
    } else if (target == TargetIngredients.Excluded) {
      snapshot.search.query.exIngs = ingredients;
      snapshot.search.query.exIngTags = categories;
    } else if (target == TargetIngredients.Extra) {
      snapshot.search.query.addIngs = ingredients;
      snapshot.search.query.addIngTags = categories;
    }
  }

  static withSearchMode(appSearchMode: AppSearchMode, snapshot: SearchSnapshot) {
    const query = snapshot.search.query;

    if (appSearchMode === AppSearchMode.Contains) {
      query.searchMode = ApiSearchMode.NumberBased;
      query.unknownIngsRel = 'ge';
      query.unknownIngs = 0
      query.goodIngsRel = 'ge';
      query.goodIngs = query.inIngs?.length
    } else if (appSearchMode === AppSearchMode.ComposedOf) {
      query.searchMode = ApiSearchMode.RatioBased;
      query.goodIngsRatio = 1;
    } else if (appSearchMode === AppSearchMode.AnyOf) {
      query.searchMode = ApiSearchMode.NumberBased;
      query.unknownIngsRel = 'ge';
      query.unknownIngs = 0
      query.goodIngsRel = 'gt';
      query.goodIngs = 0;
    } else if (appSearchMode === AppSearchMode.StrictlyComposedOf) {
      query.searchMode = ApiSearchMode.NumberBased;
      query.unknownIngsRel = 'eq';
      query.unknownIngs = 0;
      query.goodIngsRel = 'eq';
      query.goodIngs = query.inIngs?.length;
    } else if (appSearchMode === AppSearchMode.None) {
      query.searchMode = ApiSearchMode.None;
    }
  }

  static withPage(page: number, snapshot: SearchSnapshot) {
    snapshot.currentPageNumber = page;
  }

  static withOrderingAndFiltersParams(params: OrderingAndFiltersParams, snapshot: SearchSnapshot) {
    const query = snapshot.search.query;
    query.nameLike = params.filterByName;
    query.orderBy = params.orderBy;
    query.orderBySort = params.orderBySort;
    query.minIngs = params.minIngs;
    query.maxIngs = params.maxIngs;
    query.times = params.times;
  }
}
