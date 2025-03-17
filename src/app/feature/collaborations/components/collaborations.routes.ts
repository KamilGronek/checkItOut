import {Routes} from '@angular/router';
import {CollaborationCreateComponent} from './collaboration-create/collaboration-create.component';
import {CollaborationsListComponent} from "./collaboration-list/collaboration-list.component";
import {CollaborationsDetailComponent} from "./collaboration-details/collaboration-details.component";
import {CollaborationInfluencersComponent} from "./collaboration-influencers/collaboration-influencers.component";
import { CollaborationCompaniesComponent } from './collaboration-companies/collaboration-companies.component';

export default [
    {
        path: 'list',
        component: CollaborationsListComponent
    },
    {
        path: 'create',
        component: CollaborationCreateComponent,
    },
    {
        path: 'influencers',
        component: CollaborationInfluencersComponent,
    },
    {
        path: 'companies',
        component: CollaborationCompaniesComponent
    },
    {
        path: ':id',
        component: CollaborationsDetailComponent
    }
] as Routes;
