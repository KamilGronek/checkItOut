import { Routes } from '@angular/router';
import { AuthGuard } from 'app/core/guards/auth.guard';
import { CreateTicketComponent } from 'app/feature/support/components/tickets/create-ticket/create-ticket.component';
import { TicketStatusComponent } from 'app/feature/support/components/tickets/ticket-status/ticket-status.component';
import { AdminTicketsListComponent } from 'app/feature/support/components/tickets/admin-tickets-list/admin-tickets-list.component';
import { AdminTicketDetailComponent } from 'app/feature/support/components/tickets/admin-ticket-detail/admin-ticket-detail.component';
import { SupportComponent } from './support.component';
import { FaqsComponent } from './faqs/faqs.component';
import { LayoutResolver } from 'app/core/resolvers/layout.resolver';

export default [
  {
    path: '',
    pathMatch: 'full',
    component: SupportComponent,
    // Explicitly re-resolve the layout for this route
    resolve: {
      layout: LayoutResolver
    }
  },

  // FAQ route
  {
    path: 'faqs',
    component: FaqsComponent,
    // Explicitly re-resolve the layout for this route
    resolve: {
      layout: LayoutResolver
    }
  },

  // Ticket routes
  {
    path: 'tickets',
    // Explicitly re-resolve the layout for the parent tickets route
    resolve: {
      layout: LayoutResolver
    },
    children: [
      {
        path: 'create',
        component: CreateTicketComponent
      },
      {
        path: 'status',
        component: TicketStatusComponent
      },
      // Default redirect for tickets path
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'create'
      }
    ]
  },

  // Admin ticket routes (authentication required)
  {
    path: 'admin/tickets',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    // For admin routes, we'll use the auth resolver to ensure proper layout
    resolve: {
      layout: () => 'classy' // Admin routes should always use classy layout
    },
    children: [
      {
        path: '',
        component: AdminTicketsListComponent
      },
      {
        path: ':id',
        component: AdminTicketDetailComponent
      }
    ]
  }

  // Placeholder for guides (to be implemented later)
  // {
  //     path: 'guides',
  //     component: /* Placeholder for GuidesComponent */
  // }
] as Routes;
