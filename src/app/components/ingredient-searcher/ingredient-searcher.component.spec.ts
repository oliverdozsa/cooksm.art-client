import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientSearcherComponent } from './ingredient-searcher.component';

describe('IngredientSearcherComponent', () => {
  let component: IngredientSearcherComponent;
  let fixture: ComponentFixture<IngredientSearcherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientSearcherComponent]
    });
    fixture = TestBed.createComponent(IngredientSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
