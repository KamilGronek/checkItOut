import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from 'app/core/services/authentication/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.check().pipe(
    map(authenticated => {
      if (!authenticated) {
        // Store the attempted URL for redirecting
        const redirectUrl = state.url === '/auth/sign-out' ? '' : state.url;
        router.navigate(['/auth/sign-in'], {
          queryParams: { redirectUrl }
        });
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/auth/sign-in']);
      return of(false);
    })
  );
};
