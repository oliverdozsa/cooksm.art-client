import {delay, forkJoin, map, Observable, of, Subject} from "rxjs";
import {Menu, MenuGroup} from "../../../data/menu";
import {RecipeSearchService} from "../../../services/recipe-search.service";
import {RecipeQueryParams} from "../../../services/recipe-query-params";
import {Recipe} from "../../../data/recipe";
import {LanguageService} from "../../../services/language.service";
import {compareMenusByCommonIngredients} from "./menu-comparator";

export class RandomMenuGenerator {
  failureReason: string | undefined;

  private workDone: number = 0;
  private totalWorkForOneMenu: number = 0;
  private extraWorkForSource: number = 0;
  private totalWork: number = 0;

  private menu$: Subject<Menu> = new Subject<Menu>();
  private menu: Menu = {
    name: "",
    groups: []
  }

  private bestMenu: Menu = {
    name: "",
    groups: []
  }

  private recipeBookSizes: number[] = [];
  private usedOffsets: number[][] = [];

  private static RoundsForSameIngredientsGeneration: number = 50;

  get progress(): number {
    return Math.floor(this.workDone / this.totalWork * 100);
  }

  get isFailed(): boolean {
    return this.failureReason != undefined;
  }

  constructor(menuName: string, private forDays: number, private sources: number[], private tryUsingSameIngredientsForDifferentRecipes: boolean, private recipeSearchService: RecipeSearchService,
              private languageService: LanguageService) {
    this.menu.name = menuName;
    this.totalWorkForOneMenu = (forDays) * sources.length;
    this.extraWorkForSource = sources.length;

    if (this.tryUsingSameIngredientsForDifferentRecipes) {
      this.totalWork = this.totalWorkForOneMenu * RandomMenuGenerator.RoundsForSameIngredientsGeneration;
    } else {
      this.totalWork = this.totalWorkForOneMenu;
    }

    this.totalWork += this.extraWorkForSource;

    this.initUsedOffsets();

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
        this.failureReason = $localize`:@@random-menu-generator-sizes-are-not-correct:All recipe books must have at least as many recipes as the number of days requested!`;
        this.workDone = this.totalWorkForOneMenu;
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
    queryParams.languageId = this.languageService.usedLanguageId;

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

    const workDoneOnMenusOnly = this.workDone - this.extraWorkForSource;

    if(workDoneOnMenusOnly % this.totalWorkForOneMenu == 0) {
      if(compareMenusByCommonIngredients(this.bestMenu, this.menu) < 0) {
        this.bestMenu = JSON.parse(JSON.stringify(this.menu));
        const bestMenuRecipes = this.bestMenu.groups.map(g => g.recipes)
          .flat()
          .map(r => r!.name);
      }

      if(this.workDone < this.totalWork) {
        this.initUsedOffsets();
        this.doGenerateMenu();
      }
    }

    if (this.workDone == this.totalWork) {
      this.menu$.next(this.bestMenu);
    }
  }

  private initUsedOffsets() {
    this.usedOffsets = [];
    for (let i = 0; i < this.sources.length; i++) {
      this.usedOffsets.push([]);
    }
  }
}
