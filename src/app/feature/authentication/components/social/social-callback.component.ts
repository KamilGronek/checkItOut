import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@ngneat/transloco';
import { SocialAuthService } from 'app/core/services/authentication/social-auth.service';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { LinkComponent } from 'app/shared/components/ui/link/link.component';
import { finalize } from 'rxjs';

interface EmailRegistrationForm {
  email: FormControl<string>;
  termsOfService: FormControl<boolean>;
}

@Component({
  selector: 'app-social-callback',
  templateUrl: './social-callback.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    TranslocoPipe,
    ButtonComponent,
    InputComponent,
    LinkComponent
  ]
})
export class SocialCallbackComponent implements OnInit {
  platform: string;
  authCode: string;
  isProcessing = true;
  showEmailForm = false;
  isSubmitting = false;
  errorMessage: string = null;
  pendingSocialData: any = null;

  emailForm: FormGroup<EmailRegistrationForm>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _socialAuthService: SocialAuthService,
    private _snackbarService: SnackbarService
  ) {
    this.emailForm = this._formBuilder.group({
      email: this._formBuilder.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      termsOfService: this._formBuilder.control(false, {
        validators: [Validators.requiredTrue],
        nonNullable: true
      })
    });
  }

  ngOnInit(): void {
    // Extract platform and auth code from URL path
    this._route.paramMap.subscribe(params => {
      this.platform = params.get('platform');

      // Get auth code from query params
      this._route.queryParams.subscribe(queryParams => {
        this.authCode = queryParams['code'];

        if (!this.authCode) {
          this.handleError('No authorization code provided');
          return;
        }

        this.processSocialAuth();
      });
    });
  }

  /**
   * Process social authentication with the provided platform and auth code
   */
  private processSocialAuth(): void {
    this._socialAuthService
      .processSocialSignIn(this.platform, this.authCode)
      .pipe(finalize(() => (this.isProcessing = false)))
      .subscribe({
        next: response => {
          if (response.userExists && response.customToken) {
            // Existing user - sign in with Firebase
            this._socialAuthService
              .signInWithCustomToken(response.customToken)
              .then(() => {
                this._snackbarService.showSuccess('Successfully signed in');
                this._router.navigateByUrl('/collaborations/list');
              })
              .catch(error => {
                this.handleError('Error signing in: ' + error.message);
              });
          } else if (!response.userExists && response.socialUserData) {
            // New user - show email form for registration
            this.showEmailForm = true;
            this.pendingSocialData = response.socialUserData;

            // Pre-fill email if provided by the social platform
            if (response.socialUserData.email) {
              this.emailForm.controls.email.setValue(response.socialUserData.email);
            }
          } else {
            this.handleError('Invalid response from server');
          }
        },
        error: error => {
          this.handleError(error);
        }
      });
  }

  /**
   * Complete registration with email and pending social data
   */
  completeRegistration(): void {
    if (this.emailForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const email = this.emailForm.controls.email.value;

    this._socialAuthService
      .completeInfluencerRegistration(email)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: response => {
          if (response.success && response.customToken) {
            // Sign in with the provided token
            this._socialAuthService
              .signInWithCustomToken(response.customToken)
              .then(() => {
                this._snackbarService.showSuccess('Registration completed successfully');
                this._router.navigateByUrl('/collaborations/list');
              })
              .catch(error => {
                this.handleError(error.message);
              });
          } else {
            this.handleError(response.errorMessage || 'Registration failed');
          }
        },
        error: error => {
          this.handleError(error);
        }
      });
  }

  /**
   * Handle error state
   */
  private handleError(message: string): void {
    this.errorMessage = message;
    this.isProcessing = false;
    this.showEmailForm = false;
    this._socialAuthService.clearPendingAuthData();
    this._snackbarService.showFailure(message);
  }
}
