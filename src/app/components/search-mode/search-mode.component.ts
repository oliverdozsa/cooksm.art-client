import { Component } from '@angular/core';
import {AppSearchMode} from "../../data/app-search-mode";
import {RecipesService} from "../../services/recipes.service";

@Component({
  selector: 'app-search-mode',
  templateUrl: './search-mode.component.html',
  styleUrls: ['./search-mode.component.scss']
})
export class SearchModeComponent {
  AppSearchMode = AppSearchMode;

  private _searchMode = AppSearchMode.None;

  constructor(private recipeService: RecipesService) {
  }

  get searchMode(): AppSearchMode {
    return this._searchMode;
  }

  set searchMode(value: AppSearchMode) {
    this._searchMode = value;
    this.recipeService.searchModeChanged(this.searchMode);
  }
}
