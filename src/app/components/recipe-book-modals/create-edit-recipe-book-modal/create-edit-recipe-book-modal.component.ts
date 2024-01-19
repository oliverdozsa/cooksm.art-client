import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-create-edit-recipe-book-modal',
  templateUrl: './create-edit-recipe-book-modal.component.html',
  styleUrls: ['./create-edit-recipe-book-modal.component.scss']
})
export class CreateEditRecipeBookModalComponent {
  name: string = "";

  get isInvalid(): boolean {
    return this.name.length < 3;
  }

  constructor(public activeModal: NgbActiveModal) {
  }
}
