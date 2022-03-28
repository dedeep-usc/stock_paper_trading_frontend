import { TestBed } from '@angular/core/testing';

import { CompanyPriceService } from './company-price.service';

describe('CompanyPriceService', () => {
  let service: CompanyPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
