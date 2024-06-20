import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithImgComponent } from './table-with-img.component';

describe('TableWithImgComponent', () => {
  let component: TableWithImgComponent;
  let fixture: ComponentFixture<TableWithImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableWithImgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableWithImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
