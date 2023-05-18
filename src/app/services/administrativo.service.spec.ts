import { TestBed } from '@angular/core/testing';

import { AdministrativoService } from './administrativo.service';

describe('AdministrativoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdministrativoService = TestBed.get(AdministrativoService);
    expect(service).toBeTruthy();
  });
});
