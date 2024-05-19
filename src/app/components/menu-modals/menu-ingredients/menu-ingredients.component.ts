import {Component} from '@angular/core';
import {Menu, MenuGroup} from "../../../data/menu";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {IngredientName} from "../../../data/ingredients";
import {Recipe} from "../../../data/recipe";
import {ClipboardService} from "ngx-clipboard";
import {ToastsService} from "../../../services/toasts.service";

@Component({
  selector: 'app-menu-ingredients',
  templateUrl: './menu-ingredients.component.html',
  styleUrl: './menu-ingredients.component.scss'
})
export class MenuIngredientsComponent {
  ingredients: IngredientName[] = [];
  private uniqueIngredients: Map<number, IngredientName> = new Map();
  private includedIngredients: Set<number> = new Set<number>();

  get isNoneIncluded(): boolean {
    return this.includedIngredients.size == 0;
  }

  get menu(): Menu {
    return this._menu;
  }

  set menu(value: Menu) {
    this._menu = value;
    this.determineUniqueIngredients();
  }

  private _menu: Menu = {
    name: "",
    groups: []
  };

  constructor(public activeModal: NgbActiveModal, private clipboardService: ClipboardService, private toasts: ToastsService) {
  }

  onIncludedToggleClick(id: number) {
    if (this.isIncluded(id)) {
      this.includedIngredients.delete(id);
    } else {
      this.includedIngredients.add(id);
    }

    this.moveIncludedToTheTop();
  }

  isIncluded(id: number) {
    return this.includedIngredients.has(id);
  }

  onCopySelectedToClipboardClick() {
    const includedNames = this.ingredients
      .filter(i => this.isIncluded(i.id))
      .map(i => i.name);

    const clipboardText = includedNames.join("\n");
    this.clipboardService.copy(clipboardText);

    const message = $localize`:@@ingredients-of-menu-copied-to-clipboard:${includedNames.length} ingredient(s) has been copied to clipboard`;
    this.toasts.success(message);
  }

  private determineUniqueIngredients() {
    this.menu.groups.forEach(g => this.addIngredientsFromGroup(g));
    this.ingredients = Array.from(this.uniqueIngredients.values());
  }

  private addIngredientsFromGroup(group: MenuGroup) {
    group.recipes.forEach(r => this.addIngredientsFromRecipe(r!));
  }

  private addIngredientsFromRecipe(recipe: Recipe) {
    recipe.ingredients.forEach(i => this.uniqueIngredients.set(i.id, i));
  }

  private moveIncludedToTheTop() {
    const includedIds = this.ingredients
      .filter(i => this.isIncluded(i.id))
      .map(i => i.id);

    const includeds = this.ingredients.filter(i => includedIds.includes(i.id));
    const ignoreds = this.ingredients.filter(i => !includedIds.includes(i.id));

    this.ingredients = includeds.concat(ignoreds);
  }
}
