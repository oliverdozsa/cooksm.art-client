import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableListComponent } from './searchable-list.component';

describe('SearchableListComponent', () => {
  let component: SearchableListComponent;
  let fixture: ComponentFixture<SearchableListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchableListComponent]
    });
    fixture = TestBed.createComponent(SearchableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
