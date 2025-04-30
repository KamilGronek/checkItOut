// src/app/app.routes.ts
import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/guards/auth.guard';
import { NoAuthGuard } from 'app/core/guards/no-auth.guard';
import { LayoutComponent } from 'app/shared/components/layout/layout.component';
import { AuthResolver } from 'app/core/resolvers/auth.resolver';
import { ComponentSamplesComponent } from './shared/components/ui/component-samples.component';
import { LandingPageComponent } from './feature/landing-page/landing-page.component';
import { LayoutResolver } from 'app/core/resolvers/layout.resolver';

export const appRoutes: Route[] = [
  // Auth routes
  {
    path: 'auth',
    component: LayoutComponent,
    data: {
      layout: 'with-banner'
    },
    loadChildren: () => import('app/feature/authentication/components/authentication.routes')
  },

  // Public routes
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NoAuthGuard], // Only for non-authenticated users
    resolve: {
      layout: LayoutResolver
    },
    children: [
      {
        path: '',
        component: LandingPageComponent
      }
    ]
  },

  // Support routes (accessible to all with dynamic layout)
  {
    path: 'support',
    component: LayoutComponent,
    resolve: {
      layout: LayoutResolver
    },
    loadChildren: () => import('app/feature/support/components/support.routes')
  },

  // UI component samples
  {
    path: 'ui-component-samples',
    component: LayoutComponent,
    resolve: {
      layout: LayoutResolver
    },
    children: [
      {
        path: '',
        component: ComponentSamplesComponent
      }
    ]
  },

  // Authenticated routes
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      userData: AuthResolver,
      layout: () => 'classy'
    },
    children: [
      {
        path: 'home',
        redirectTo: 'collaborations/list',
        pathMatch: 'full'
      },
      {
        path: 'admin',
        loadChildren: () => import('app/feature/admin/components/admin.routes')
      },
      {
        path: 'influencers',
        loadChildren: () => import('app/feature/influencers/components/influencers.routes')
      },
      {
        path: 'companies',
        loadChildren: () => import('app/feature/companies/components/companies.routes')
      },
      {
        path: 'collaborations',
        loadChildren: () => import('app/feature/collaborations/components/collaborations.routes')
      },
      {
        path: 'user',
        loadChildren: () => import('app/feature/users/components/users.routes')
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
