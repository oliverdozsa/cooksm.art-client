import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGenerateRandomProgressComponent } from './menu-generate-random-progress.component';

describe('MenuGenerateRandomProgressComponent', () => {
  let component: MenuGenerateRandomProgressComponent;
  let fixture: ComponentFixture<MenuGenerateRandomProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuGenerateRandomProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuGenerateRandomProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
