import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGenerateRandomlyComponent } from './menu-generate-randomly.component';

describe('MenuGenerateRandomlyComponent', () => {
  let component: MenuGenerateRandomlyComponent;
  let fixture: ComponentFixture<MenuGenerateRandomlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuGenerateRandomlyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuGenerateRandomlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
