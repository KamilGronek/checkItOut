import { Route, Routes } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { RoleGuard } from './core/auth/guards/role.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthSignOutComponent } from './modules/auth/sign-out/sign-out.component';
import { Component, OnInit } from '@angular/core';
import { AuthResolver } from 'app/core/auth/auth.resolver';
// import { AuthService } from 'app/core/auth/auth.service';

import { AppComponent } from 'app/app.component';

// import { ProfileComponent } from 'app/modules/admin/profile/ProfileComponent';

// import { newInfluencersListComponent } from 'app/modules/admin/newInfluencers/newInfluencersListComponent';

// export class InfluencersComponent implements OnInit {
//     constructor(private authService: AuthService) {}

//     ngOnInit(): void {
//         const dataTokenRole = this.authService.getRole();
//         console.log(dataTokenRole); // Logowanie danych użytkownika
//     }
// }

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

// export const userRoutes: Routes = [
//     {
//         path: '**',
//         redirectTo: 'profile',
//     },
// ];

// export const adminRoutes: Routes = [
//     {
//         path: 'dashboard',
//         component: newInfluencersListComponent,
//     },
// ];

export const appRoutes: Route[] = [
    // Redirect empty path to '/example'

    { path: '', pathMatch: 'full', redirectTo: 'home' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
            {
                path: 'auth/instagram',
                loadChildren: () =>
                    import('app/modules/auth/instagram/instagram.routes'),
            },
        ],
    },

    {
        path: 'sign-out',
        component: AuthSignOutComponent,
    },

    // Auth routes for authenticated users
    {
        path: 'home',
        canActivate: [RoleGuard],
        canActivateChild: [RoleGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'classy',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
            userData: AuthResolver,
        },
        children: [
            {
                path: 'influencers',
                loadChildren: () =>
                    import('app/modules/admin/influencers/influencers.routes'),
            },
            {
                path: 'newInfluencers',
                loadChildren: () =>
                    import(
                        'app/modules/admin/newInfluencers/newInfluencers.routes'
                    ),
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('app/modules/admin/profile/profile.routes'),
            },
            {
                path: 'companies',
                loadChildren: () =>
                    import('app/modules/admin/companies/companies.routes'),
            },
            {
                path: 'collaborations',
                loadChildren: () =>
                    import(
                        'app/modules/admin/collaborations/collaborations.routes'
                    ),
            },
            {
                path: 'collaborations/:id',
                loadChildren: () =>
                    import(
                        'app/modules/admin/collaborationsId/collaborationsId.routes'
                    ),
            },
            {
                path: 'newCollaboration',
                loadChildren: () =>
                    import(
                        'app/modules/admin/newCollaboration/newCollaboration.routes'
                    ),
            },
        ],
    },
];

//========================================================
