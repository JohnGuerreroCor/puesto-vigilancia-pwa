import { TestBed } from '@angular/core/testing';

import { GraduadoService } from './graduado.service';

describe('GraduadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraduadoService = TestBed.get(GraduadoService);
    expect(service).toBeTruthy();
  });
});
