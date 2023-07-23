import { TestBed } from '@angular/core/testing';

import { ScanApiService } from './scan-api.service';

describe('ScanApiService', () => {
  let service: ScanApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
