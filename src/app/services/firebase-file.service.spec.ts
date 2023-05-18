import { TestBed } from '@angular/core/testing';

import { FirebaseFileService } from './firebase-file.service';

describe('FirebaseFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseFileService = TestBed.get(FirebaseFileService);
    expect(service).toBeTruthy();
  });
});
