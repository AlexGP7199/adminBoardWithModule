import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicChartsComponent } from './graphic-charts.component';

describe('GraphicChartsComponent', () => {
  let component: GraphicChartsComponent;
  let fixture: ComponentFixture<GraphicChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphicChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphicChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
