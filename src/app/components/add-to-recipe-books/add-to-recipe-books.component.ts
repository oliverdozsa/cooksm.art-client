import {Component, Input, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Recipe} from "../../data/recipe";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {RecipeBook, RecipeBooksOfRecipe} from "../../data/recipe-book";
import {ToastsService} from "../../services/toasts.service";
import {concat, concatWith} from "rxjs";

@Component({
  selector: 'app-add-to-recipe-books',
  templateUrl: './add-to-recipe-books.component.html',
  styleUrls: ['./add-to-recipe-books.component.scss']
})
export class AddToRecipeBooksComponent {
  @Input() recipe: Recipe | undefined;

  private recipeBooksOfRecipe: RecipeBooksOfRecipe | undefined;
  private workingOn: number[] = [];

  get isLoading(): boolean {
    return this.recipeBookService.isLoading || this.isLoadingRecipeBooksOfRecipe;
  }

  private isLoadingRecipeBooksOfRecipe: boolean = true;

  constructor(private modalService: NgbModal, public recipeBookService: RecipeBooksService, private toastService: ToastsService) {
  }

  open(content: TemplateRef<any>) {
    this.isLoadingRecipeBooksOfRecipe = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.recipeBookService.recipeBooksOf(this.recipe!.id).subscribe({
      next: r => this.onRecipeBooksOfRecipe(r),
      error: () => this.onError()
    })
  }

  isInRecipeBook(recipeBook: RecipeBook): boolean {
    if (this.recipeBooksOfRecipe) {
      return this.recipeBooksOfRecipe?.recipeBookIds.includes(recipeBook.id);
    }

    return false;
  }

  addToRecipeBook(recipeBook: RecipeBook) {
    this.workingOn.push(recipeBook.id);

    const addOp = this.recipeBookService.addToRecipeBook(this.recipe!.id, recipeBook.id);
    const reloadOp = this.recipeBookService.recipeBooksOf(this.recipe!.id);

    addOp
      .pipe(
        concatWith(reloadOp)
      )
      .subscribe({
        next: (r) => this.onRecipeBookOperationSuccess(recipeBook, r),
        error: () => this.onRecipeBookOperationError(recipeBook)
      });
  }

  removeFromRecipeBook(recipeBook: RecipeBook) {
    this.workingOn.push(recipeBook.id);

    const removeOp = this.recipeBookService.removeFromRecipeBook(this.recipe!.id, recipeBook.id);
    const reloadOp = this.recipeBookService.recipeBooksOf(this.recipe!.id);

    removeOp
      .pipe(
        concatWith(reloadOp)
      )
      .subscribe({
        next: (r) => this.onRecipeBookOperationSuccess(recipeBook, r),
        error: () => this.onRecipeBookOperationError(recipeBook)
      });
  }

  isWorkingOn(recipeBook: RecipeBook): boolean {
    return this.workingOn.includes(recipeBook.id);
  }

  private onRecipeBooksOfRecipe(recipeBooks: RecipeBooksOfRecipe) {
    this.isLoadingRecipeBooksOfRecipe = false;
    this.recipeBooksOfRecipe = recipeBooks;
  }

  private onError() {
    this.isLoadingRecipeBooksOfRecipe = false;
    const toastText = $localize`:@@add-to-recipe-books-on-error:Could not do it! 😥`
    this.toastService.danger(toastText);
  }

  private onRecipeBookOperationSuccess(recipeBook: RecipeBook, recipeBooksOfRecipe: any) {
    if(recipeBooksOfRecipe && Object.hasOwn(recipeBooksOfRecipe, "recipeBookIds")) {
      this.workingOn = this.workingOn.filter(r => r != recipeBook.id);
      this.recipeBooksOfRecipe = recipeBooksOfRecipe;
    }
  }

  private onRecipeBookOperationError(recipeBook: RecipeBook) {
    this.workingOn = this.workingOn.filter(r => r != recipeBook.id);
  }
}
