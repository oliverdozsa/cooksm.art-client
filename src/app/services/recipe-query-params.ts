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

  setOffsetByPage(page: number) {
    this.offset = this.limit * (page - 1);
  }

  equals(params: RecipeQueryParams | undefined): boolean {
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
}
