import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsOfRecipeBookModalComponent } from './ingredients-of-recipe-book-modal.component';

describe('IngredientsOfRecipeBookModalComponent', () => {
  let component: IngredientsOfRecipeBookModalComponent;
  let fixture: ComponentFixture<IngredientsOfRecipeBookModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientsOfRecipeBookModalComponent]
    });
    fixture = TestBed.createComponent(IngredientsOfRecipeBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
