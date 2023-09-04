import {Component, Input} from '@angular/core';
import {CookingTime, Recipe} from "../../data/recipe";

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent {
  CookingTime = CookingTime;

  @Input() recipe: Recipe | undefined;

  isFlipped: boolean = false;

  protected readonly Recipe = Recipe;
}
