import { TestBed } from '@angular/core/testing';

import { IngredientsOfRecipeBookServiceService } from './ingredients-of-recipe-book-service.service';

describe('IngredientsOfRecipeBookServiceService', () => {
  let service: IngredientsOfRecipeBookServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientsOfRecipeBookServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
