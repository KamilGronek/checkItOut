import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { CollaborationsComponent } from './CollaborationsComponent';

export default [
    {
        path: '',
        component: CollaborationsComponent,
        resolve: {
            data: () => inject(FinanceService).getData(),
        },
    },
] as Routes;
