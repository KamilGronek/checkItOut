import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoModule } from '@ngneat/transloco';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator
} from '@angular/fire/auth';
import { AuthService } from 'app/core/services/authentication/auth.service';
import { UserService } from 'app/feature/users/services/user.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { NgIf } from '@angular/common';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { SecurityForm } from './security.types';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { LinkComponent } from '../../../../../shared/components/ui/link/link.component';

@Component({
  selector: 'settings-security',
  templateUrl: './security.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSnackBarModule,
    TranslocoModule,
    ButtonComponent,
    NgIf,
    InputComponent,
    LinkComponent
  ],
  standalone: true
})
export class SettingsSecurityComponent implements OnInit {
  securityForm: FormGroup<SecurityForm>;
  formSubmitting = false;
  user: any;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _userService: UserService,
    private _customSnackBar: SnackbarService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get current user from Firebase Auth
    this.user = this._authService.getCurrentUser();

    // Create the form with validators
    this.securityForm = this._formBuilder.group(
      {
        currentPassword: this._formBuilder.control('', [Validators.required]),
        newPassword: this._formBuilder.control('', [Validators.required, Validators.minLength(8)]),
        confirmNewPassword: this._formBuilder.control('', [Validators.required]),
        twoStep: this._formBuilder.control({ value: this.isMultiFactorEnabled(), disabled: true }),
        askPasswordChange: this._formBuilder.control({ value: false, disabled: true })
      },
      { validators: this.passwordMatchValidator }
    );

    // Fetch additional user preferences from your user service if needed
    this._userService.currentUser$
      .pipe(
        tap(user => {
          if (user) {
            // Set askPasswordChange from user preferences if available
            // Example: this.securityForm.get('askPasswordChange').setValue(user.preferences?.askPasswordChange || false);
          }
        }),
        catchError(() => {
          return of(null);
        })
      )
      .subscribe();
  }

  // Custom validator to ensure password and confirmPassword match
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check if multi-factor authentication is enabled
   */
  isMultiFactorEnabled(): boolean {
    if (!this.user) return false;

    const multiFactorUser = multiFactor(this.user);
    return (
      multiFactorUser &&
      multiFactorUser.enrolledFactors &&
      multiFactorUser.enrolledFactors.length > 0
    );
  }

  /**
   * Update password
   */
  updatePassword(): void {
    if (this.securityForm.invalid || this.formSubmitting) {
      return;
    }

    this.formSubmitting = true;
    this._changeDetectorRef.markForCheck();

    const currentPassword = this.securityForm.get('currentPassword').value;
    const newPassword = this.securityForm.get('newPassword').value;

    // Get current user email
    const userEmail = this.user.email;

    // Re-authenticate user before password change
    const credential = EmailAuthProvider.credential(userEmail, currentPassword);

    reauthenticateWithCredential(this.user, credential)
      .then(() => {
        // Update the password
        return updatePassword(this.user, newPassword);
      })
      .then(async () => {
        // Refresh token after password change
        await this._authService.refreshToken();

        this._customSnackBar.showSuccess('Password updated successfully');

        this.securityForm.get('currentPassword').reset();
        this.securityForm.get('newPassword').reset();
      })
      .catch(error => {
        console.error('Error updating password:', error);
        if (error.code == 'auth/invalid-credential') {
          this._customSnackBar.showFailure('Invalid current password');
        } else {
          this._customSnackBar.showFailure('Error updating password. Please try again.');
        }
      })
      .finally(() => {
        this.formSubmitting = false;
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * To be implemented
   * Toggle two-factor authentication
   */
  toggleTwoFactor(enabled: boolean): void {
    return;
    if (enabled) {
      // Enable 2FA
      // This is a simplified version. In a real application, you would:
      // 1. Show a UI to collect the phone number
      // 2. Get a verification ID (via a separate API endpoint)
      // 3. Show a UI to collect the verification code
      // 4. Enroll the multi-factor auth

      this._customSnackBar.showSuccess(
        'To enable 2FA, you need to configure the phone verification UI'
      );

      // Reset the toggle since we're not actually enabling it in this example
      this.securityForm.get('twoStep').setValue(false);
      this._changeDetectorRef.markForCheck();

      /* Implementation would look something like this:

            const multiFactorUser = multiFactor(this.user);
            multiFactorUser.getSession().then((multiFactorSession) => {
                // Send SMS verification code to phone
                const phoneInfoOptions = {
                    phoneNumber: phoneNumber,
                    session: multiFactorSession
                };

                const phoneAuthProvider = new PhoneAuthProvider(this._authService.auth);
                return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions);
            })
            .then((verificationId) => {
                // User enters verification code
                const verificationCode = '123456'; // from user input

                const phoneAuthCredential = PhoneAuthProvider.credential(
                    verificationId, verificationCode
                );

                const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

                // Complete enrollment
                return multiFactor(this.user).enroll(multiFactorAssertion, "Phone number");
            });
            */
    } else {
      // Disable 2FA (unenroll)
      if (
        this.user &&
        multiFactor(this.user).enrolledFactors &&
        multiFactor(this.user).enrolledFactors.length > 0
      ) {
        multiFactor(this.user)
          .unenroll(multiFactor(this.user).enrolledFactors[0].uid)
          .then(() => {
            this._customSnackBar.showSuccess('Two-factor authentication disabled');
          })
          .catch(error => {
            console.error('Error disabling 2FA:', error);
            this._customSnackBar.showFailure(
              error.message || 'Error disabling 2FA. Please try again.'
            );
            // Reset the toggle since we failed to disable it
            this.securityForm.get('twoStep').setValue(true);
            this._changeDetectorRef.markForCheck();
          });
      }
    }
  }

  /**
   * Save security settings
   */
  saveSettings(): void {
    // First check if we need to update the password
    if (
      this.securityForm.get('currentPassword').value &&
      this.securityForm.get('newPassword').value
    ) {
      this.updatePassword();
    }

    // To be implemented
    return;

    // Handle 2FA changes if needed
    const twoFactorEnabled = this.securityForm.get('twoStep').value;
    const currentlyEnabled = this.isMultiFactorEnabled();

    if (twoFactorEnabled !== currentlyEnabled) {
      this.toggleTwoFactor(twoFactorEnabled);
    }

    // Save the askPasswordChange preference to your user database
    const askPasswordChange = this.securityForm.get('askPasswordChange').value;

    // Here you would save the user preference to your database
    // For example:
    // this._userService.updateUserPreferences({
    //     askPasswordChange: askPasswordChange
    // }).subscribe(() => {
    //     this._customSnackBar.open('Security preferences saved', 'Close', {
    //         duration: 3000
    //     });
    // });

    // For now, just show a success message
    if (!this.securityForm.get('currentPassword').value) {
      this._customSnackBar.showSuccess('Security preferences saved');
    }
  }
}
