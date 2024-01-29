import { Component } from '@angular/core';
import {TargetIngredients} from "../../data/target-ingredients";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-search-params',
  templateUrl: './search-params.component.html',
  styleUrls: ['./search-params.component.scss']
})
export class SearchParamsComponent {
  TargetIngredients = TargetIngredients;

  constructor(public userService: UserService) {
  }
}
