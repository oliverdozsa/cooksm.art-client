import { TestBed } from '@angular/core/testing';

import { InitialSourcePagesService } from './initial-source-pages.service';

describe('InitialSourcePagesService', () => {
  let service: InitialSourcePagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitialSourcePagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
