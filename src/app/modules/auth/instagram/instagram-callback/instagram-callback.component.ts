import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstagramAuthService } from 'app/services/auth/instagram/instagram-auth.service';
import { FuseLoadingService } from '@fuse/services/loading';
import { ProvideEmailComponent } from '../../provide-email/provide-email.component';
import { NgIf } from '@angular/common';
import { SnackbarService } from 'app/services/snackbar/snackbar.service';

@Component({
    selector: 'app-callback',
    templateUrl: './instagram-callback.component.html',
    standalone: true,
    imports: [NgIf, ProvideEmailComponent],
})
export class InstagramCallbackComponent implements OnInit {
    user = signal(null);
    emailRequired = signal(false);

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _instagramAuth: InstagramAuthService,
        private _snackbarService: SnackbarService
    ) {}

    ngOnInit() {
        this._route.queryParams.subscribe((params) => {
            var error: string | null = params['error'];
            var code: string | null = params['code'];

            if (error) {
                this._router.navigate(['/sign-in']);
                console.error('Error:', error);
                this._snackbarService.showFailure(
                    'Instagram authentication failed.'
                );
            }

            if (code) {
                this.authenticateUser(code);
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
                        next: ({ firebaseToken }) => {
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
                            this._router.navigate(['/sign-in']);
                        },
                    });
            },
            error: (err) => {
                console.error('Token exchange failed:', err);
                this._router.navigate(['/sign-in']);
                this._snackbarService.showFailure(
                    'Instagram authentication failed. Try again in a few minutes or log in using other method.'
                );
            },
        });
    }

    handleEmailSubmission(email: string) {
        const { user_id, username, access_token } = this.user();
        if (user_id && username && access_token && email !== '') {
            this.user.update((user) => ({ ...user, email: email }));
            this._instagramAuth.createUser(this.user());
        }
    }

    handleCancel(): void {
        console.log('User canceled email input.');
        this._router.navigate(['/sign-in']);
        this._snackbarService.showFailure('Registration canceled.');
    }
}
