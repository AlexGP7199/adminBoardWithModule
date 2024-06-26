import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsFancyComponent } from './forms-fancy.component';

describe('FormsFancyComponent', () => {
  let component: FormsFancyComponent;
  let fixture: ComponentFixture<FormsFancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsFancyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormsFancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
