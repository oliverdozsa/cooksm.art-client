import { TestBed } from '@angular/core/testing';

import { SourcePagesService } from './source-pages.service';

describe('SourcePagesService', () => {
  let service: SourcePagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourcePagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
