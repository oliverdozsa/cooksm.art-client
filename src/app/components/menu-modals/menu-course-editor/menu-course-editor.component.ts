import { Component } from '@angular/core';
import {RecipeBooksService} from "../../../services/recipe-books.service";

@Component({
  selector: 'app-menu-course-editor',
  templateUrl: './menu-course-editor.component.html',
  styleUrl: './menu-course-editor.component.scss'
})
export class MenuCourseEditorComponent {
  constructor(public recipeBooksService: RecipeBooksService) {

  }
}
