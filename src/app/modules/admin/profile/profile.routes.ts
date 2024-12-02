import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { ProfileComponent } from './ProfileComponent';

export default [
    {
        path: '',
        component: ProfileComponent,
        resolve: {
            data: () => inject(FinanceService).getData(),
        },
    },
] as Routes;
