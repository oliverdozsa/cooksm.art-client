import {SavedRecipeSearch} from "./saved-recipe-search";

export class SearchSnapshot {
  search: SavedRecipeSearch = new SavedRecipeSearch();
  currentPageNumber = 1;
  limit = 10;
  locale: string = "";
  shouldChangeSourcePagesInInitialQuery = true;
  hasUserModifiedAnySourcePage = false;
}
