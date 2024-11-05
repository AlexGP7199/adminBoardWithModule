import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentesNacionalesComponent } from './agentes-nacionales.component';

describe('AgentesNacionalesComponent', () => {
  let component: AgentesNacionalesComponent;
  let fixture: ComponentFixture<AgentesNacionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentesNacionalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentesNacionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
