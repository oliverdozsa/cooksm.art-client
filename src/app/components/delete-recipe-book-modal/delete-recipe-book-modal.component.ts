import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-delete-recipe-book-modal',
  templateUrl: './delete-recipe-book-modal.component.html',
  styleUrls: ['./delete-recipe-book-modal.component.scss']
})
export class DeleteRecipeBookModalComponent {
  name: string = "";

  constructor(public activeModal: NgbActiveModal) {
  }
}
