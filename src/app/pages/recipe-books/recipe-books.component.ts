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

@Component({
  selector: 'app-recipe-books',
  templateUrl: './recipe-books.component.html',
  styleUrls: ['./recipe-books.component.scss']
})
export class RecipeBooksComponent implements OnDestroy {
  showCreatePopover: boolean = false;

  bookControls: SearchableListItemControl[] = [
    {icon:"bi-trash", onClick: item => this.onDeleteClicked(item)}
  ];

  private destroy$ = new Subject<void>();

  constructor(public userService: UserService, private spinnerService: NgxSpinnerService, public recipeBooksService: RecipeBooksService,
              private modalService: NgbModal) {
    if (recipeBooksService.isLoading) {
      spinnerService.show("recipeBooks");
    } else {
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
    console.log(`delete: ${recipeBook.id}`);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createNewRecipeBook(name: string) {
    this.recipeBooksService.create(name);
  }
}
