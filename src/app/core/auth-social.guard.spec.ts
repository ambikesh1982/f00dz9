import { TestBed, async, inject } from '@angular/core/testing';

import { AuthSocialGuard } from './auth-social.guard';

describe('AuthSocialGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthSocialGuard]
    });
  });

  it('should ...', inject([AuthSocialGuard], (guard: AuthSocialGuard) => {
    expect(guard).toBeTruthy();
  }));
});
