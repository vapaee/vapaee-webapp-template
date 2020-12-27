import { TestBed } from '@angular/core/testing';

import { Scatter2Service } from './scatter2.service';

describe('Scatter2Service', () => {
  let service: Scatter2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Scatter2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
