import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudLicenciaMedicaComponent } from './solicitud-licencia-medica.component';

describe('SolicitudLicenciaMedicaComponent', () => {
  let component: SolicitudLicenciaMedicaComponent;
  let fixture: ComponentFixture<SolicitudLicenciaMedicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudLicenciaMedicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudLicenciaMedicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
