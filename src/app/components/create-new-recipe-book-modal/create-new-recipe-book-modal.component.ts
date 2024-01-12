import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-create-new-recipe-book-modal',
  templateUrl: './create-new-recipe-book-modal.component.html',
  styleUrls: ['./create-new-recipe-book-modal.component.scss']
})
export class CreateNewRecipeBookModalComponent {
  name: string = "";

  get isInvalid(): boolean {
    return this.name.length < 3;
  }

  constructor(public activeModal: NgbActiveModal) {
  }
}
