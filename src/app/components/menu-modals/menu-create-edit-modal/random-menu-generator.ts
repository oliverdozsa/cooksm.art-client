import {delay, forkJoin, map, Observable, of, Subject} from "rxjs";
import {Menu, MenuGroup} from "../../../data/menu";
import {RecipeSearchService} from "../../../services/recipe-search.service";
import {RecipeQueryParams} from "../../../services/recipe-query-params";
import {Recipe} from "../../../data/recipe";

export class RandomMenuGenerator {
  failureReason: string | undefined;

  private workDone: number = 0;
  private totalWork: number = 0;

  private menu$: Subject<Menu> = new Subject<Menu>();
  private menu: Menu = {
    name: "",
    groups: []
  }

  private recipeBookSizes: number[] = [];
  private usedOffsets: number[][] = [];

  get progress(): number {
    return Math.floor(this.workDone / this.totalWork * 100);
  }

  get isFailed(): boolean {
    return this.failureReason != undefined;
  }

  constructor(private forDays: number, private sources: number[], private recipeSearchService: RecipeSearchService) {
    this.totalWork = (forDays + 1) * sources.length;
    for (let i = 0; i < this.sources.length; i++) {
      this.usedOffsets.push([]);
    }

    for (let i = 0; i < this.forDays; i++) {
      const menuGroup: MenuGroup = {recipes: Array(this.sources.length)};
      this.menu.groups.push(menuGroup);
    }
  }

  generate(): Observable<Menu> {
    this.collectRecipeBookSizes().subscribe({
      next: s => this.onRecipeBookSizesCollected(s)
    })

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

  private onRecipeBookSizesCollected(sizes: number[]) {
    this.workDone = this.sources.length;
    this.recipeBookSizes = sizes;
    this.checkIfSizesAreCorrect();

    if (!this.isFailed) {
      this.doGenerateMenu();
    }
  }

  private checkIfSizesAreCorrect() {
    this.recipeBookSizes.forEach(size => {
      if (size < this.forDays) {
        this.failureReason = "All recipe books must have at least as many recipes as the number of days requested!";
        this.workDone = this.totalWork;
      }
    });
  }

  private doGenerateMenu() {
    for (let i = 0; i < this.forDays; i++) {
      this.generateCoursesForGroup(i);
    }
  }

  private generateCoursesForGroup(group: number) {
    for (let indexOfSource = 0; indexOfSource < this.sources.length; indexOfSource++) {
      this.findRecipeFor(indexOfSource)
        .subscribe({
          next: r => this.addRecipeTo(group, indexOfSource, r)
        });
    }
  }

  private findRecipeFor(indexOfSource: number): Observable<Recipe> {
    const queryParams: RecipeQueryParams = new RecipeQueryParams();
    queryParams.offset = this.chooseANotUsedOffsetFor(indexOfSource);
    queryParams.limit = 1;
    queryParams.recipeBooks = [this.sources[indexOfSource]];

    return this.recipeSearchService.query(queryParams)
      .pipe(
        delay(200),
        map(p => p.items[0])
      )
  }

  private chooseANotUsedOffsetFor(indexOfSource: number): number {
    const recipeBookSize = this.recipeBookSizes[indexOfSource];

    let chosenOffset = Math.floor(Math.random() * recipeBookSize);
    let isUsed = this.usedOffsets[indexOfSource].includes(chosenOffset);

    while (isUsed) {
      chosenOffset = Math.floor(Math.random() * recipeBookSize);
      isUsed = this.usedOffsets[indexOfSource].includes(chosenOffset);
    }

    this.usedOffsets[indexOfSource].push(chosenOffset);

    return chosenOffset;
  }

  private addRecipeTo(group: number, order: number, recipe: Recipe) {
    this.menu.groups[group].recipes[order] = recipe;
    this.workDone += 1;

    if (this.workDone == this.totalWork) {
      this.menu$.next(this.menu);
    }
  }
}
