import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetSearchParamsComponent } from './reset-search-params.component';

describe('ResetSearchParamsComponent', () => {
  let component: ResetSearchParamsComponent;
  let fixture: ComponentFixture<ResetSearchParamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetSearchParamsComponent]
    });
    fixture = TestBed.createComponent(ResetSearchParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
