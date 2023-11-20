import {IngredientName} from "./ingredients";
import {SourcePage} from "./source-page";

export enum CookingTime {
  Quick,
  Average,
  Lengthy,
  Unknown
}

export class Recipe {
  id: number = -1;
  name: string = '<NOT SET>';
  url: string = '<NOT SET>';
  imageUrl: string | undefined = undefined;
  dateAdded: number = -1;
  numofings: number = -1;
  time: CookingTime = CookingTime.Unknown;
  ingredients: IngredientName[] = [];
  sourcePage: SourcePage  = {id: -1, name: '<NOT SET>', language: '<NOT SET>'};
}
