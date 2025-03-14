import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudRRHHPermisoComponent } from './solicitud-rrhhpermiso.component';

describe('SolicitudRRHHPermisoComponent', () => {
  let component: SolicitudRRHHPermisoComponent;
  let fixture: ComponentFixture<SolicitudRRHHPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudRRHHPermisoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudRRHHPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
