import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { CompaniesComponent } from './CompaniesComponent';

export default [
    {
        path     : '',
        component: CompaniesComponent,
        resolve  : {
            data: () => inject(FinanceService).getData(),
        },
    },
] as Routes;
