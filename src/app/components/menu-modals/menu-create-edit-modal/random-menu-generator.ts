import {Menu} from "../../../data/menu";
import {RecipeSearchService} from "../../../services/recipe-search.service";
import {delay, forkJoin, map, Observable, of, Subject, takeUntil} from "rxjs";
import {RecipeQueryParams} from "../../../services/recipe-query-params";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

export class RandomMenuGenerator {
  progress = 0;
  totalWork = 0;

  isWorking = false;
  isFailed: boolean = false;
  failureReason = "";

  private recipeBookSizes: number[] = [];

  constructor(private forDays: number, private sources: number[], private recipeSearchService: RecipeSearchService) {
    this.totalWork = (forDays + 1) * sources.length;
  }

  generate(): Menu {
    const menu = {
      name: "",
      groups: []
    }

    this.isWorking = true;

    this.collectRecipeBookSizes()
      .pipe(delay(700))
      .subscribe({
      next: sizes => this.onRecipeBookSizesQueried(sizes)
    });

    // TODO

    return menu;
  }

  private collectRecipeBookSizes(): Observable<number[]> {
    const queries = this.sources.map(id => this.collectRecipeBookSize(id));
    return forkJoin(queries);
  }

  private collectRecipeBookSize(id: number): Observable<number> {
    const queryParams = new RecipeQueryParams();
    queryParams.recipeBooks = [id];
    queryParams.offset = 0;
    queryParams.limit = 1;

    return this.recipeSearchService.query(queryParams)
      .pipe(
        map(p => p.totalCount)
      );
  }

  private onRecipeBookSizesQueried(sizes: number[]) {
    this.recipeBookSizes = sizes;
    this.progress = this.sources.length / this.totalWork;
    this.checkIfSizesAreCorrect();
    if (!this.isFailed) {
      // TODO: create the menu
    }
  }

  private checkIfSizesAreCorrect() {
    this.recipeBookSizes.forEach(size => {
      if (size < this.forDays) {
        this.isFailed = true;
        this.isWorking = false;
        this.failureReason = "All recipe books must have at least as many recipes as the number of days requested!";
        this.progress = 100;
      }
    });
  }
}
