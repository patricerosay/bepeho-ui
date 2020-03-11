import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuardHublo } from './auth-hublo.guard';

describe('AuthGuardHublo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [AuthGuardHublo]
    });
  });

  it('should ...', inject([AuthGuardHublo], (guard: AuthGuardHublo) => {
    expect(guard).toBeTruthy();
  }));
});
