import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchModeComponent } from './search-mode.component';

describe('SearchModeComponent', () => {
  let component: SearchModeComponent;
  let fixture: ComponentFixture<SearchModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchModeComponent]
    });
    fixture = TestBed.createComponent(SearchModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
