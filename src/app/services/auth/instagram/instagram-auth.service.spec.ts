import { TestBed } from '@angular/core/testing';

import { InstagramAuthService } from './instagram-auth.service';

describe('InstagramAuthService', () => {
  let service: InstagramAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstagramAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
