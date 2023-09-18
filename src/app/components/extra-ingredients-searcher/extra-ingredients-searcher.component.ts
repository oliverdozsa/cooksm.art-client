import {Component} from '@angular/core';
import {TargetIngredients} from "../../data/target-ingredients";
import {ExtraRelation} from "../../data/extra-ingredients";
import {RecipesService} from "../../services/recipes.service";

@Component({
  selector: 'app-extra-ingredients-searcher',
  templateUrl: './extra-ingredients-searcher.component.html',
  styleUrls: ['./extra-ingredients-searcher.component.scss']
})
export class ExtraIngredientsSearcherComponent {
  TargetIngredients = TargetIngredients;
  ExtraRelation = ExtraRelation;

  extraValueOptions = new Array(20);

  private _relation: ExtraRelation = ExtraRelation.CanBeMoreThan;
  private _relationValue: number = 1;

  constructor(private recipesService: RecipesService) {
  }

  set relation(value: ExtraRelation) {
    this._relation = value;
    this.recipesService.extraIngredientsRelationChanged(this.relation, this.relationValue);
  }

  get relation(): ExtraRelation {
    return this._relation;
  }

  set relationValue(value: number) {
    this._relationValue = value;
    this.recipesService.extraIngredientsRelationChanged(this.relation, this.relationValue);
  }

  get relationValue(): number {
    return this._relationValue;
  }
}
