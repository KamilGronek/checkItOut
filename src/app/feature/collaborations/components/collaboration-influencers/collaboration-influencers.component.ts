import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { CollaborationRegistrationsComponent } from './collaboration-registrations/collaboration-registrations.component';
import { CollaborationRatingsComponent } from "./collaboration-ratings/collaboration-ratings.component";
import { CollaborationCompaniesComponent } from '../collaboration-companies/collaboration-companies.component';
import { ViewType } from '../stepper/stepper';

@Component({
    selector: 'app-collaboration-influencers',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        CollaborationRegistrationsComponent,
        CollaborationRatingsComponent,
        CollaborationCompaniesComponent
    ],
    templateUrl: './collaboration-influencers.component.html',
})
export class CollaborationInfluencersComponent implements OnInit {
    public ViewType = ViewType;

    constructor() { }

    ngOnInit(): void {
    }
}
