import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentesRegionalesComponent } from './agentes-regionales.component';

describe('AgentesRegionalesComponent', () => {
  let component: AgentesRegionalesComponent;
  let fixture: ComponentFixture<AgentesRegionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentesRegionalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentesRegionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
