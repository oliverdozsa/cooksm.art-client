import { TestBed } from '@angular/core/testing';

import { RecipeSearchService } from './recipe-search.service';

describe('RecipeQueryService', () => {
  let service: RecipeSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
