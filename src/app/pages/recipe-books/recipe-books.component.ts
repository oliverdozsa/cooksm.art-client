import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-recipe-books',
  templateUrl: './recipe-books.component.html',
  styleUrls: ['./recipe-books.component.scss']
})
export class RecipeBooksComponent {
  constructor(public userService: UserService) {
  }

  onCreateNewClicked() {
    console.log("create new clicked.")
  }
}
