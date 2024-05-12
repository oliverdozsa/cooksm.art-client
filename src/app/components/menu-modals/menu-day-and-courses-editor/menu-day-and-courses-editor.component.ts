import {Component, Input} from '@angular/core';
import {MenuGroupRequest} from "../../../data/menu";

@Component({
  selector: 'app-menu-day-and-courses-editor',
  templateUrl: './menu-day-and-courses-editor.component.html',
  styleUrl: './menu-day-and-courses-editor.component.scss'
})
export class MenuDayAndCoursesEditorComponent {
  @Input()
  day: number | undefined;

  @Input()
  group: MenuGroupRequest | undefined;

  onCourseAddClick() {
    this.group?.recipes.push(-1);
  }
}
