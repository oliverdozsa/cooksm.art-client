import { TestBed } from '@angular/core/testing';

import { SearchSnapshotService } from './search-snapshot.service';

describe('SearchSnapshotService', () => {
  let service: SearchSnapshotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchSnapshotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
