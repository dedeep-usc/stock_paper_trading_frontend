import { TestBed } from '@angular/core/testing';

import { CompanyLatestNewsService } from './company-latest-news.service';

describe('CompanyLatestNewsService', () => {
  let service: CompanyLatestNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyLatestNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
