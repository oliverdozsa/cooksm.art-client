import {Recipe} from "./recipe";

export interface Menu {
  id?: number;
  name: string;
  groups: MenuGroup[];
}

export interface MenuGroup {
  recipes: Recipe[]
}

export interface MenuRequest {
  id?: number;
  name: string;
  groups: MenuGroupRequest[];
}

export interface MenuGroupRequest {
  recipes: number[]
}
