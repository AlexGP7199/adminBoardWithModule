import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStandarComponent } from './form-standar.component';

describe('FormStandarComponent', () => {
  let component: FormStandarComponent;
  let fixture: ComponentFixture<FormStandarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormStandarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormStandarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
