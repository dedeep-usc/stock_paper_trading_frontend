import { TestBed } from '@angular/core/testing';

import { MainChartStockCandlesService } from './main-chart-stock-candles.service';

describe('MainChartStockCandlesService', () => {
  let service: MainChartStockCandlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainChartStockCandlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
