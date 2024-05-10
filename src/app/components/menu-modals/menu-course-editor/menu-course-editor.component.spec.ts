import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCourseEditorComponent } from './menu-course-editor.component';

describe('MenuCourseEditorComponent', () => {
  let component: MenuCourseEditorComponent;
  let fixture: ComponentFixture<MenuCourseEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuCourseEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuCourseEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
