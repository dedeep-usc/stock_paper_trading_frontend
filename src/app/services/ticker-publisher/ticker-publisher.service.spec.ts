import { TestBed } from '@angular/core/testing';

import { TickerPublisherService } from './ticker-publisher.service';

describe('TickerPublisherService', () => {
  let service: TickerPublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TickerPublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
