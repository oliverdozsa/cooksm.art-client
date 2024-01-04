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
import {ExtraRelation} from "../data/extra-ingredients";
import {WhenExtraRelationChangedOps} from "./recipe-service-operations/when-extra-relation-changed-ops";
import {RecipeQueryParams} from "./recipe-query-params";
import {
  IngredientAlreadyPresentElsewhereChecker
} from "./recipe-service-operations/ingredient-already-present-elsewhere-checker";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  operation$: Subject<RecipeServiceOperation> = new Subject<RecipeServiceOperation>();
  results$: Subject<Page<Recipe>> = new Subject<Page<Recipe>>();

  private recipeQuerySub: Subscription | undefined = undefined;
  private snapshotForCurrentQuery: SearchSnapshot;
  private previousQueryParams: RecipeQueryParams | undefined = undefined;
  private ingredientsAlreadyPresentChecker: IngredientAlreadyPresentElsewhereChecker;

  get currentSearchSnapshot(): SearchSnapshot {
    return this.snapshotForCurrentQuery;
  }

  constructor(private searchSnapshotService: SearchSnapshotService, private recipeQueryService: RecipeSearchService,
              modalService: NgbModal, private userService: UserService) {
    this.snapshotForCurrentQuery = searchSnapshotService.cloneSnapshot();
    if(!this.userService.isLoggedIn) {
      this.snapshotForCurrentQuery.search.query.useFavoritesOnly = undefined;
    }

    this.ingredientsAlreadyPresentChecker = new IngredientAlreadyPresentElsewhereChecker(modalService, this, this.snapshotForCurrentQuery);
  }

  queryInitialSnapshot() {
    const queryParams = SearchSnapshotTransform.toQueryParams(this.snapshotForCurrentQuery);
    this.previousQueryParams = queryParams;

    const whenSnapshotIsLoaded = new WhenSnapshotLoadedOps(this.snapshotForCurrentQuery, this.operation$, this.userService);
    whenSnapshotIsLoaded.doWhatNecessary();

    this.recipeQueryService.query(queryParams).subscribe({
      next: p => this.results$.next(p),
      error: e => this.results$.error(e)
    });
  }

  ingredientsChangedIn(target: TargetIngredients, items: DisplayedIngredient[]) {
    if (this.ingredientsAlreadyPresentChecker.findWhenIngredientsChangedIn(target, items)) {
      this.ingredientsAlreadyPresentChecker.askUser();
    } else {
      const changedIngredients = new Map<TargetIngredients, DisplayedIngredient[]>;
      changedIngredients.set(target, items);

      this.updateWithIngredients(changedIngredients)
    }
  }

  updateWithIngredients(ingredients: Map<TargetIngredients, DisplayedIngredient[]>) {
    this.anySearchParamChanged(() => {
      const previousSnapshot = this.searchSnapshotService.cloneSnapshot();

      for (let target of ingredients.keys()) {
        SearchSnapshotUpdate.withIngredients(target, ingredients.get(target)!, this.snapshotForCurrentQuery);
      }

      const whenIngredientsChanged =
        new WhenIngredientsChangedOps(this.snapshotForCurrentQuery, this.operation$, previousSnapshot);
      whenIngredientsChanged.doWhatNecessary();
    });
  }

  searchModeChanged(searchMode: AppSearchMode, ratio: number = 10) {
    this.anySearchParamChanged(() => {
      SearchSnapshotUpdate.withSearchMode(searchMode, this.snapshotForCurrentQuery, ratio);

      const whenSearchModeChanged = new WhenSearchModeChangedOps(this.snapshotForCurrentQuery, this.operation$);
      whenSearchModeChanged.doWhatNecessary();
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

      const whenOrderingAndFilterChanged = new WhenOrderingAndFiltersChanged(this.snapshotForCurrentQuery, this.operation$);
      whenOrderingAndFilterChanged.doWhatNecessary();
    })
  }

  extraIngredientsRelationChanged(relation: ExtraRelation, value: number) {
    this.anySearchParamChanged(() => {
      SearchSnapshotUpdate.withExtraRelation(relation, value, this.snapshotForCurrentQuery);

      const whenExtraRelationsChanged = new WhenExtraRelationChangedOps(this.snapshotForCurrentQuery, this.operation$);
      whenExtraRelationsChanged.doWhatNecessary();
    });
  }

  private anySearchParamChanged(updateSnapshotForQuery: () => void) {
    if (this.recipeQuerySub) {
      this.recipeQuerySub.unsubscribe();
    }

    this.snapshotForCurrentQuery = this.searchSnapshotService.cloneSnapshot();
    updateSnapshotForQuery();

    const queryParams = SearchSnapshotTransform.toQueryParams(this.snapshotForCurrentQuery);

    if (!queryParams.equals(this.previousQueryParams)) {
      this.previousQueryParams = queryParams;
      this.recipeQuerySub = this.recipeQueryService.query(queryParams).subscribe({
        next: r => this.onQuerySuccessful(r)
      });
    } else {
      this.searchSnapshotService.set(this.snapshotForCurrentQuery);
    }
  }

  private onQuerySuccessful(page: Page<Recipe>) {
    this.searchSnapshotService.set(this.snapshotForCurrentQuery);
    this.results$.next(page);
  }
}
