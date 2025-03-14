import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAmonestacionComponent } from './solicitud-amonestacion.component';

describe('SolicitudAmonestacionComponent', () => {
  let component: SolicitudAmonestacionComponent;
  let fixture: ComponentFixture<SolicitudAmonestacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudAmonestacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudAmonestacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
