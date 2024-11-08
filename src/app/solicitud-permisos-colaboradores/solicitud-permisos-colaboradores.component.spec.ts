import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudPermisosColaboradoresComponent } from './solicitud-permisos-colaboradores.component';

describe('SolicitudPermisosColaboradoresComponent', () => {
  let component: SolicitudPermisosColaboradoresComponent;
  let fixture: ComponentFixture<SolicitudPermisosColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudPermisosColaboradoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudPermisosColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
