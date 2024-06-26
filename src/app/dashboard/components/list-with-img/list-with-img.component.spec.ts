import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWithImgComponent } from './list-with-img.component';

describe('ListWithImgComponent', () => {
  let component: ListWithImgComponent;
  let fixture: ComponentFixture<ListWithImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListWithImgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListWithImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
