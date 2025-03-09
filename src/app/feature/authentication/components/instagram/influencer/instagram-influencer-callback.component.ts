import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {InstagramAuthService} from 'app/feature/authentication/services/instagram-auth.service';
import {NgIf} from '@angular/common';
import {SnackbarService} from 'app/core/services/custom-snackbar/custom-snackbar.service';
import {fuseAnimations} from '@fuse/animations';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ButtonComponent} from "app/shared/components/ui/button/button.component";
import {InputComponent} from "app/shared/components/ui/input/input.component";
import {LinkComponent} from "app/shared/components/ui/link/link.component";

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
    user = signal(null);
    emailRequired = signal(false);
    emailForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _instagramAuth: InstagramAuthService,
        private _snackbarService: SnackbarService
    ) {
    }

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

    handleEmailSubmission() {
        this.emailForm.disable();

        if (this.emailForm.invalid) {
            this._snackbarService.showFailure('Invalid email address.');
            this.emailForm.enable();
            return;
        }
        const email = this.emailForm.value.email;
        const {user_id, username, access_token} = this.user();
        if (user_id && username && access_token && email !== '') {
            this.user.update((user) => ({...user, email: email}));
            this._instagramAuth.createUser(this.user());
        }
    }
}
