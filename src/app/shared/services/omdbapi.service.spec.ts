import { TestBed, inject } from '@angular/core/testing';

import { OmdbapiService } from './omdbapi.service';

describe('OmdbapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OmdbapiService]
    });
  });

  it('should be created', inject([OmdbapiService], (service: OmdbapiService) => {
    expect(service).toBeTruthy();
  }));
});
