import {Component, TemplateRef} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RecipesService} from "../../services/recipes.service";
import {SearchSnapshotService} from "../../services/search-snapshot.service";
import {SearchSnapshot} from "../../data/search-snapshot";

@Component({
  selector: 'app-reset-search-params',
  templateUrl: './reset-search-params.component.html',
  styleUrls: ['./reset-search-params.component.scss']
})
export class ResetSearchParamsComponent {
  constructor(private modalService: NgbModal, private recipesService: RecipesService) {
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content).result.then(() => this.onResetYes(), () => {});
  }

  private onResetYes() {
    this.recipesService.reset();
  }
}
