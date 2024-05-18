import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuIngredientsComponent } from './menu-ingredients.component';

describe('MenuIngredientsComponent', () => {
  let component: MenuIngredientsComponent;
  let fixture: ComponentFixture<MenuIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuIngredientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
