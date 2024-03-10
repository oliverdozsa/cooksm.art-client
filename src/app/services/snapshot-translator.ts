import {SearchSnapshot} from "../data/search-snapshot";
import {Observable, Subject} from "rxjs";
import {IngredientSearchService} from "./ingredient-search.service";
import {TargetIngredients} from "../data/target-ingredients";
import {IngredientCategory, IngredientName} from "../data/ingredients";

export class SnapshotTranslator {
  translated$: Subject<SearchSnapshot> = new Subject<SearchSnapshot>();
  private readonly kindOfIngredientsAndCategories = 6;
  private numOfWorkDone = 0;
  private hasErroredAlready = false;
  private targetLanguageId: number = 0;
  private snapshot: SearchSnapshot = new SearchSnapshot();

  constructor(private ingredientSearchService: IngredientSearchService) {
  }

  translate(targetLanguageId: number, snapshot: SearchSnapshot): void {
    this.numOfWorkDone = 0;
    this.hasErroredAlready = false;
    this.targetLanguageId = targetLanguageId;
    this.snapshot = snapshot;

    this.translateIngredients(TargetIngredients.Included);
    this.translateIngredients(TargetIngredients.Excluded);
    this.translateIngredients(TargetIngredients.Extra);

    this.translateCategories(TargetIngredients.Included);
    this.translateCategories(TargetIngredients.Excluded);
    this.translateCategories(TargetIngredients.Extra);
  }

  private translateIngredients(target: TargetIngredients) {
    const ingredients = this.selectIngredientsBy(target);

    if (ingredients == undefined || ingredients.length == 0) {
      this.workDone();
      return;
    }

    const ingredientIds = ingredients?.map(i => i.id);
    this.ingredientSearchService.byIngredientIds(this.targetLanguageId, ingredientIds)
      .subscribe({
        next: i => this.onTranslatedIngredients(target, i),
        error: () => this.onError()
      });
  }

  private translateCategories(target: TargetIngredients) {
    const categories = this.selectCategoriesBy(target);

    if (categories == undefined || categories.length == 0) {
      this.workDone();
      return;
    }

    const categoriesIds = categories?.map(i => i.id);
    this.ingredientSearchService.byCategoryIds(this.targetLanguageId, categoriesIds)
      .subscribe({
        next: i => this.onTranslatedCategories(target, i),
        error: () => this.onError()
      });
  }

  private selectIngredientsBy(target: TargetIngredients): IngredientName[] | undefined {
    const query = this.snapshot.search.query;
    if (target == TargetIngredients.Included) {
      return query.inIngs;
    } else if (target == TargetIngredients.Excluded) {
      return query.exIngs;
    } else if (target == TargetIngredients.Extra) {
      return query.addIngs;
    }

    return undefined;
  }

  private selectCategoriesBy(target: TargetIngredients): IngredientCategory[] | undefined {
    const query = this.snapshot.search.query;
    if (target == TargetIngredients.Included) {
      return query.inIngTags;
    } else if (target == TargetIngredients.Excluded) {
      return query.exIngTags;
    } else if (target == TargetIngredients.Extra) {
      return query.addIngTags;
    }

    return undefined;
  }

  private workDone() {
    this.numOfWorkDone += 1;

    if (this.numOfWorkDone == this.kindOfIngredientsAndCategories && !this.hasErroredAlready) {
      this.translated$.next(this.snapshot);
    }
  }

  private onTranslatedIngredients(target: TargetIngredients, ingredients: IngredientName[]) {
    const query = this.snapshot.search.query;

    if (target == TargetIngredients.Included) {
      query.inIngs = ingredients;
    } else if (target == TargetIngredients.Excluded) {
      query.exIngs = ingredients;
    } else if (target == TargetIngredients.Extra) {
      query.addIngs = ingredients;
    }

    this.workDone();
  }

  private onTranslatedCategories(target: TargetIngredients, categories: IngredientCategory[]) {
    const query = this.snapshot.search.query;

    if (target == TargetIngredients.Included) {
      query.inIngTags = categories;
    } else if (target == TargetIngredients.Excluded) {
      query.exIngTags = categories;
    } else if (target == TargetIngredients.Extra) {
      query.addIngTags = categories;
    }

    this.workDone();
  }

  private onError() {
    if(!this.hasErroredAlready) {
      this.hasErroredAlready = true;
      this.translated$.error({});
    }
  }
}
