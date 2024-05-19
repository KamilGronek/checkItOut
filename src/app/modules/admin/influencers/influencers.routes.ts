import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { InfluencerService } from 'app/services/influencer/influencer.service';
import { InfluencerListComponent } from './InfluencerListComponent';

export default [
    {
        path     : '',
        component: InfluencerListComponent,
        resolve  : {
            data: () => inject(InfluencerService).getInfluencerList(),
        },
    },
] as Routes;
