import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {InstagramAuthService} from 'app/feature/authentication/services/instagram-auth.service';
import {NgIf} from '@angular/common';
import {SnackbarService} from 'app/core/services/custom-snackbar/custom-snackbar.service';
import {fuseAnimations} from '@fuse/animations';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {getAuth, EmailAuthProvider, linkWithCredential, onAuthStateChanged} from "@angular/fire/auth";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ButtonComponent} from "app/shared/components/ui/button/button.component";
import {InputComponent} from "app/shared/components/ui/input/input.component";
import {LinkComponent} from "app/shared/components/ui/link/link.component";
import {AccountCredentialsForm} from "../../sign-up/business/business-sign-up.types";

@Component({
    selector: 'app-instagram-influencer-callback',
    templateUrl: './instagram-influencer-callback.component.html',
    standalone: true,
    animations: fuseAnimations,
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RouterLink,
        ButtonComponent,
        InputComponent,
        LinkComponent,
    ],
})
export class InstagramInfluencerCallbackComponent implements OnInit {
    private _formBuilder = inject(FormBuilder);

    user = signal(null);
    emailRequired = signal(false);

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _instagramAuth: InstagramAuthService,
        private _snackbarService: SnackbarService
    ) {
    }

    credentialsForm: FormGroup<AccountCredentialsForm> = this._formBuilder.group({
        email: this._formBuilder.control('', [Validators.required, Validators.email]),
        password: this._formBuilder.control('', [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        ]),
        confirmPassword: this._formBuilder.control('', [Validators.required]),
        termsOfService: this._formBuilder.control(false, [Validators.requiredTrue])
    }, { validators: this.passwordMatchValidator });

    ngOnInit() {
        this._route.queryParams.subscribe((params) => {
            var error: string | null = params['error'];
            var code: string | null = params['code'];

            if (error) {
                this._router.navigate(['/auth/sign-in']);
                console.error('Error:', error);
                this._snackbarService.showFailure(
                    'Instagram authentication failed.'
                );
            }

            if (code) {
                this.authenticateUser(code);
            } else {
                this._router.navigate(['/auth/sign-in']);
                this._snackbarService.showFailure(
                    'Error authenticating with Instagram.'
                );
            }
        });
    }

    passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        return password === confirmPassword ? null : { passwordMismatch: true };
    }

    private authenticateUser(code: string) {
        this._instagramAuth.exchangeToken(code).subscribe({
            next: (user) => {
                this.user.set(user.instagramUser);

                this._instagramAuth
                    .checkUserExists(user.instagramUser.user_id)
                    .subscribe({
                        next: ({firebaseToken}) => {
                            if (firebaseToken) {
                                console.log('User exists.');
                                this._instagramAuth.signIn(firebaseToken);
                            } else {
                                console.log('User does not exist.');
                                this.emailRequired.set(true);
                                return;
                            }
                        },
                        error: (err) => {
                            console.error('Error checking user:', err);
                            this._router.navigate(['/auth/sign-in']);
                        },
                    });
            },
            error: (err) => {
                console.error('Token exchange failed:', err);
                this._router.navigate(['/auth/sign-in']);
                this._snackbarService.showFailure(
                    'Instagram authentication failed. Try again in a few minutes or log in using other method.'
                );
            },
        });
    }

    handleEmailAndPasswordSubmission() {
        this.credentialsForm.disable();

        if (this.credentialsForm.invalid) {
            this._snackbarService.showFailure('Invalid email address.');
            this.credentialsForm.enable();
            return;
        }
        const email = this.credentialsForm.value.email;
        const password = this.credentialsForm.value.password;
        const {user_id, username, access_token} = this.user();
        if (user_id && username && access_token && email !== '') {
            this.user.update((user) => ({...user, email: email}));
            this._instagramAuth.createUser(this.user());

            // Connect email and password with firebase instagram account
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const credential = EmailAuthProvider.credential(email, password);

                    linkWithCredential(user, credential)
                        .then((userCredential) => {
                            console.log("Email/Password account linked successfully:", userCredential.user);
                        })
                        .catch((error) => {
                            console.error("Error linking email/password:", error);
                            this._snackbarService.showFailure(`Error linking email/password: ${error}`);
                        });
                } else {
                    console.log("No user is signed in.");
                }
            });

            // if (user) {
            //     const credential = EmailAuthProvider.credential(email, password);
            //     linkWithCredential(user, credential)
            //         .then((usercred) => {
            //             console.log("Email/Password account linked successfully:", usercred.user);
            //         })
            //         .catch((error) => {
            //             console.error("Error linking email/password:", error);
            //         });
            // } else {
            //     console.log("No user is signed in.");
            // }
        }
    }
}
