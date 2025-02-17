import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { catchError, Observable, throwError, from, switchMap } from 'rxjs';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    return from(authService.refreshToken()).pipe(
        catchError(() => {
            // Ignore errors (e.g. user is logged out)
            return from(Promise.resolve());
        }),
        switchMap(() => {
            const token = authService.getAccessToken();
            let newReq = req;

            // --Template comment--
            // If the access token didn't expire, add the Authorization header.
            // We won't add the Authorization header if the access token expired.
            // This will force the server to return a "401 Unauthorized" response
            // for the protected API routes which our response interceptor will
            // catch and delete the access token from the local storage while logging
            // the user out from the app.
            if (token && !AuthUtils.isTokenExpired(token)) {
                newReq = req.clone({
                    headers: req.headers.set(
                        'Authorization',
                        `Bearer ${token}`
                    ),
                });
            }

            return next(newReq).pipe(
                catchError((error) => {
                    // Catch "401 Unauthorized" responses
                    if (
                        error instanceof HttpErrorResponse &&
                        error.status === 401
                    ) {
                        authService.signOut();
                        location.reload();
                    }
                    return throwError(error);
                })
            );
        })
    );
};
