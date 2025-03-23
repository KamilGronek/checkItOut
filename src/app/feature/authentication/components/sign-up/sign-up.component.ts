import {NgIf} from '@angular/common';
import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Router, RouterLink} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertComponent, FuseAlertType} from '@fuse/components/alert';
import {CardComponent} from "../../../../shared/components/ui/card/card.component";
import {environment} from "../../../../../environments/environment";
import {LinkComponent} from "../../../../shared/components/ui/link/link.component";
import {TranslocoPipe} from "@ngneat/transloco";

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        NgIf,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        CardComponent,
        LinkComponent,
        TranslocoPipe,
    ],
})
export class AuthSignUpComponent {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(private _router: Router) {}

    signUpAsInfluencer(): void {
        window.location.href = `https://api.instagram.com/oauth/authorize?client_id=${environment.instagram.clientId}&redirect_uri=${environment.instagram.redirectUri}&scope=instagram_business_basic&response_type=code`;
    }

    signUpAsBusiness(): void {
       this._router.navigate(['auth/sign-up/business']);
    }
}
