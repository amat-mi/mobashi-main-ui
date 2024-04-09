import { TestBed } from '@angular/core/testing';

import { CaschoService } from './cascho.service';

describe('CaschoService', () => {
  let service: CaschoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaschoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
