import { Component, OnInit } from '@angular/core';
import { CollaborationRegistrationsComponent } from './collaboration-registrations/collaboration-registrations.component';
import { CollaborationRatingsComponent } from "./collaboration-ratings/collaboration-ratings.component";
import { CollaborationCompaniesComponent } from '../collaboration-companies/collaboration-companies.component';
import { ViewType } from '@fuse/components/stepper/stepper';

@Component({
    selector: 'app-collaboration-influencers',
    standalone: true,
    imports: [CollaborationRegistrationsComponent, CollaborationRatingsComponent, CollaborationCompaniesComponent],
    templateUrl: './collaboration-influencers.component.html',
})
export class CollaborationInfluencersComponent implements OnInit {
    public ViewType = ViewType;

    constructor() { }

    ngOnInit(): void {
    }
}
