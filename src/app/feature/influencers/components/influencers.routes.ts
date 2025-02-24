import {Routes} from '@angular/router';
import {inject} from '@angular/core';
import {InfluencerService} from 'app/feature/influencers/services/influencer.service';
import {newInfluencersListComponent} from './new-influencers-list/new-influencers-list.component';

export default [
    {
        path: '',
        component: newInfluencersListComponent,
        resolve: {
            data: () => inject(InfluencerService).getInfluencerList(),
        },
    },
    {
        path: 'new',
        component: newInfluencersListComponent,
    }
] as Routes;
