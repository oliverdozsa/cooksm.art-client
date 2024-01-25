import {Component, Input, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Recipe} from "../../data/recipe";
import {RecipeBooksService} from "../../services/recipe-books.service";

@Component({
  selector: 'app-add-to-recipe-books',
  templateUrl: './add-to-recipe-books.component.html',
  styleUrls: ['./add-to-recipe-books.component.scss']
})
export class AddToRecipeBooksComponent {
  @Input() recipe: Recipe | undefined;

  get isLoading(): boolean {
    return this.recipeBookService.isLoading || this.isLoadingRecipeBooksOfRecipe;
  }

  private isLoadingRecipeBooksOfRecipe: boolean = true;

  constructor(private modalService: NgbModal, public recipeBookService: RecipeBooksService) {
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
