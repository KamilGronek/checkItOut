import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProfileComponent } from './ProfileComponent';
import { AnalyticsService } from './analytics.service';

export default [
    {
        path: '',
        component: ProfileComponent,
        resolve: {
            data: () => inject(AnalyticsService).getData(),
        },
    },
] as Routes;
