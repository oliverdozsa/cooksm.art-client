import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {UserService} from "../../services/user.service";
import {NgxSpinnerModule} from "ngx-spinner";
import {MenuService} from "../../services/menu.service";
import {SearchableListItemControl} from "../../components/searchable-list/searchable-list.component";
import {RecipeBook} from "../../data/recipe-book";
import {AppModule} from "../../app.module";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  showCreatePopover: boolean = false;

  menuControls: SearchableListItemControl[] = [
    {icon: "bi-trash", onClick: item => this.onDeleteClicked(item)},
    {icon: "bi-pen", onClick: item => this.onEditClicked(item)},
    {icon: "bi-list-check", onClick: item => this.onShowIngredientsClicked(item)}
  ];

  constructor(public userService: UserService, public menuService: MenuService) {
  }

  onCreateNewClicked = () => {
    // TODO
  }

  onDeleteClicked(item: any) {
    // TODO
  }

  onEditClicked(item: any) {
    // TODO
  }

  onShowIngredientsClicked(item: any) {
    // TODO
  }

  onMenuClicked = (menu: any) => {
    // TODO
  }
}
