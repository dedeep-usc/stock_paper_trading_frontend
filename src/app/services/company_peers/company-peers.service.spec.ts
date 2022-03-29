import { TestBed } from '@angular/core/testing';

import { CompanyPeersService } from './company-peers.service';

describe('CompanyPeersService', () => {
  let service: CompanyPeersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyPeersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
