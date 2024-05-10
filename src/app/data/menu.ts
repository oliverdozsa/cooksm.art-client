import {Recipe} from "./recipe";

export interface Menu {
  id: number;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  recipe: Recipe;
  group: number;
  order: number;
}
