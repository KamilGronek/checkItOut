import {Component} from '@angular/core';
import {CollaborationRegistrationsComponent} from './collaboration-registrations/collaboration-registrations.component';
import {CollaborationRatingsComponent} from "./collaboration-ratings/collaboration-ratings.component";

@Component({
    selector: 'app-collaboration-influencers',
    standalone: true,
    imports: [CollaborationRegistrationsComponent, CollaborationRatingsComponent],
    templateUrl: './collaboration-influencers.component.html',
})
export class CollaborationInfluencersComponent {
}
