import { Component, inject, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { AccountCredentialsForm, BusinessInfoForm } from './business-sign-up.types';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { LinkComponent } from 'app/shared/components/ui/link/link.component';
import {
  AuthService,
  RegisterUserRequest,
  RegisterUserResponse
} from 'app/core/services/authentication/auth.service';
import { TranslocoPipe } from '@ngneat/transloco';
import { catchError, finalize, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    MatStep,
    ReactiveFormsModule,
    InputComponent,
    MatStepLabel,
    MatStepper,
    SelectComponent,
    ButtonComponent,
    LinkComponent,
    TranslocoPipe
  ],
  templateUrl: './business-sign-up.component.html'
})
export class BusinessSignUpComponent {
  @ViewChild('stepper') stepper: MatStepper;

  private _formBuilder = inject(FormBuilder);
  private _snackbarService = inject(SnackbarService);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  // Form completion indicators
  businessFormCompleted = false;

  // Loading states
  isSubmitting = false;
  selectedIndex = 0;

  // Business Form
  businessForm: FormGroup<BusinessInfoForm> = this._formBuilder.group({
    profilePicture: this._formBuilder.control(null),
    name: this._formBuilder.control('', [Validators.required]),
    phoneNumber: this._formBuilder.control('', [
      Validators.required
      //   Validators.pattern(/^\+?[0-9\s-()]+$/) validation to be implemented
    ]),
    city: this._formBuilder.control('', [Validators.required]),
    street: this._formBuilder.control('', [Validators.required]),
    state: this._formBuilder.control('', [Validators.required]),
    postalCode: this._formBuilder.control('', [Validators.required]),
    country: this._formBuilder.control('', [Validators.required]),
    additionalInfo: this._formBuilder.control('')
  });

  // Account Credentials Form
  credentialsForm: FormGroup<AccountCredentialsForm> = this._formBuilder.group(
    {
      firstName: this._formBuilder.control('', [Validators.required]),
      lastName: this._formBuilder.control('', [Validators.required]),
      email: this._formBuilder.control('', [Validators.required, Validators.email]),
      password: this._formBuilder.control('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: this._formBuilder.control('', [Validators.required]),
      termsOfService: this._formBuilder.control(false, [Validators.requiredTrue])
    },
    { validators: this.passwordMatchValidator }
  );

  // Custom validator to ensure password and confirmPassword match
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Step completion methods
  completeBusinessForm(): void {
    if (this.businessForm.invalid) return;

    this.businessFormCompleted = true;
    setTimeout(() => {
      this.selectedIndex = 1;
      this.stepper.next();
    });
  }

  // Helper method to check form errors
  getFormValidationErrors(): string[] {
    const errors: string[] = [];
    Object.keys(this.businessForm.controls).forEach(key => {
      const control = this.businessForm.get(key);
      if (control && control.errors) {
        errors.push(`${key}: ${JSON.stringify(control.errors)}`);
      }
    });
    return errors;
  }

  onProfilePictureUploaded(): void {
    this._snackbarService.showSuccess('Profile picture uploaded successfully.');
  }

  // Final submission
  submitForms(): void {
    if (this.businessForm.valid && this.credentialsForm.valid) {
      this.isSubmitting = true;

      // Prepare registration request
      const request: RegisterUserRequest = {
        email: this.credentialsForm.value.email,
        password: this.credentialsForm.value.password,
        firstName: this.credentialsForm.value.firstName,
        lastName: this.credentialsForm.value.lastName,
        userType: 'COMPANY',
        companyName: this.businessForm.value.name,
        phoneNumber: this.businessForm.value.phoneNumber,
        addressStreet: this.businessForm.value.street,
        addressCity: this.businessForm.value.city,
        addressPostalCode: this.businessForm.value.postalCode,
        addressCountry: this.businessForm.value.country,
        addressState: this.businessForm.value.state,
        addressInfo: this.businessForm.value.additionalInfo
      };

      // Register business user with the unified API
      this._authService
        .registerBusinessUser(request)
        .pipe(
          finalize(() => (this.isSubmitting = false)),
          catchError(error => {
            console.log(error);
            this._snackbarService.showFailure(
              `Registration failed: ${error.error.errorMessage || 'Unknown error'}`
            );
            return of(null);
          })
        )
        .subscribe((response: RegisterUserResponse) => {
          if (!response || response.error) {
            this._snackbarService.showFailure(
              response?.error.errorMessage || 'Registration failed'
            );
            return;
          }

          // Sign in with Firebase using the custom token
          if (response.customToken) {
            this._authService
              .signInWithCustomToken(response.customToken)
              .then(() => {
                this._snackbarService.showSuccess('Business account created successfully');
                this._router.navigateByUrl('/collaborations/list');
              })
              .catch(error => {
                console.error('Error signing in after registration:', error.message);
                this._snackbarService.showFailure(
                  'Account created but sign-in failed. Please sign in manually.'
                );
                this._router.navigateByUrl('/auth/sign-in');
              });
          } else {
            // If no custom token is provided, redirect to sign-in
            this._snackbarService.showSuccess(
              'Business account created successfully. Please sign in.'
            );
            this._router.navigateByUrl('/auth/sign-in');
          }
        });
    }
  }
}
