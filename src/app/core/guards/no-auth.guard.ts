import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from 'app/core/services/authentication/auth.service';

export const NoAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.check().pipe(
    map(authenticated => {
      if (authenticated) {
        // Redirect authenticated users to collaborations
        router.navigate(['/collaborations/list']);
        return false;
      }
      return true;
    }),
    catchError(() => of(true)) // Allow access on error (assumes not authenticated)
  );
};
