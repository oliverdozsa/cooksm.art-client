import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipePagingComponent } from './recipe-paging.component';

describe('RecipePagingComponent', () => {
  let component: RecipePagingComponent;
  let fixture: ComponentFixture<RecipePagingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipePagingComponent]
    });
    fixture = TestBed.createComponent(RecipePagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
