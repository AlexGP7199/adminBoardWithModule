import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroUsuariosComponent } from './tablero-usuarios.component';

describe('TableroUsuariosComponent', () => {
  let component: TableroUsuariosComponent;
  let fixture: ComponentFixture<TableroUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableroUsuariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableroUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
