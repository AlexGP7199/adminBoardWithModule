import { TestBed } from '@angular/core/testing';

import { AmbulanciasService } from './ambulancias.service';

describe('AmbulanciasService', () => {
  let service: AmbulanciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbulanciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
