import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsConflictModalComponent } from './ingredients-conflict-modal.component';

describe('IngredientsConflictModalComponent', () => {
  let component: IngredientsConflictModalComponent;
  let fixture: ComponentFixture<IngredientsConflictModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientsConflictModalComponent]
    });
    fixture = TestBed.createComponent(IngredientsConflictModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
