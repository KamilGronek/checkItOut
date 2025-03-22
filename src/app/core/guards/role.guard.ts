import {inject} from '@angular/core';
import {CanActivateChildFn, CanActivateFn, Router} from '@angular/router';
import {of, switchMap} from 'rxjs';
import {AuthService} from 'app/core/services/authentication/auth.service';

export const RoleGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);

    // Check the authentication status
    return authService.check().pipe(
        switchMap((authenticated) => {
            // If the user is not authenticated...
            if (!authenticated) {
                // Redirect to the sign-in page with a redirectUrl param
                const redirectURL =
                    state.url === '/auth/sign-out' ? '' : `redirectURL=${state.url}`;
                const urlTree = router.parseUrl(`/auth/sign-in?${redirectURL}`);

                return of(urlTree);
            } else {
                const role = authService.getRole();
                if (role === 'ADMIN') {
                    router.navigateByUrl('/influencers/new');
                } else {
                    router.navigateByUrl('/collaborations/list');
                }
            }
        })
    );
};
