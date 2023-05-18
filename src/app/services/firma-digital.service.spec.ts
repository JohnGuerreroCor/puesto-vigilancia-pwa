import { TestBed } from '@angular/core/testing';

import { FirmaDigitalService } from './firma-digital.service';

describe('FirmaDigitalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirmaDigitalService = TestBed.get(FirmaDigitalService);
    expect(service).toBeTruthy();
  });
});
