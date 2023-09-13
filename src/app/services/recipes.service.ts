import {Injectable} from '@angular/core';
import {TargetIngredients} from "../data/target-ingredients";
import {DisplayedIngredient} from "../data/displayed-ingredient";
import {Subject, Subscription} from "rxjs";
import {RecipeServiceOperation} from "./recipe-service-operation";
import {SearchSnapshotService} from "./search-snapshot.service";
import {SearchSnapshot} from "../data/search-snapshot";
import {RecipeSearchService} from "./recipe-search.service";
import {Page} from "../data/page";
import {Recipe} from "../data/recipe";
import {SearchSnapshotUpdate} from "../data/search-snapshot-ops/search-snapshot-update";
import {SearchSnapshotTransform} from "../data/search-snapshot-ops/search-snapshot-transform";
import {WhenIngredientsChangedOps} from "./recipe-service-operations/when-ingredients-changed-ops";
import {AppSearchMode} from "../data/app-search-mode";
import {WhenSearchModeChangedOps} from "./recipe-service-operations/when-search-mode-changed-ops";
import {WhenSnapshotLoadedOps} from "./recipe-service-operations/when-snapshot-loaded-ops";
import {OrderingAndFiltersParams} from "../data/ordering-and-filters-params";
import {WhenOrderingAndFiltersChanged} from "./recipe-service-operations/when-ordering-and-filters-changed";

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  operation$: Subject<RecipeServiceOperation> = new Subject<RecipeServiceOperation>();
  results$: Subject<Page<Recipe>> = new Subject<Page<Recipe>>();

  private recipeQuerySub: Subscription | undefined = undefined;
  private snapshotForCurrentQuery: SearchSnapshot;

  constructor(private searchSnapshotService: SearchSnapshotService, private recipeQueryService: RecipeSearchService) {
    this.snapshotForCurrentQuery = searchSnapshotService.cloneSnapshot();
    setTimeout(() => this.queryInitialSnapshot());
  }

  ingredientsChangedIn(target: TargetIngredients, items: DisplayedIngredient[]) {
    this.anySearchParamChanged(() => {
      SearchSnapshotUpdate.withIngredients(target, items, this.snapshotForCurrentQuery);

      const whenIngredientsChanged =
        new WhenIngredientsChangedOps(this.snapshotForCurrentQuery, this.operation$);
      whenIngredientsChanged.checkIfSearchModeShouldBeUpdated();
      whenIngredientsChanged.refreshNumOfGoodIngredientsIfNeeded();
      whenIngredientsChanged.setDisabledSearchModes();
      whenIngredientsChanged.resetPaging();
    });
  }

  searchModeChanged(searchMode: AppSearchMode) {
    this.anySearchParamChanged(() => {
      SearchSnapshotUpdate.withSearchMode(searchMode, this.snapshotForCurrentQuery);

      const whenSearchModeChanged =
        new WhenSearchModeChangedOps(this.snapshotForCurrentQuery, this.operation$);
      whenSearchModeChanged.resetPaging();
    })
  }

  recipePageChanged(newPage: number) {
    this.anySearchParamChanged(() => {
      SearchSnapshotUpdate.withPage(newPage, this.snapshotForCurrentQuery);
    })
  }

  orderingAndFiltersChanged(params: OrderingAndFiltersParams) {
    this.anySearchParamChanged(() => {
      SearchSnapshotUpdate.withOrderingAndFiltersParams(params, this.snapshotForCurrentQuery);

      const whenOrderingAndFilterChanged =
        new WhenOrderingAndFiltersChanged(this.snapshotForCurrentQuery, this.operation$);
      whenOrderingAndFilterChanged.resetPaging();
    })
  }

  private anySearchParamChanged(updateSnapshotForQuery: () => void) {
    if (this.recipeQuerySub) {
      this.recipeQuerySub.unsubscribe();
    }

    this.snapshotForCurrentQuery = this.searchSnapshotService.cloneSnapshot();
    updateSnapshotForQuery();

    const queryParams = SearchSnapshotTransform.toQueryParams(this.snapshotForCurrentQuery);
    this.recipeQuerySub = this.recipeQueryService.query(queryParams).subscribe({
      next: r => this.onQuerySuccessful(r)
    });
  }

  private onQuerySuccessful(page: Page<Recipe>) {
    this.searchSnapshotService.set(this.snapshotForCurrentQuery);
    this.results$.next(page);
  }

  private queryInitialSnapshot() {
    const queryParams = SearchSnapshotTransform.toQueryParams(this.snapshotForCurrentQuery);

    const whenSnapshotIsLoaded = new WhenSnapshotLoadedOps(this.snapshotForCurrentQuery, this.operation$);
    whenSnapshotIsLoaded.setIngredients();
    whenSnapshotIsLoaded.setDisabledSearchModes();
    whenSnapshotIsLoaded.setOrderingAndFilters();

    this.recipeQueryService.query(queryParams).subscribe({
      next: p => this.results$.next(p)
    });
  }
}
