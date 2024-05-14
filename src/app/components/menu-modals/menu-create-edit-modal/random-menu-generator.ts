import {Menu} from "../../../data/menu";

export class RandomMenuGenerator {
  progress = 0;
  constructor(private forDays: number, private sources: number[]) {
  }

  generate(): Menu {
    const menu = {
      name: "",
      groups: []
    }

    // TODO

    return menu;
  }
}
