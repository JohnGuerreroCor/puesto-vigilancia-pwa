import { TestBed } from '@angular/core/testing';

import { PuestoVigilanciaService } from './puesto-vigilancia.service';

describe('PuestoVigilanciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PuestoVigilanciaService = TestBed.get(PuestoVigilanciaService);
    expect(service).toBeTruthy();
  });
});
