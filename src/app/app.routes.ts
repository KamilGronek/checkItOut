import {Route} from '@angular/router';
import {AuthGuard} from 'app/core/guards/auth.guard';
import {NoAuthGuard} from 'app/core/guards/no-auth.guard';
import {RoleGuard} from './core/guards/role.guard';
import {LayoutComponent} from 'app/shared/components/layout/layout.component';
import {AuthResolver} from 'app/core/resolvers/auth.resolver';
import {ComponentSamplesComponent} from "./shared/components/ui/component-samples.component";
import {AuthSignOutComponent} from "./feature/authentication/components/sign-out/sign-out.component";

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

export const appRoutes: Route[] = [
    // Redirect empty path to '/example'

    { path: '', pathMatch: 'full', redirectTo: 'home' },

    // Routes available for everyone from everywhere
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'ui-component-samples',
                component: ComponentSamplesComponent,
            },
        ],
    },

    // Auth routes for all users
    {
        path: 'auth',
        component: LayoutComponent,
        data: {
            layout: 'with-banner',
        },
        loadChildren: () =>
            import(
                'app/feature/authentication/components/authentication.routes'
                ),
    },

    // Routes for all
    {
        path: 'home',
        canActivate: [RoleGuard],
        canActivateChild: [RoleGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            // initialData: initialDataResolver,
            userData: AuthResolver,
        },
        children: [
            {
                path: 'admin',
                loadChildren: () =>
                    import('app/feature/admin/components/admin.routes'),
            },
            {
                path: 'influencers',
                loadChildren: () =>
                    import('app/feature/influencers/components/influencers.routes'),
            },
            {
                path: 'user',
                loadChildren: () =>
                    import('app/feature/users/components/users.routes'),
            },
            {
                path: 'companies',
                loadChildren: () =>
                    import('app/feature/companies/components/companies.routes'),
            },
            {
                path: 'collaborations',
                loadChildren: () =>
                    import('app/feature/collaborations/components/collaborations.routes'),
            },
        ],
    },
];

//========================================================
