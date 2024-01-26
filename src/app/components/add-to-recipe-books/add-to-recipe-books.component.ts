import {Component, Input, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Recipe} from "../../data/recipe";
import {RecipeBooksService} from "../../services/recipe-books.service";
import {RecipeBooksOfRecipe} from "../../data/recipe-book";
import {ToastsService} from "../../services/toasts.service";

@Component({
  selector: 'app-add-to-recipe-books',
  templateUrl: './add-to-recipe-books.component.html',
  styleUrls: ['./add-to-recipe-books.component.scss']
})
export class AddToRecipeBooksComponent {
  @Input() recipe: Recipe | undefined;

  private recipeBooksOfRecipe: RecipeBooksOfRecipe | undefined;

  get isLoading(): boolean {
    return this.recipeBookService.isLoading || this.isLoadingRecipeBooksOfRecipe;
  }

  private isLoadingRecipeBooksOfRecipe: boolean = true;

  constructor(private modalService: NgbModal, public recipeBookService: RecipeBooksService, private toastService: ToastsService) {
  }

  open(content: TemplateRef<any>) {
    this.isLoadingRecipeBooksOfRecipe = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.recipeBookService.recipeBooksOf(this.recipe!.id).subscribe({
      next: r => this.onRecipeBooksOfRecipe(r),
      error: () => this.onError()
    })
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
}
