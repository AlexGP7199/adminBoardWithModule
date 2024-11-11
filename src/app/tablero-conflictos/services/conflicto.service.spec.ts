import { TestBed } from '@angular/core/testing';

import { ConflictoService } from './conflicto.service';

describe('ConflictoService', () => {
  let service: ConflictoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConflictoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
