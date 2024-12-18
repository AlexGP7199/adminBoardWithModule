import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanciasExcelUploadComponent } from './ambulancias-excel-upload.component';

describe('AmbulanciasExcelUploadComponent', () => {
  let component: AmbulanciasExcelUploadComponent;
  let fixture: ComponentFixture<AmbulanciasExcelUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmbulanciasExcelUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmbulanciasExcelUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
