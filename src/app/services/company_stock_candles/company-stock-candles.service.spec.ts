import { TestBed } from '@angular/core/testing';

import { CompanyStockCandlesService } from './company-stock-candles.service';

describe('CompanyStockCandlesService', () => {
  let service: CompanyStockCandlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyStockCandlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
