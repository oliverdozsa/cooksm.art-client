import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToRecipeBooksComponent } from './add-to-recipe-books.component';

describe('AddToRecipeBooksComponent', () => {
  let component: AddToRecipeBooksComponent;
  let fixture: ComponentFixture<AddToRecipeBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddToRecipeBooksComponent]
    });
    fixture = TestBed.createComponent(AddToRecipeBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
