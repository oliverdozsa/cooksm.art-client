import { TestBed } from '@angular/core/testing';

import { RecipeBooksService } from './recipe-books.service';

describe('RecipeBooksService', () => {
  let service: RecipeBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
