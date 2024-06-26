import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinealChartComponent } from './lineal-chart.component';

describe('LinealChartComponent', () => {
  let component: LinealChartComponent;
  let fixture: ComponentFixture<LinealChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinealChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinealChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
