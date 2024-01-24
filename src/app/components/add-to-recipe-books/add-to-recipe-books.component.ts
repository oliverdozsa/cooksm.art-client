import {Component, Input, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-add-to-recipe-books',
  templateUrl: './add-to-recipe-books.component.html',
  styleUrls: ['./add-to-recipe-books.component.scss']
})
export class AddToRecipeBooksComponent {
  @Input() recipeId: number | undefined;

  constructor(private modalService: NgbModal) {
  }


  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        // TODO
      },
      (reason) => {
        // TODO
      },
    );
  }
}
