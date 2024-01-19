import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditRecipeBookModalComponent } from './create-edit-recipe-book-modal.component';

describe('CreateNewRecipeBookModalComponent', () => {
  let component: CreateEditRecipeBookModalComponent;
  let fixture: ComponentFixture<CreateEditRecipeBookModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditRecipeBookModalComponent]
    });
    fixture = TestBed.createComponent(CreateEditRecipeBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
