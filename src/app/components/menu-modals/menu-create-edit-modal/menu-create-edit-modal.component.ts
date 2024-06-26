import {Component, OnDestroy} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {MenuGenerateRandomlyComponent} from "../menu-generate-randomly/menu-generate-randomly.component";
import {Menu} from "../../../data/menu";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {Subject, takeUntil} from "rxjs";
import {Recipe} from "../../../data/recipe";
import {RecipeBooksService} from "../../../services/recipe-books.service";
import {
  MenuGenerateRandomProgressComponent
} from "../menu-generate-random-progress/menu-generate-random-progress.component";
import {RandomMenuGenerator} from "./random-menu-generator";
import {RecipeSearchService} from "../../../services/recipe-search.service";
import {LanguageService} from "../../../services/language.service";

@Component({
  selector: 'app-menu-create-edit-modal',
  templateUrl: './menu-create-edit-modal.component.html',
  styleUrl: './menu-create-edit-modal.component.scss'
})
export class MenuCreateEditModalComponent implements OnDestroy {
  menu: Menu = {
    name: "",
    groups: []
  }

  isReadOnly = false;
  isForUpdate: boolean = false;

  get isNameInvalid(): boolean {
    return this.menu.name.length < 2
  }

  get areGroupsInvalid(): boolean {
    if (this.menu.groups.length < 1) {
      this.invalidGroupsReason = InvalidGroupsReason.TooFewItems;
      return true;
    }

    const hasGroupWithNoRecipe = this.menu.groups.find(i => this.areRecipesInvalid(i.recipes));
    if (hasGroupWithNoRecipe) {
      this.invalidGroupsReason = InvalidGroupsReason.ItemsWithNoRecipe;
      return true;
    }

    this.invalidGroupsReason = InvalidGroupsReason.None;
    return false;
  }

  get itemsInvalidMessage(): string {
    if (this.invalidGroupsReason == InvalidGroupsReason.ItemsWithNoRecipe) {
      return $localize`:@@create-menu-modal-item-with-no-recipe:all items must have a recipe`;
    } else if (this.invalidGroupsReason == InvalidGroupsReason.TooFewItems) {
      return $localize`:@@create-menu-modal-too-few-recipes:must have at least one item`;
    }

    return "";
  }

  get isInvalid(): boolean {
    return this.isNameInvalid || this.areGroupsInvalid;
  }

  private invalidGroupsReason: InvalidGroupsReason = InvalidGroupsReason.None;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal,
              authService: SocialAuthService, public recipeBooksService: RecipeBooksService, private recipeSearchService: RecipeSearchService,
              private languageService: LanguageService) {
    authService.authState
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: u => this.onAuthStateChange(u)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddADay() {
    this.menu.groups.push({recipes: []});
  }

  onGenerateRandomlyClicked() {
    const modalRef = this.modalService.open(MenuGenerateRandomlyComponent);
    modalRef.result.then(generateRandomlyWith => {
      const days = generateRandomlyWith.days;
      const recipeSources = generateRandomlyWith.recipeSources;
      const tryUsingSameIngredientsForDifferentRecipes = generateRandomlyWith.tryUsingSameIngredientsForRecipes;

      const progressModalRef = this.modalService.open(MenuGenerateRandomProgressComponent, {
        backdrop: "static"
      });

      const randomMenuGenerator = new RandomMenuGenerator(this.menu.name, days, recipeSources, tryUsingSameIngredientsForDifferentRecipes, this.recipeSearchService, this.languageService);
      progressModalRef.componentInstance.generator = randomMenuGenerator;

      randomMenuGenerator.generate().subscribe({
        next: m => this.onMenuGenerated(m, progressModalRef)
      });
    })
  }

  onDayRemoved(i: number) {
    this.menu.groups.splice(i, 1);
  }

  private areRecipesInvalid(recipes: (Recipe | undefined)[]) {
    return recipes.length == 0 || recipes.includes(undefined);
  }

  private onAuthStateChange(user: SocialUser) {
    if (!user) {
      this.activeModal.dismiss();
    }
  }

  private onMenuGenerated(menu: Menu, progressModal: NgbModalRef) {
    this.menu = menu;
    setTimeout(() => progressModal.close(), 1000);
  }
}

export enum InvalidGroupsReason {
  None,
  TooFewItems,
  ItemsWithNoRecipe
}
