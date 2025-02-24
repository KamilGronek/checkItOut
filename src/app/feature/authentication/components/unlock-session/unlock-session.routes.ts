import {Routes} from '@angular/router';
import {
    AuthUnlockSessionComponent
} from 'app/feature/authentication/components/unlock-session/unlock-session.component';

export default [
    {
        path: '',
        component: AuthUnlockSessionComponent,
    },
] as Routes;
