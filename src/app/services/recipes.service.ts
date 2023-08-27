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
import {SearchSnapshotUpdate} from "../data/search-snapshot-ops/search-snapshot-update";
import {SearchSnapshotTransform} from "../data/search-snapshot-ops/search-snapshot-transform";
import {WhenIngredientsChangedOps} from "./recipe-service-operations/when-Ingredients-changed-ops";

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  operation$: Subject<SearchParamsOperation> = new Subject<SearchParamsOperation>();
  results$: Subject<Page<Recipe>> = new Subject<Page<Recipe>>();

  private recipeQuerySub: Subscription | undefined = undefined;
  private snapshotForCurrentQuery: SearchSnapshot;

  constructor(private searchSnapshotService: SearchSnapshotService, private recipeQueryService: RecipeSearchService) {
    this.snapshotForCurrentQuery = searchSnapshotService.cloneSnapshot();
  }

  ingredientsChangedIn(target: TargetIngredients, items: DisplayedIngredient[]) {
    this.anySearchParamChanged(() => {
      SearchSnapshotUpdate.withIngredients(target, items, this.snapshotForCurrentQuery);

      const whenIngredientsChanged = new WhenIngredientsChangedOps(this.snapshotForCurrentQuery);
      whenIngredientsChanged.checkIfSearchModeShouldBeUpdated();
      whenIngredientsChanged.refreshNumOfGoodIngredientsIfNeeded();
    });
  }

  searchModeChanged() {
    // TODO:
    // TODO: start recipe query. If recipe query finished successfully, save snapshot
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
}
