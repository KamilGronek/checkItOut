import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { NewCollaborationComponent } from './newCollaborationComponent';

export default [
    {
        path: '',
        component: NewCollaborationComponent,
        resolve: {
            data: () => inject(FinanceService).getData(),
        },
    },
] as Routes;
