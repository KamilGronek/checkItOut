import {Routes} from '@angular/router';
import {
    AuthConfirmationRequiredComponent
} from 'app/feature/authentication/components/confirmation-required/confirmation-required.component';
import {AuthForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {AuthResetPasswordComponent} from "./reset-password/reset-password.component";
import {AuthSignInComponent} from "./sign-in/sign-in.component";
import {AuthSignUpComponent} from "./sign-up/sign-up.component";
import {InstagramInfluencerCallbackComponent} from "./instagram/influencer/instagram-influencer-callback.component";
import {AuthSignOutComponent} from "./sign-out/sign-out.component";
import {BusinessSignUpComponent} from "./sign-up/business/business-sign-up.component";

export default [
    {
        path: 'confirmation-required',
        component: AuthConfirmationRequiredComponent,
    },
    {
        path: 'forgot-password',
        component: AuthForgotPasswordComponent,
    },
    {
        path: 'reset-password',
        component: AuthResetPasswordComponent,
    },
    {
        path: 'sign-in',
        component: AuthSignInComponent,
    },
    {
        path: 'sign-up',
        component: AuthSignUpComponent,
    },
    {
        path: 'sign-up/business',
        component: BusinessSignUpComponent,
    },
    {
        path: 'sign-out',
        component: AuthSignOutComponent,
    },
    {
        path: 'instagram/influencer/callback',
        component: InstagramInfluencerCallbackComponent,
    },

] as Routes;
