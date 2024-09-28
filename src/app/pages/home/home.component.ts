import {Component, OnInit} from '@angular/core';
import {RecipesService} from "../../services/recipes.service";
import {SearchSnapshotService} from "../../services/search-snapshot.service";
import {determineAppSearchMode, SavedRecipeSearchQuery} from "../../data/saved-recipe-search";
import {AppSearchMode} from "../../data/app-search-mode";
import {LanguageService} from "../../services/language.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  get shouldShowResetButton(): boolean {
    const query = this.recipesService.currentSearchSnapshot.search.query;
    const appSearchMode = determineAppSearchMode(query);

    return this.isAnyFilterSet(query) || appSearchMode != AppSearchMode.None;
  }

  constructor(private recipesService: RecipesService, private languageService: LanguageService) {
  }

  public ngOnInit() {
    if(!this.languageService.isSwitchingInProgress) {
      setTimeout(() => this.recipesService.queryInitialSnapshot());
    }
  }

  private isAnyFilterSet(query: SavedRecipeSearchQuery) {
    return (query.minIngs != undefined && query.minIngs > 0) ||
      (query.maxIngs != undefined && query.maxIngs > 0) ||
      (query.orderBy != undefined && query.orderBy.length > 0) ||
      (query.nameLike != undefined && query.nameLike.length > 0) ||
      (query.times != undefined && query.times.length > 0) ||
      (query.sourcePages != undefined && query.sourcePages.length > 0) ||
      (query.useFavoritesOnly != undefined && query.useFavoritesOnly);
  }
}
