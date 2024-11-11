import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroConflictosComponent } from './tablero-conflictos.component';

describe('TableroConflictosComponent', () => {
  let component: TableroConflictosComponent;
  let fixture: ComponentFixture<TableroConflictosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableroConflictosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableroConflictosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
