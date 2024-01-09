import {Component, OnDestroy} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-recipe-books',
  templateUrl: './recipe-books.component.html',
  styleUrls: ['./recipe-books.component.scss']
})
export class RecipeBooksComponent implements OnDestroy {
  showCreatePopover: boolean = false;

  private destroy$ = new Subject<void>()

  constructor(public userService: UserService, spinnerService: NgxSpinnerService, public recipeBooksService: RecipeBooksService) {
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

  onCreateNewClicked() {
    // TODO
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
