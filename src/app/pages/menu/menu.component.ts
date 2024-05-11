import {Component, OnDestroy} from '@angular/core';
import {UserService} from "../../services/user.service";

import {MenuService} from "../../services/menu.service";
import {SearchableListItemControl} from "../../components/searchable-list/searchable-list.component";
import {Subject, takeUntil} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  MenuCreateEditModalComponent
} from "../../components/menu-modals/menu-create-edit-modal/menu-create-edit-modal.component";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnDestroy{
  showCreatePopover: boolean = false;

  menuControls: SearchableListItemControl[] = [
    {icon: "bi-trash", onClick: item => this.onDeleteClicked(item)},
    {icon: "bi-pen", onClick: item => this.onEditClicked(item)},
    {icon: "bi-list-check", onClick: item => this.onShowIngredientsClicked(item)}
  ];

  private destroy$: Subject<void> = new Subject();

  constructor(public userService: UserService, public menuService: MenuService, spinnerService: NgxSpinnerService,
              private modalService: NgbModal) {
    if (menuService.isLoading) {
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
    // TODO
    // modalRef.result.then(() => this.createNewRecipeBook(modalRef.componentInstance.name));
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
