import {Component, OnInit} from '@angular/core';
import {RecipesService} from "../../services/recipes.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private recipesService: RecipesService) {
  }

  public ngOnInit() {
    setTimeout(() => this.recipesService.queryInitialSnapshot());
  }
}
