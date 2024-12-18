import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaboradoresExcelCargaComponent } from './colaboradores-excel-carga.component';

describe('ColaboradoresExcelCargaComponent', () => {
  let component: ColaboradoresExcelCargaComponent;
  let fixture: ComponentFixture<ColaboradoresExcelCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColaboradoresExcelCargaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColaboradoresExcelCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
