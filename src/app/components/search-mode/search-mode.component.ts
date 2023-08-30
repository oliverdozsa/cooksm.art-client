import {Component, OnDestroy} from '@angular/core';
import {AppSearchMode} from "../../data/app-search-mode";
import {RecipesService} from "../../services/recipes.service";
import {Subject, takeUntil} from "rxjs";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../../services/recipe-service-operation";

@Component({
  selector: 'app-search-mode',
  templateUrl: './search-mode.component.html',
  styleUrls: ['./search-mode.component.scss']
})
export class SearchModeComponent implements OnDestroy {
  AppSearchMode = AppSearchMode;

  private _searchMode = AppSearchMode.None;
  private disabledSearchModes: AppSearchMode[] = [];
  private destroy$ = new Subject<void>();

  constructor(private recipeService: RecipesService) {
    this.recipeService.operation$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: o => this.onRecipesServiceOperation(o)
      });
  }

  get searchMode(): AppSearchMode {
    return this._searchMode;
  }

  set searchMode(value: AppSearchMode) {
    this._searchMode = value;
    this.recipeService.searchModeChanged(this.searchMode);
  }

  isDisabled(searchMode: AppSearchMode) {
    return this.disabledSearchModes.includes(searchMode);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onRecipesServiceOperation(operation: RecipeServiceOperation) {
    if (operation.type === RecipeServiceOperationType.SetSearchMode) {
      this._searchMode = operation.payload.searchMode;
    }

    if (operation.type === RecipeServiceOperationType.DisableSearchModes) {
      this.disabledSearchModes = operation.payload;
    }
  }
}
