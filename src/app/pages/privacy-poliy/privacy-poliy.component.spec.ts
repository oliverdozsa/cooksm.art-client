import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPoliyComponent } from './privacy-poliy.component';

describe('PrivacyPoliyComponent', () => {
  let component: PrivacyPoliyComponent;
  let fixture: ComponentFixture<PrivacyPoliyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPoliyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivacyPoliyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
