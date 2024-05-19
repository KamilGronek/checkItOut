import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { PostsComponent } from './PostsComponent';
import { InfluencerService } from 'app/services/influencer/influencer.service';

export default [
    {
        path     : '',
        component: PostsComponent,
        resolve  : {
            data: () => inject(InfluencerService).getInfluencerList(),
        },
    },
] as Routes;
