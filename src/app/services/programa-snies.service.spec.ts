import { TestBed } from '@angular/core/testing';

import { ProgramaSniesService } from './programa-snies.service';

describe('ProgramaSniesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramaSniesService = TestBed.get(ProgramaSniesService);
    expect(service).toBeTruthy();
  });
});
