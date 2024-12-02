import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { CollaborationsIdComponent } from './collaborationsIdComponents';

export default [
    {
        path: '',
        component: CollaborationsIdComponent,
        resolve: {
            data: () => inject(FinanceService).getData(),
        },
    },
] as Routes;
