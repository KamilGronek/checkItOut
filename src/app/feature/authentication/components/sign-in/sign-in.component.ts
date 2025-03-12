import {NgIf} from '@angular/common';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
    FormControl,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    Validators,
    FormGroup,
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertComponent, FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/services/authentication/auth.service';
import {InfluencerService} from 'app/feature/influencers/services/influencer.service';
import {Influencer} from 'app/feature/influencers/services/influencer.types';
import {environment} from 'environments/environment';
import {ButtonComponent} from "app/shared/components/ui/button/button.component";
import {InputComponent} from "app/shared/components/ui/input/input.component";
import {LinkComponent} from "app/shared/components/ui/link/link.component";
interface SignInForm {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    rememberMe: FormControl<boolean | null>;
}

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        ButtonComponent,
        InputComponent,
        LinkComponent,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: FormGroup<SignInForm>;
    showAlert: boolean = false;

    influencerUser: Influencer;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _influencerService: InfluencerService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form with typed controls
        this.signInForm = new FormGroup<SignInForm>({
            email: new FormControl("", [Validators.required, Validators.email]),
            password: new FormControl("", [Validators.required]),
            rememberMe: new FormControl(false),
        });

        const userStatus = localStorage.getItem('userStatus');

        if (userStatus) {
            console.log('Status użytkownika przed logowaniem:', userStatus);
        } else {
            console.log('Brak statusu użytkownika w localStorage');
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */

    signInWithEmailAndPassword(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        this._authService
            .signInUsingEmailAndPassword(this.signInForm.getRawValue())
            .then(() => {
                this._influencerService
                    .getInfluencerUser()
                    .subscribe((userData) => {
                        const status = userData.accountStatus;
                        localStorage.setItem('userStatus', status);
                        if (status === 'ACTIVE') {
                            this._router.navigateByUrl('collaborations');

                            const redirectURL =
                                this._activatedRoute.snapshot.queryParamMap.get(
                                    'redirectURL'
                                ) || '/signed-in-redirect';
                        } else {
                            this._router.navigateByUrl('home');
                        }
                    });
                this._router.navigateByUrl('home');
            })
            .catch((error) => {
                this.signInForm.enable();
                this.signInNgForm.resetForm();

                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password',
                };

                this.showAlert = true;
            });
    }

    signInWithFacebook(): void {
        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        this._authService
            .signInWithFacebook()
            .then(() => {
                this._router.navigateByUrl('home');
            })
            .catch((error) => {
                this.signInForm.enable();
                this.signInNgForm.resetForm();

                this.alert = {
                    type: 'error',
                    message: 'Something go wrong',
                };

                this.showAlert = true;
            });
    }

    signInWithInstagram(): void {
        var authUrl = `https://api.instagram.com/oauth/authorize?client_id=${environment.instagram.clientId}&redirect_uri=${environment.instagram.redirectUri}&scope=instagram_business_basic&response_type=code`;
        window.location.href = authUrl;
    }

    signInWithGoogle(): void {
        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        this._authService
            .signInWithGoogle()
            .then(() => {
                this._influencerService
                    .getInfluencerUser()
                    .subscribe((userData) => {
                        const status = userData.accountStatus;
                        localStorage.setItem('userStatus', status);

                        if (status === 'ACTIVE') {
                            this._router.navigateByUrl('collaborations');
                        } else {
                            this._router.navigateByUrl('home');
                        }
                    });
                this._router.navigateByUrl('home');
            })
            .catch((error) => {
                this.signInForm.enable();
                this.signInNgForm.resetForm();

                this.alert = {
                    type: 'error',
                    message: 'Something go wrong',
                };

                this.showAlert = true;
            });
    }

    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.getRawValue()).subscribe(
            () => {
                // Set the redirect url.
                // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // to the correct page after a successful sign in. This way, that url can be set via
                // routing file and we don't have to touch here.
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/signed-in-redirect';

                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL);
            },
            (response) => {
                // Re-enable the form
                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password',
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }
}
