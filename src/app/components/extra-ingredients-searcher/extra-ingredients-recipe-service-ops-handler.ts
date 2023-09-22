import {ExtraIngredientsSearcherComponent} from "./extra-ingredients-searcher.component";
import {RecipeServiceOperation, RecipeServiceOperationType} from "../../services/recipe-service-operation";

export class ExtraIngredientsRecipeServiceOpsHandler {
  constructor(private component: ExtraIngredientsSearcherComponent) {
  }

  process(operation: RecipeServiceOperation) {
    if(operation.type === RecipeServiceOperationType.SetExtraIngredientsRelationOptions) {
      this.handleSetExtraIngredientsRelationOptions(operation.payload);
    }

    if(operation.type === RecipeServiceOperationType.EnableExtraIngredientsRelation) {
      this.handleEnableOperation();
    }

    if(operation.type === RecipeServiceOperationType.DisableExtraIngredientsRelation) {
      this.handleDisableOperation();
    }

    if(operation.type === RecipeServiceOperationType.SetExtraIngredientsRelation) {
      this.handleSetExtraIngredientsRelation(operation.payload);
    }
  }

  private handleSetExtraIngredientsRelationOptions(payload: any) {
    this.component.setMaxOptions(payload.maxOptions);
  }

  private handleEnableOperation() {
    this.component.isEnabled = true;
  }

  private handleDisableOperation() {
    this.component.isEnabled = false;
  }

  private handleSetExtraIngredientsRelation(payload: any) {
    this.component.forceSetValueTo(payload.value);
    this.component.forceSetRelationTo(payload.relation);
  }
}
