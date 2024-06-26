import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFancyComponent } from './table-fancy.component';

describe('TableFancyComponent', () => {
  let component: TableFancyComponent;
  let fixture: ComponentFixture<TableFancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableFancyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableFancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
