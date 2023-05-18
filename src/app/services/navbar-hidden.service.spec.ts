import { TestBed } from '@angular/core/testing';

import { NavbarHiddenService } from './navbar-hidden.service';

describe('NavbarHiddenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavbarHiddenService = TestBed.get(NavbarHiddenService);
    expect(service).toBeTruthy();
  });
});
