import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'app/core/services/authentication/auth.service';

export const LayoutResolver: ResolveFn<string> = (route, state) => {
  const authService = inject(AuthService);

  // If layout is explicitly defined in route data, use it
  if (route.data && route.data['layout']) {
    return of(route.data['layout']);
  }

  // Otherwise determine layout based on authentication status
  return authService.check().pipe(map(authenticated => (authenticated ? 'classy' : 'empty')));
};
