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

  coursesPerDay = 1;
  coursesOptions = MenuGenerateRandomlyComponent.generateOptions(MenuGenerateRandomlyComponent.maxCourses);

  get maxSources(): number[] {
    return MenuGenerateRandomlyComponent.generateOptions(this.coursesPerDay);
  }

  private static readonly maxDays = 14;
  private static readonly maxCourses = 5;

  constructor(public activeModal: NgbActiveModal, public recipeBooksService: RecipeBooksService) {
  }

  private static generateOptions(n: number) {
    return [...Array(n).keys()].map(i => i+1);
  }
}
