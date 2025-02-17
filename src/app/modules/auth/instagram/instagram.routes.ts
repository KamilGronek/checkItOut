import { Routes } from '@angular/router';
import { InstagramCallbackComponent } from './instagram-callback/instagram-callback.component';

export default [
    {
        path: 'callback',
        component: InstagramCallbackComponent,
    },
] as Routes;
