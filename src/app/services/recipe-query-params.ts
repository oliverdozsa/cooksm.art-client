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
}
