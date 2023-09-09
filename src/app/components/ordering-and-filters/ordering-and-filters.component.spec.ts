import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderingAndFiltersComponent } from './ordering-and-filters.component';

describe('OrderingAndFiltersComponent', () => {
  let component: OrderingAndFiltersComponent;
  let fixture: ComponentFixture<OrderingAndFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderingAndFiltersComponent]
    });
    fixture = TestBed.createComponent(OrderingAndFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
