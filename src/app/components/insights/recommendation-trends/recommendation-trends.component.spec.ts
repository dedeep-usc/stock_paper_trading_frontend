import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationTrendsComponent } from './recommendation-trends.component';

describe('RecommendationTrendsComponent', () => {
  let component: RecommendationTrendsComponent;
  let fixture: ComponentFixture<RecommendationTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationTrendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
