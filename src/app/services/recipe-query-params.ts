import {AppSearchMode} from "../data/app-search-mode";
import {DisplayedIngredient} from "../data/displayed-ingredient";

export enum ApiSearchMode {
  None = '',
  NumberBased = 'composed-of-number',
  RatioBased = 'composed-of-ratio'
}

export class RecipeQueryParams {
  searchMode?: string = ApiSearchMode.None;
  minIngs?: number;
  maxIngs?: number;
  orderBy?: string;
  orderBySort?: string;
  unknownIngs?: number;
  unknownIngsRel?: string;
  goodIngs?: number;
  goodAdditionalIngs?: number;
  goodAdditionalIngsRel?: string;
  goodIngsRel?: string;
  offset = 0;
  limit: number = -1;
  goodIngsRatio?: number;
  nameLike?: string;
  exIngs: number[] = [];
  exIngTags: number[] = [];
  inIngs: number[] = [];
  inIngTags: number[] = [];
  addIngs: number[] = [];
  addIngTags: number[] = [];
  sourcePages: number[] = [];
  times: number[] = [];
  languageId?: number;
  useFavoritesOnly?: boolean;
  recipeBooks: number[] = [];

  copy(): RecipeQueryParams {
    const copied = new RecipeQueryParams();

    copied.searchMode = this.searchMode;
    copied.minIngs = this.minIngs;
    copied.maxIngs = this.maxIngs;
    copied.orderBy = this.orderBy;
    copied.orderBySort = this.orderBySort;
    copied.unknownIngs = this.unknownIngs;
    copied.unknownIngsRel = this.unknownIngsRel;
    copied.goodIngs = this.goodIngs;
    copied.goodIngsRel = this.goodIngsRel;
    copied.goodAdditionalIngs = this.goodAdditionalIngs;
    copied.goodAdditionalIngsRel = this.goodAdditionalIngsRel;
    copied.offset = this.offset;
    copied.limit = this.limit;
    copied.goodIngsRatio = this.goodIngsRatio;
    copied.nameLike = this.nameLike;
    copied.languageId = this.languageId;
    copied.exIngs = this.copyArray(this.exIngs);
    copied.exIngTags = this.copyArray(this.exIngTags);
    copied.inIngs = this.copyArray(this.inIngs);
    copied.inIngTags = this.copyArray(this.inIngTags);
    copied.addIngs = this.copyArray(this.addIngs);
    copied.addIngTags = this.copyArray(this.addIngTags);
    copied.sourcePages = this.copyArray(this.sourcePages);
    copied.times = this.copyArray(this.times);
    copied.useFavoritesOnly = this.useFavoritesOnly;
    copied.recipeBooks = this.copyArray(this.recipeBooks);

    return copied;
  }


  equals(params: RecipeQueryParams): boolean {
    if (params === undefined) {
      return false;
    }

    if (this.searchMode !== params.searchMode ||
      this.minIngs !== params.minIngs ||
      this.maxIngs !== params.maxIngs ||
      this.orderBy !== params.orderBy ||
      this.orderBySort !== params.orderBySort ||
      this.unknownIngs !== params.unknownIngs ||
      this.unknownIngsRel !== params.unknownIngsRel ||
      this.goodIngs !== params.goodIngs ||
      this.goodIngsRel !== params.goodIngsRel ||
      this.goodAdditionalIngs !== params.goodAdditionalIngs ||
      this.goodAdditionalIngsRel !== params.goodAdditionalIngsRel ||
      this.offset !== params.offset ||
      this.limit !== params.limit ||
      this.goodIngsRatio !== params.goodIngsRatio ||
      this.nameLike !== params.nameLike ||
      this.languageId !== params.languageId ||
      !this.equalsArrayAsSets(this.exIngs, params.exIngs) ||
      !this.equalsArrayAsSets(this.exIngTags, params.exIngTags) ||
      !this.equalsArrayAsSets(this.inIngs, params.inIngs) ||
      !this.equalsArrayAsSets(this.inIngTags, params.inIngTags) ||
      !this.equalsArrayAsSets(this.addIngs, params.addIngs) ||
      !this.equalsArrayAsSets(this.addIngTags, params.addIngTags) ||
      !this.equalsArrayAsSets(this.sourcePages, params.sourcePages) ||
      !this.equalsArrayAsSets(this.times, params.times) ||
      this.useFavoritesOnly !== params.useFavoritesOnly ||
      !this.equalsArrayAsSets(this.recipeBooks, params.recipeBooks)) {
      return false;
    }

    return true;
  }

  setOffsetByPage(page: number) {
    this.offset = this.limit * (page - 1);
  }

  setAppSearchModeRelatedParts(appSearchMode: AppSearchMode) {
    this.unknownIngs = 0;

    if (appSearchMode === AppSearchMode.Contains) {
      this.searchMode = ApiSearchMode.NumberBased;
      this.unknownIngsRel = 'ge';
      this.goodIngsRel = 'ge';
      this.goodIngs = this.inIngs.length;
    }

    if (appSearchMode === AppSearchMode.ComposedOf) {
      // TODO: goodingsRatio? -> should be set from relevant control
      this.searchMode = ApiSearchMode.RatioBased;
      this.goodIngsRatio = 1;
    }

    if (appSearchMode === AppSearchMode.AnyOf) {
      this.searchMode = ApiSearchMode.NumberBased;
      this.unknownIngsRel = 'ge';
      this.goodIngsRel = 'gt';
      this.goodIngs = 0;
    }

    if (appSearchMode === AppSearchMode.StrictlyComposedOf) {
      this.searchMode = ApiSearchMode.NumberBased;
      this.unknownIngsRel = 'eq';
      this.unknownIngs = 0;
      this.goodIngsRel = 'eq';
      this.goodIngs = this.inIngs.length;
    }

    if(appSearchMode === AppSearchMode.None) {
      this.searchMode = ApiSearchMode.None;
    }
  }

  setIncludedParts(displayedIngredients: DisplayedIngredient[]) {
    this.inIngs = this.toIngredientIds(displayedIngredients);
    this.inIngTags = this.toIngredientTagIds(displayedIngredients);
  }

  setExcludedParts(displayedIngredients: DisplayedIngredient[]) {
    this.exIngs = this.toIngredientIds(displayedIngredients);
    this.exIngTags = this.toIngredientTagIds(displayedIngredients);
  }

  setAdditionalParts(displayedIngredients: DisplayedIngredient[]) {
    this.addIngs = this.toIngredientIds(displayedIngredients);
    this.addIngTags = this.toIngredientTagIds(displayedIngredients);
  }

  private equalsArrayAsSets(a: number[], b: number[]): boolean {
    if ((a !== undefined && b === undefined) || (a === undefined && b !== undefined)) {
      return false;
    }

    if (a === undefined && b === undefined) {
      return true;
    }

    const aSet: Set<number> = new Set<number>(a);
    const bSet: Set<number> = new Set<number>(b);
    if (aSet.size !== bSet.size) {
      return false;
    }

    for (const e of aSet.values()) {
      if (!bSet.has(e)) {
        return false;
      }
    }

    return true;
  }

  private copyArray(source: any[]): any[] {
    if (source) {
      return source.slice();
    }

    return source;
  }

  private toIngredientIds(displayedIngredients: DisplayedIngredient[]): number[] {
    return displayedIngredients.filter(i => !i.isCategory)
      .map(i => i.ingredientName?.id!);
  }

  private toIngredientTagIds(displayedIngredients: DisplayedIngredient[]): number[] {
    return displayedIngredients.filter(i => i.isCategory)
      .map(i => i.ingredientCategory?.id!);
  }
}
