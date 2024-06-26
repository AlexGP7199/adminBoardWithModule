import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableT1Component } from './table-t1.component';

describe('TableT1Component', () => {
  let component: TableT1Component;
  let fixture: ComponentFixture<TableT1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableT1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
