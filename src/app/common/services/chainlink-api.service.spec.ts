import { TestBed } from '@angular/core/testing';

import { ChainlinkAPIService } from './chainlink-api.service';

describe('ChainlinkAPIService', () => {
  let service: ChainlinkAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChainlinkAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
