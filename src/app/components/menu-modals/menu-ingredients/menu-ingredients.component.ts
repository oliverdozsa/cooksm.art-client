import { Component } from '@angular/core';
import {Menu} from "../../../data/menu";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-menu-ingredients',
  templateUrl: './menu-ingredients.component.html',
  styleUrl: './menu-ingredients.component.scss'
})
export class MenuIngredientsComponent {
  menu: Menu = {
    name: "",
    groups: []
  };

  constructor(public activeModal: NgbActiveModal) {
  }
}
