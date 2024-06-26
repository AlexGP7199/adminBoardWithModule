import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BartChartComponent } from './bart-chart.component';

describe('BartChartComponent', () => {
  let component: BartChartComponent;
  let fixture: ComponentFixture<BartChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BartChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BartChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
