import { TestBed } from '@angular/core/testing';

import { EstamentoService } from './estamento.service';

describe('EstamentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstamentoService = TestBed.get(EstamentoService);
    expect(service).toBeTruthy();
  });
});
