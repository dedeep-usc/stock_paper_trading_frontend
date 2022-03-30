import { TestBed } from '@angular/core/testing';

import { CompanyRecommendationTrendsService } from './company-recommendation-trends.service';

describe('CompanyRecommendationTrendsService', () => {
  let service: CompanyRecommendationTrendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyRecommendationTrendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
