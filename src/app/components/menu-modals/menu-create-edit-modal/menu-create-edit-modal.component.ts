import {Component} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MenuGenerateRandomlyComponent} from "../menu-generate-randomly/menu-generate-randomly.component";
import {Menu, MenuRequest} from "../../../data/menu";

@Component({
  selector: 'app-menu-create-edit-modal',
  templateUrl: './menu-create-edit-modal.component.html',
  styleUrl: './menu-create-edit-modal.component.scss'
})
export class MenuCreateEditModalComponent {
  menu: MenuRequest = {
    name: "",
    groups: []
  }

  name: string = "";

  get isNameInvalid(): boolean {
    return this.menu.name.length < 2
  }

  get areGroupsInvalid(): boolean {
    if (this.menu.groups.length < 1) {
      this.invalidGroupsReason = InvalidGroupsReason.TooFewItems;
      return true;
    }

    const hasGroupWithNoRecipe = this.menu.groups.find(i => this.areRecipesInvalid(i.recipes));
    if (hasGroupWithNoRecipe) {
      this.invalidGroupsReason = InvalidGroupsReason.ItemsWithNoRecipe;
      return true;
    }

    this.invalidGroupsReason = InvalidGroupsReason.None;
    return false;
  }

  get itemsInvalidMessage(): string {
    if (this.invalidGroupsReason == InvalidGroupsReason.ItemsWithNoRecipe) {
      return "all items must have a recipe";
    } else if (this.invalidGroupsReason == InvalidGroupsReason.TooFewItems) {
      return "must have at least one item";
    }

    return "";
  }

  get isInvalid(): boolean {
    return this.isNameInvalid || this.areGroupsInvalid;
  }

  private invalidGroupsReason: InvalidGroupsReason = InvalidGroupsReason.None;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) {

  }

  onAddADay() {
    this.menu.groups.push({recipes: []});
  }

  onGenerateRandomlyClicked() {
    this.modalService.open(MenuGenerateRandomlyComponent);
  }

  private areRecipesInvalid(recipes: number[]) {
    return recipes.length == 0 || recipes.find(id => id == -1) != undefined;
  }
}

export enum InvalidGroupsReason {
  None,
  TooFewItems,
  ItemsWithNoRecipe
}
