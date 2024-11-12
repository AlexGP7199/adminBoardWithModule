import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiboteScreenComponent } from './pibote-screen.component';

describe('PiboteScreenComponent', () => {
  let component: PiboteScreenComponent;
  let fixture: ComponentFixture<PiboteScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PiboteScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PiboteScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
