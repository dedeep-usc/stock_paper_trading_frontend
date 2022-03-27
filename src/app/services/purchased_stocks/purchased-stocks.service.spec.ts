import { TestBed } from '@angular/core/testing';

import { PurchasedStocksService } from './purchased-stocks.service';

describe('PurchasedStocksService', () => {
  let service: PurchasedStocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasedStocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
