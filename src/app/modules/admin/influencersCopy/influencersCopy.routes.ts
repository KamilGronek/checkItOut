import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { InfluencerService } from 'app/services/influencer/influencer.service';
import { InfluencerListComponentCopy } from './InfluencerListComponentCopy';

export default [
    {
        path: '',
        component: InfluencerListComponentCopy,
        resolve: {
            data: () => inject(InfluencerService).getInfluencerList(),
        },
    },
] as Routes;
