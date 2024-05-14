import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {RecipeBooksService} from "../../../services/recipe-books.service";

@Component({
  selector: 'app-menu-generate-randomly',
  templateUrl: './menu-generate-randomly.component.html',
  styleUrl: './menu-generate-randomly.component.scss'
})
export class MenuGenerateRandomlyComponent {
  days = 1;
  daysOptions = MenuGenerateRandomlyComponent.generateOptions(MenuGenerateRandomlyComponent.maxDays);

  coursesOptions = MenuGenerateRandomlyComponent.generateOptions(MenuGenerateRandomlyComponent.maxCourses);

  recipeSources: number[] = [];

  get coursesPerDay(): number {
    return this._coursesPerDay;
  }

  set coursesPerDay(value: number) {
    if(this._coursesPerDay < value) {
      const numOfNewSource = value - this._coursesPerDay;
      const newSources = Array<number>(numOfNewSource).fill(this.recipeBooksService.recipeBooks[0].id)
      this.recipeSources = this.recipeSources.concat(newSources);
    } else if(this._coursesPerDay > value) {
      const sourcesToDelete = this._coursesPerDay - value;
      this.recipeSources.splice(this.recipeSources.length - sourcesToDelete, sourcesToDelete);
    }

    this._coursesPerDay = value;
  }

  private _coursesPerDay = 1;

  get maxSources(): number[] {
    return MenuGenerateRandomlyComponent.generateOptions(this.coursesPerDay);
  }

  private static readonly maxDays = 14;
  private static readonly maxCourses = 5;

  constructor(public activeModal: NgbActiveModal, public recipeBooksService: RecipeBooksService) {
    this.recipeSources = [recipeBooksService.recipeBooks[0].id];
  }

  private static generateOptions(n: number) {
    return [...Array(n).keys()].map(i => i+1);
  }
}
