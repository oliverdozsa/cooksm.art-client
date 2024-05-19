import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRecipeSearcherComponent } from './menu-recipe-searcher.component';

describe('MenuRecipeSearcherComponent', () => {
  let component: MenuRecipeSearcherComponent;
  let fixture: ComponentFixture<MenuRecipeSearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuRecipeSearcherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuRecipeSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
