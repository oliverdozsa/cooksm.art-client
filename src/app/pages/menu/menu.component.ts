import {Component, OnDestroy} from '@angular/core';
import {UserService} from "../../services/user.service";

import {MenuService} from "../../services/menu.service";
import {SearchableListItemControl} from "../../components/searchable-list/searchable-list.component";
import {Subject, takeUntil} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {
  MenuCreateEditModalComponent
} from "../../components/menu-modals/menu-create-edit-modal/menu-create-edit-modal.component";
import {NgxSpinnerService} from "ngx-spinner";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {Menu, MenuGroup, MenuGroupRequest, MenuRequest, MenuTitle} from "../../data/menu";
import {ToastsService} from "../../services/toasts.service";
import {MenuIngredientsComponent} from "../../components/menu-modals/menu-ingredients/menu-ingredients.component";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnDestroy {
  showCreatePopover: boolean = false;

  menuControls: SearchableListItemControl[] = [
    {icon: "bi-trash", onClick: item => this.onDeleteClicked(item)},
    {icon: "bi-pen", onClick: item => this.onEditClicked(item)},
    {icon: "bi-list-check", onClick: item => this.onShowIngredientsClicked(item)}
  ];

  get isLoading(): boolean {
    return this.menuService.isLoading || this.recipeBooksService.isLoading;
  }

  private destroy$: Subject<void> = new Subject();

  constructor(public userService: UserService, public menuService: MenuService, spinnerService: NgxSpinnerService,
              private modalService: NgbModal, private recipeBooksService: RecipeBooksService, private toasts: ToastsService) {
    if (this.isLoading) {
      spinnerService.show("menus");
    } else if (userService.isLoggedIn) {
      setTimeout(() => {
        this.showCreatePopover = menuService.menus.length < 1;
      });
    }

    menuService.available$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.showCreatePopover = menuService.menus.length < 1
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCreateNewClicked = () => {
    const modalRef = this.modalService.open(MenuCreateEditModalComponent, {size: "xl"});
    modalRef.result.then(() => this.createNewMenu(modalRef.componentInstance.menu));
  }

  onDeleteClicked(menu: MenuTitle) {
    this.menuService.delete(menu.id);
  }

  onEditClicked(menuTitle: MenuTitle) {
    const modalRef = this.openMenuFor(OpenMenuPurpose.Update, menuTitle.id);
    modalRef.result.then(() => this.updateMenu(modalRef.componentInstance.menu));
  }

  onShowIngredientsClicked(menuTitle: MenuTitle) {
    this.menuService.getById(menuTitle.id).subscribe({
      next: m => this.onMenuLoadedForShowIngredients(m),
      error: () => this.onMenuLoadFailed()
    })

  }

  onMenuClicked = (menu: MenuTitle) => {
    this.openMenuFor(OpenMenuPurpose.Read, menu.id);
  }

  private createNewMenu(menu: Menu) {
    this.menuService.create(this.toMenuRequest(menu));
  }

  private updateMenu(menu: Menu) {
    this.menuService.update(this.toMenuRequest(menu), menu.id!);
  }

  private toMenuRequest(menu: Menu): MenuRequest {
    return {
      name: menu.name,
      groups: menu.groups.map(g => this.toMenuGroupRequest(g))
    }
  }

  private toMenuGroupRequest(menuGroup: MenuGroup): MenuGroupRequest {
    return {
      recipes: menuGroup.recipes.map(r => r!.id)
    };
  }

  private openMenuFor(purpose: OpenMenuPurpose, menuId: number): NgbModalRef {
    const modalRef = this.modalService.open(MenuCreateEditModalComponent, {size: "xl"});
    const componentInstance = modalRef.componentInstance;

    if (purpose == OpenMenuPurpose.Read) {
      componentInstance.isReadOnly = true;
    }

    this.menuService.getById(menuId).subscribe({
      next: m => this.onMenuLoaded(componentInstance, m),
      error: () => this.onMenuLoadFailed()
    });

    return modalRef;
  }

  private onMenuLoaded(menuComponent: MenuCreateEditModalComponent, menu: Menu) {
    menuComponent.menu = menu;
  }

  private onMenuLoadFailed() {
    this.toasts.danger("Could not load menu.");
  }

  private onMenuLoadedForShowIngredients(menu: Menu) {
    const modalRef = this.modalService.open(MenuIngredientsComponent);
    modalRef.componentInstance.menu = menu;
  }
}

enum OpenMenuPurpose {
  Read,
  Update
}
