import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-menu-create-edit-modal',
  templateUrl: './menu-create-edit-modal.component.html',
  styleUrl: './menu-create-edit-modal.component.scss'
})
export class MenuCreateEditModalComponent {
  isInvalid: boolean = false;
  constructor(public activeModal: NgbActiveModal) {
  }
}
