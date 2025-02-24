import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider,} from '@angular/core';
import {authInterceptor} from 'app/core/interceptors/auth.interceptor';
import {AuthService} from 'app/core/services/authentication/auth.service';

export const provideAuthInFuse = (): Array<Provider | EnvironmentProviders> => {
    return [
        provideHttpClient(withInterceptors([authInterceptor])),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(AuthService),
            multi: true,
        },
    ];
};
