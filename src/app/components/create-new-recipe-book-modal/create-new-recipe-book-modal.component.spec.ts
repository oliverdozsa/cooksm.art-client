import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewRecipeBookModalComponent } from './create-new-recipe-book-modal.component';

describe('CreateNewRecipeBookModalComponent', () => {
  let component: CreateNewRecipeBookModalComponent;
  let fixture: ComponentFixture<CreateNewRecipeBookModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewRecipeBookModalComponent]
    });
    fixture = TestBed.createComponent(CreateNewRecipeBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
