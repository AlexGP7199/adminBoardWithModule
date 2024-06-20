import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogInFormComponent } from './user-log-in-form.component';

describe('UserLogInFormComponent', () => {
  let component: UserLogInFormComponent;
  let fixture: ComponentFixture<UserLogInFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserLogInFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserLogInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
