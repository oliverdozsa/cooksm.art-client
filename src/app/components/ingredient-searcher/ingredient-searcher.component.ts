import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-ingredient-searcher',
  templateUrl: './ingredient-searcher.component.html',
  styleUrls: ['./ingredient-searcher.component.scss']
})
export class IngredientSearcherComponent {
  isInputFocused = false;

  inputElementFocused() {
    this.isInputFocused = true;
  }

  inputElementLostFocus() {
    this.isInputFocused = false;
  }
}
