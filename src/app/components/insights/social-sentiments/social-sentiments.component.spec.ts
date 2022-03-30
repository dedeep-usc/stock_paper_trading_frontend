import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialSentimentsComponent } from './social-sentiments.component';

describe('SocialSentimentsComponent', () => {
  let component: SocialSentimentsComponent;
  let fixture: ComponentFixture<SocialSentimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialSentimentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialSentimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
