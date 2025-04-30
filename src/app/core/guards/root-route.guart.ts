import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'app/core/services/authentication/auth.service';

export const RootRouteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.check().pipe(
    map(authenticated => {
      if (authenticated) {
        // If authenticated, redirect to collaborations list
        router.navigate(['/collaborations/list']);
        return false; // Prevent activation of current route
      }

      // Not authenticated, allow access to landing page
      return true;
    })
  );
};
