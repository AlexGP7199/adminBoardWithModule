import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAmbulanciaComponent } from './new-ambulancia.component';

describe('NewAmbulanciaComponent', () => {
  let component: NewAmbulanciaComponent;
  let fixture: ComponentFixture<NewAmbulanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewAmbulanciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAmbulanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
