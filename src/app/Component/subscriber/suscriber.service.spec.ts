import { TestBed } from '@angular/core/testing';

import { SuscriberService } from './suscriber.service';

describe('SuscriberService', () => {
  let service: SuscriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuscriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
