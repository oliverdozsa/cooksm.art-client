import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDayAndCoursesEditorComponent } from './menu-day-and-courses-editor.component';

describe('MenuDayAndCoursesEditorComponent', () => {
  let component: MenuDayAndCoursesEditorComponent;
  let fixture: ComponentFixture<MenuDayAndCoursesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuDayAndCoursesEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuDayAndCoursesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
