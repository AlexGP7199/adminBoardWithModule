import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSiteComponent } from './content-site.component';

describe('ContentSiteComponent', () => {
  let component: ContentSiteComponent;
  let fixture: ComponentFixture<ContentSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentSiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContentSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
