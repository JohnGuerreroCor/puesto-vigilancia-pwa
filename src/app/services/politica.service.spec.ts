import { TestBed } from '@angular/core/testing';

import { PoliticaService } from './politica.service';

describe('PoliticaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PoliticaService = TestBed.get(PoliticaService);
    expect(service).toBeTruthy();
  });
});
