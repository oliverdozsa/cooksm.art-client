import { Component } from '@angular/core';
import {AppSearchMode} from "../../data/app-search-mode";

@Component({
  selector: 'app-search-mode',
  templateUrl: './search-mode.component.html',
  styleUrls: ['./search-mode.component.scss']
})
export class SearchModeComponent {
  AppSearchMode = AppSearchMode;

  private _searchMode = AppSearchMode.None;

  get searchMode(): AppSearchMode {
    return this._searchMode;
  }

  set searchMode(value: AppSearchMode) {
    this._searchMode = value;
    // TODO: trigger search
  }
}
