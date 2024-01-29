import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInRecipeBooksComponent } from './search-in-recipe-books.component';

describe('SearchInRecipeBooksComponent', () => {
  let component: SearchInRecipeBooksComponent;
  let fixture: ComponentFixture<SearchInRecipeBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchInRecipeBooksComponent]
    });
    fixture = TestBed.createComponent(SearchInRecipeBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
