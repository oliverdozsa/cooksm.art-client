import {Component, OnDestroy} from '@angular/core';
import {TargetIngredients} from "../../data/target-ingredients";
import {UserService} from "../../services/user.service";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {distinctUntilChanged, Subject, takeUntil} from "rxjs";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {RecipesService} from "../../services/recipes.service";

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

  constructor(public userService: UserService, recipeBooksService: RecipeBooksService,
              private authService: SocialAuthService, private recipesService: RecipesService) {
    recipeBooksService.available$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.areRecipeBooksAvailable = true
      });

    authService.authState
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe({
        next: u => this.onAuthStateChange(u)
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onAuthStateChange(user: SocialUser | null) {
    if(user === null) {
      this.recipesService.resetSearchParamsThatNeedUserLogin();
    }
  }
}
