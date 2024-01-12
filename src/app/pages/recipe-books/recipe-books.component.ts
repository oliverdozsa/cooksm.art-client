import {Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {Subject, takeUntil} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  CreateNewRecipeBookModalComponent
} from "../../components/create-new-recipe-book-modal/create-new-recipe-book-modal.component";

@Component({
  selector: 'app-recipe-books',
  templateUrl: './recipe-books.component.html',
  styleUrls: ['./recipe-books.component.scss']
})
export class RecipeBooksComponent implements OnDestroy {
  showCreatePopover: boolean = false;

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

  onDeleteClicked() {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createNewRecipeBook(name: string) {
    this.recipeBooksService.create(name);
  }
}
