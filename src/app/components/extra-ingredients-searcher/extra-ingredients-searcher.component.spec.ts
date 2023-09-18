import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraIngredientsSearcherComponent } from './extra-ingredients-searcher.component';

describe('ExtraIngredientsSearcherComponent', () => {
  let component: ExtraIngredientsSearcherComponent;
  let fixture: ComponentFixture<ExtraIngredientsSearcherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtraIngredientsSearcherComponent]
    });
    fixture = TestBed.createComponent(ExtraIngredientsSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
