import {Routes} from '@angular/router';
import {
    AuthConfirmationRequiredComponent
} from 'app/feature/authentication/components/confirmation-required/confirmation-required.component';
import {AuthForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {AuthResetPasswordComponent} from "./reset-password/reset-password.component";
import {AuthSignInComponent} from "./sign-in/sign-in.component";
import {AuthSignUpComponent} from "./sign-up/sign-up.component";
import {InstagramCallbackComponent} from "./instagram/instagram-callback.component";

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
        path: 'instagram/callback',
        component: InstagramCallbackComponent,
    },

] as Routes;
