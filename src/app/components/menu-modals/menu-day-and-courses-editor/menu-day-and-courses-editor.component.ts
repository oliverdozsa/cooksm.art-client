import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MenuGroup, MenuGroupRequest} from "../../../data/menu";
import {Recipe} from "../../../data/recipe";

@Component({
  selector: 'app-menu-day-and-courses-editor',
  templateUrl: './menu-day-and-courses-editor.component.html',
  styleUrl: './menu-day-and-courses-editor.component.scss'
})
export class MenuDayAndCoursesEditorComponent {
  @Input()
  day: number | undefined;

  @Input()
  group: MenuGroup | undefined;

  @Output()
  remove: EventEmitter<void> = new EventEmitter<void>();

  onCourseAddClick() {
    this.group?.recipes.push(undefined);
  }

  onCourseRemoved(i: number) {
    this.group?.recipes.splice(i, 1);
  }

  shouldShowDivider(courseOrder: number) {
    if(this.group == undefined) {
      return false;
    }

    return this.group.recipes.length > 1 && courseOrder < this.group.recipes.length - 1;
  }

  onRecipeSelected(recipe: Recipe, i: number) {
    this.group!.recipes[i] = recipe;
  }
}
