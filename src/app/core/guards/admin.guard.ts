import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from 'app/core/services/authentication/auth.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.check().pipe(
    map(authenticated => {
      if (!authenticated) {
        router.navigate(['/auth/sign-in']);
        return false;
      }

      const role = authService.getRole();
      if (role !== 'ADMIN') {
        router.navigate(['']); // Redirect non-admins to home
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
