import { TestBed } from '@angular/core/testing';

import { CompanySocialSentimentService } from './company-social-sentiment.service';

describe('CompanySocialSentimentService', () => {
  let service: CompanySocialSentimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanySocialSentimentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
