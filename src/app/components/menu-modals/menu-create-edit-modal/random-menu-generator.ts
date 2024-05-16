import {Menu, MenuGroup} from "../../../data/menu";
import {RecipeSearchService} from "../../../services/recipe-search.service";
import {delay, forkJoin, map, Observable, of, Subject, takeUntil} from "rxjs";
import {RecipeQueryParams} from "../../../services/recipe-query-params";
import {Recipe} from "../../../data/recipe";

export class RandomMenuGenerator {
  workDone = 0;
  totalWork = 0;

  isWorking = false;
  isFailed: boolean = false;
  failureReason = "";

  private recipeBookSizes: number[] = [];
  private usedOffsetsByCourseAndRecipeBooks = new Map<number, Map<number, number[]>>;

  private menu$ = new Subject<Menu>();
  private menu: Menu = {
    name: "",
    groups: Array(this.forDays)
  }

  get progress(): number {
    return Math.ceil(this.workDone / this.totalWork * 100);
  }

  constructor(private forDays: number, private sources: number[], private recipeSearchService: RecipeSearchService) {
    this.totalWork = (forDays + 1) * sources.length;
  }

  generate(): Observable<Menu> {
    this.isWorking = true;

    this.collectRecipeBookSizes()
      .pipe(delay(700))
      .subscribe({
        next: sizes => this.onRecipeBookSizesQueried(sizes)
      });

    return this.menu$;
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
    this.workDone = this.sources.length;
    this.checkIfSizesAreCorrect();
    if (!this.isFailed) {
      this.doGenerateMenu();
    }
  }

  private checkIfSizesAreCorrect() {
    this.recipeBookSizes.forEach(size => {
      if (size < this.forDays) {
        this.isFailed = true;
        this.isWorking = false;
        this.failureReason = "All recipe books must have at least as many recipes as the number of days requested!";
        this.workDone = this.totalWork;
      }
    });
  }

  private doGenerateMenu() {
    this.menu.groups = [];
    for (let i = 0; i < this.forDays; i++) {
      this.menu.groups.push({recipes: []});
    }

    this.menu.groups.forEach((forGroup, i) => this.generateCourses(forGroup, i))
  }

  private generateCourses(forGroup: MenuGroup, i: number) {
    forGroup.recipes = Array(this.sources.length);
    this.sources.forEach((rb, j) => this.findARandomNotAlreadyUsedRecipeFrom(rb, forGroup, i, j));
  }

  private findARandomNotAlreadyUsedRecipeFrom(recipeBook: number, forGroup: MenuGroup, groupOrder: number, courseOrder: number) {
    const queryParams = new RecipeQueryParams();
    queryParams.recipeBooks = [recipeBook];
    queryParams.limit = 1;
    queryParams.offset = this.chooseNotAlreadyUsedOffsetFor(recipeBook, courseOrder, groupOrder);

    this.recipeSearchService.query(queryParams)
      .pipe(delay(200))
      .subscribe({
        next: p => this.onFoundRecipe(forGroup, courseOrder, p.items[0]),
        error: () => this.onError()
      })
  }

  // TODO: fix recipeBookIndex, it increases wrongly
  private chooseNotAlreadyUsedOffsetFor(recipeBookId: number, courseOrder: number, recipeBookIndex: number): number {
    let byCourses = this.usedOffsetsByCourseAndRecipeBooks.get(courseOrder);
    if(byCourses == undefined) {
      byCourses = new Map<number, number[]>;
      this.usedOffsetsByCourseAndRecipeBooks.set(courseOrder, byCourses);
    }

    let byRecipeBook = byCourses.get(recipeBookId);
    if(byRecipeBook == undefined) {
      byRecipeBook = [];
      byCourses.set(recipeBookId, byRecipeBook);
    }

    const alreadyUsedOffsets = byRecipeBook;
    const recipeBookSize = this.recipeBookSizes[recipeBookIndex];

    let isChosenOffsetAlreadyUsed = true;
    let chosenOffset = -1;

    while (isChosenOffsetAlreadyUsed) {
      chosenOffset = Math.floor(Math.random() * recipeBookSize);
      console.log(chosenOffset)
      console.log(alreadyUsedOffsets)
      isChosenOffsetAlreadyUsed = alreadyUsedOffsets!.find(o => o == chosenOffset) != undefined;
    }

    alreadyUsedOffsets!.push(chosenOffset);

    return chosenOffset;
  }

  private onFoundRecipe(forGroup: MenuGroup, order: number, recipe: Recipe) {
    if (this.isFailed) {
      return;
    }

    forGroup.recipes[order] = recipe;
    this.workDone += 1;

    if (this.workDone == this.totalWork) {
      this.menu$.next(this.menu);
    }
  }

  private onError() {
    this.isFailed = true;
    this.workDone = this.totalWork;
  }
}
