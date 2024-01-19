import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {Subject, takeUntil} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  CreateEditRecipeBookModalComponent
} from "../../components/recipe-book-modals/create-edit-recipe-book-modal/create-edit-recipe-book-modal.component";
import {SearchableListItemControl} from "../../components/searchable-list/searchable-list.component";
import {RecipeBook} from "../../data/recipe-book";
import {
  DeleteRecipeBookModalComponent
} from "../../components/recipe-book-modals/delete-recipe-book-modal/delete-recipe-book-modal.component";
import {
  IngredientsOfRecipeBookModalComponent
} from "../../components/recipe-book-modals/ingredients-of-recipe-book-modal/ingredients-of-recipe-book-modal.component";

@Component({
  selector: 'app-recipe-books',
  templateUrl: './recipe-books.component.html',
  styleUrls: ['./recipe-books.component.scss']
})
export class RecipeBooksComponent implements OnDestroy {
  showCreatePopover: boolean = false;

  bookControls: SearchableListItemControl[] = [
    {icon: "bi-trash", onClick: item => this.onDeleteClicked(item)},
    {icon: "bi-pen", onClick: item => this.onEditClicked(item)},
    {icon: "bi-list-check", onClick: item => this.onShowIngredientsClicked(item)}
  ];

  private destroy$ = new Subject<void>();

  constructor(public userService: UserService, spinnerService: NgxSpinnerService, public recipeBooksService: RecipeBooksService,
              private modalService: NgbModal) {
    if (recipeBooksService.isLoading) {
      spinnerService.show("recipeBooks");
    } else if (userService.isLoggedIn) {
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
    const modalRef = this.modalService.open(CreateEditRecipeBookModalComponent);
    modalRef.result.then(() => this.createNewRecipeBook(modalRef.componentInstance.name));
  }

  onDeleteClicked(recipeBook: RecipeBook) {
    const modalRef = this.modalService.open(DeleteRecipeBookModalComponent);
    modalRef.componentInstance.name = recipeBook.name;
    modalRef.result.then(() => this.deleteRecipeBook(recipeBook));
  }

  onEditClicked(recipeBook: RecipeBook) {
    const modalRef = this.modalService.open(CreateEditRecipeBookModalComponent);
    modalRef.componentInstance.name = recipeBook.name;
    modalRef.result.then(() => this.updateRecipeBookName(recipeBook, modalRef.componentInstance.name));
  }

  onShowIngredientsClicked(recipeBook: RecipeBook) {
    const modalRef = this.modalService.open(IngredientsOfRecipeBookModalComponent);
    modalRef.componentInstance.recipeBook = recipeBook;
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

  private updateRecipeBookName(recipeBook: RecipeBook, newName: string) {
    recipeBook.name = newName;
    this.recipeBooksService.updateName(recipeBook);
  }
}
