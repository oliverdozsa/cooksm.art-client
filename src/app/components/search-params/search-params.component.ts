import {Component, OnDestroy} from '@angular/core';
import {TargetIngredients} from "../../data/target-ingredients";
import {UserService} from "../../services/user.service";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-search-params',
  templateUrl: './search-params.component.html',
  styleUrls: ['./search-params.component.scss']
})
export class SearchParamsComponent implements OnDestroy {
  TargetIngredients = TargetIngredients;

  get shouldAllowSearchInRecipeBooks(): boolean {
    return this.userService.isLoggedIn && this.areRecipeBooksAvailable;
  }

  private areRecipeBooksAvailable: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public userService: UserService, recipeBooksService: RecipeBooksService) {
    recipeBooksService.available$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.areRecipeBooksAvailable = true
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
