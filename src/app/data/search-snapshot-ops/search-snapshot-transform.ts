import {RecipeQueryParams} from "../../services/recipe-query-params";
import {SearchSnapshot} from "../search-snapshot";

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
    const jsonStr = JSON.stringify(snapshot);
    return JSON.parse(jsonStr);
  }
}
