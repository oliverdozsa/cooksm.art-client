import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {Subject, takeUntil} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  CreateNewRecipeBookModalComponent
} from "../../components/create-new-recipe-book-modal/create-new-recipe-book-modal.component";
import {SearchableListItemControl} from "../../components/searchable-list/searchable-list.component";
import {RecipeBook} from "../../data/recipe-book";
import {
  DeleteRecipeBookModalComponent
} from "../../components/delete-recipe-book-modal/delete-recipe-book-modal.component";

@Component({
  selector: 'app-recipe-books',
  templateUrl: './recipe-books.component.html',
  styleUrls: ['./recipe-books.component.scss']
})
export class RecipeBooksComponent implements OnDestroy {
  showCreatePopover: boolean = false;

  bookControls: SearchableListItemControl[] = [
    {icon: "bi-trash", onClick: item => this.onDeleteClicked(item)}
  ];

  private destroy$ = new Subject<void>();

  constructor(public userService: UserService, spinnerService: NgxSpinnerService, public recipeBooksService: RecipeBooksService,
              private modalService: NgbModal) {
    if (recipeBooksService.isLoading) {
      spinnerService.show("recipeBooks");
    } else if(userService.isLoggedIn) {
      setTimeout(() => {
        this.showCreatePopover = recipeBooksService.recipeBooks.length < 1;
      });
    }

    recipeBooksService.available$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.showCreatePopover = recipeBooksService.recipeBooks.length < 1
      })
  }

  onCreateNewClicked = () => {
    const modalRef = this.modalService.open(CreateNewRecipeBookModalComponent);
    modalRef.result.then(() => this.createNewRecipeBook(modalRef.componentInstance.name));
  }

  onDeleteClicked(recipeBook: RecipeBook) {
    const modalRef = this.modalService.open(DeleteRecipeBookModalComponent);
    modalRef.componentInstance.name = recipeBook.name;
    modalRef.result.then(() => this.deleteRecipeBook(recipeBook));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createNewRecipeBook(name: string) {
    this.recipeBooksService.create(name);
  }

  private deleteRecipeBook(recipeBook: RecipeBook) {
    this.recipeBooksService.delete(recipeBook.id);
  }
}
