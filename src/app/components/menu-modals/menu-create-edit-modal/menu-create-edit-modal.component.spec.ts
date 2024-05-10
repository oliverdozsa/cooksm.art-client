import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCreateEditModalComponent } from './menu-create-edit-modal.component';

describe('MenuCreateEditModalComponent', () => {
  let component: MenuCreateEditModalComponent;
  let fixture: ComponentFixture<MenuCreateEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuCreateEditModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuCreateEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
