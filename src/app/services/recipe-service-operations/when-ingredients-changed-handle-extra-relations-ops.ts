import {RecipeServiceOperation, RecipeServiceOperationType} from "../recipe-service-operation";
import {ExtraRelation} from "../../data/extra-ingredients";
import {SearchSnapshot} from "../../data/search-snapshot";
import {Subject} from "rxjs";
import {determineExtraRelation} from "../../data/saved-recipe-search";
import {SearchSnapshotUpdate} from "../../data/search-snapshot-ops/search-snapshot-update";

export class WhenIngredientsChangedHandleExtraRelationsOps {
  constructor(private snapshotForCurrentQuery: SearchSnapshot,
              private operation$: Subject<RecipeServiceOperation>) {
  }

  handleExtraRelationAdjustments() {
    const query = this.snapshotForCurrentQuery.search.query;

    const maxAllowedTotalIngredients = this.calcMaxAllowedTotalExtraIngredients();
    const isMoreExtraIngredientsAddedThanAllowed = query.goodAdditionalIngs != undefined &&
      query.goodAdditionalIngs > maxAllowedTotalIngredients;

    const shouldExtraRelationBeEnabled = this.shouldExtraRelationBeEnabled();
    this.enableExtraRelations(shouldExtraRelationBeEnabled);
    if (shouldExtraRelationBeEnabled) {
      this.setExtraIngredientsMaxOptionTo(maxAllowedTotalIngredients);
    }

    let relationToUse = determineExtraRelation(query);
    if(relationToUse === undefined) {
      relationToUse = ExtraRelation.CanBeMoreThan;
    }

    let relationValueToUse = isMoreExtraIngredientsAddedThanAllowed ?
      maxAllowedTotalIngredients : query.goodAdditionalIngs
    if(relationValueToUse == undefined) {
      relationValueToUse = 1;
    }

    if(shouldExtraRelationBeEnabled) {
      SearchSnapshotUpdate.withExtraRelation(relationToUse, relationValueToUse, this.snapshotForCurrentQuery);
    } else {
      SearchSnapshotUpdate.clearExtraRelation(this.snapshotForCurrentQuery);
    }

    this.setExtraIngredientsRelationAndValueTo(relationToUse, relationValueToUse);
  }

  private shouldExtraRelationBeEnabled() {
    const query = this.snapshotForCurrentQuery.search.query;

    const isAdditionalIngredientsPresent = query.addIngs != undefined && query.addIngs.length > 0;
    const isAdditionalIngredientTagsPresent = query.addIngTags != undefined && query.addIngTags.length > 0;

    return isAdditionalIngredientsPresent || isAdditionalIngredientTagsPresent;
  }

  private calcMaxAllowedTotalExtraIngredients() {
    const sumOfTotalIngredients = this.countTotalExtraIngredients();
    if (sumOfTotalIngredients > 20) {
      return 20;
    }

    if (sumOfTotalIngredients < 1) {
      return 1;
    }

    return sumOfTotalIngredients;
  }

  private countTotalExtraIngredients() {
    const query = this.snapshotForCurrentQuery.search.query;
    let sumOfIngredients = query.addIngs == undefined ? 0 : query.addIngs.length;
    let sumOfIngredientsOfCategories = query.addIngTags == undefined ? 0 :
      query.addIngTags.reduce((a, c) => a + c.ingredients.length, 0);
    return sumOfIngredientsOfCategories + sumOfIngredients;
  }

  private setExtraIngredientsMaxOptionTo(value: number) {
    this.operation$.next({
      type: RecipeServiceOperationType.SetExtraIngredientsRelationOptions,
      payload: {
        maxOptions: value
      }
    });
  }

  private setExtraIngredientsRelationAndValueTo(relation: ExtraRelation, value: number) {
    this.operation$.next({
      type: RecipeServiceOperationType.SetExtraIngredientsRelation,
      payload: {
        value: value,
        relation: relation
      }
    });
  }

  private enableExtraRelations(isEnabled: boolean) {
    const operationType = isEnabled ?
      RecipeServiceOperationType.EnableExtraIngredientsRelation : RecipeServiceOperationType.DisableExtraIngredientsRelation;

    this.operation$.next({
      type: operationType,
      payload: undefined
    });
  }
}
