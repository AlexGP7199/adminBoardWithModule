import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSolicitudValidacionFechasComponent } from './form-solicitud-validacion-fechas.component';

describe('FormSolicitudValidacionFechasComponent', () => {
  let component: FormSolicitudValidacionFechasComponent;
  let fixture: ComponentFixture<FormSolicitudValidacionFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormSolicitudValidacionFechasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSolicitudValidacionFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
