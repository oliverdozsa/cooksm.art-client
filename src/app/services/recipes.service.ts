import {Injectable} from '@angular/core';
import {TargetIngredients} from "../data/target-ingredients";
import {DisplayedIngredient} from "../data/displayed-ingredient";
import {Subject, Subscription} from "rxjs";
import {SearchParamsOperation} from "./search-params-operation";
import {SearchSnapshotService} from "./search-snapshot.service";
import {SearchSnapshot} from "../data/search-snapshot";
import {RecipeSearchService} from "./recipe-search.service";
import {Page} from "../data/page";
import {Recipe} from "../data/recipe";
import {AppSearchMode} from "../data/app-search-mode";

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  operation$ = new Subject<SearchParamsOperation>();
  results$ = new Subject<Page<Recipe>>();

  private recipeQuerySub: Subscription | undefined = undefined;
  private snapshotForCurrentQuery: SearchSnapshot;

  constructor(private searchSnapshotService: SearchSnapshotService, private recipeQueryService: RecipeSearchService) {
    this.snapshotForCurrentQuery = searchSnapshotService.cloneSnapshot();
  }

  ingredientsChangedIn(target: TargetIngredients, items: DisplayedIngredient[]) {
    this.anySearchParamChanged(() => {
      SearchSnapshot.updateWithIngredients(target, items, this.snapshotForCurrentQuery);
      if(this.snapshotForCurrentQuery.search.query == undefined) {
        SearchSnapshot.updateWithSearchMode(AppSearchMode.Contains, this.snapshotForCurrentQuery);
      }
    });
  }

  searchModeChanged() {
    // TODO:
    // TODO: start recipe query. If recipe query finished successfully, save snapshot
  }

  private anySearchParamChanged(updateSnapshotForQuery: () => void) {
    if(this.recipeQuerySub) {
      this.recipeQuerySub.unsubscribe();
    }

    this.snapshotForCurrentQuery = this.searchSnapshotService.cloneSnapshot();
    updateSnapshotForQuery();

    const queryParams = SearchSnapshot.toQueryParams(this.snapshotForCurrentQuery);
    this.recipeQuerySub = this.recipeQueryService.query(queryParams).subscribe({
      next: r => this.onQuerySuccessful(r)
    });
  }

  private onQuerySuccessful(page: Page<Recipe>) {
    this.searchSnapshotService.set(this.snapshotForCurrentQuery);
    this.results$.next(page);
  }
}
