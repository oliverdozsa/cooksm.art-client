import { TestBed } from '@angular/core/testing';

import { IngredientSearchService } from './ingredient-search.service';

describe('IngredientSearchService', () => {
  let service: IngredientSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
