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
import { AuthService } from 'app/core/services/authentication/auth.service';
import { TranslocoPipe } from '@ngneat/transloco';
import { UserService } from 'app/feature/users/services/user.service';
import { AccountStatus, CreateUserRequest, UserType } from 'app/feature/users/services/user.types';
import { UserAddressesService } from 'app/feature/users/services/user-addresses/user-addresses.service';
import { AddressType } from 'app/feature/users/services/user-addresses/user-addresses.types';

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
  private _userService = inject(UserService);
  private _addressService = inject(UserAddressesService);
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
    email: this._formBuilder.control('', [Validators.required, Validators.email]),
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

      // Use credentials email for login, but business email for the account
      const accountEmail = this.businessForm.value.email;
      const loginEmail = this.credentialsForm.value.email;

      // Create Firebase user
      this._authService
        .signUpWithPassword({
          name: this.credentialsForm.value.firstName,
          email: loginEmail,
          password: this.credentialsForm.value.password
        })
        .then(userCredential => {
          // Create user record using the user service
          const newUser: CreateUserRequest = {
            userType: UserType.COMPANY,
            email: accountEmail,
            firstName: this.credentialsForm.value.firstName,
            lastName: this.credentialsForm.value.lastName,
            name: this.businessForm.value.name,
            profilePicture: this.businessForm.value.profilePicture,
            phoneNumber: this.businessForm.value.phoneNumber,
            accountStatus: AccountStatus.INACTIVE
          };

          // Use the new user service to create the user
          this._userService.createUser(newUser).subscribe({
            next: createdUser => {
              // After user is created, create the address
              if (createdUser && createdUser.id) {
                // Create the address record
                this._addressService
                  .createAddress(createdUser.id, {
                    userId: createdUser.id,
                    street: this.businessForm.value.street,
                    city: this.businessForm.value.city,
                    postalCode: this.businessForm.value.postalCode,
                    country: this.businessForm.value.country,
                    state: this.businessForm.value.state,
                    additionalInfo: this.businessForm.value.additionalInfo,
                    addressType: AddressType.MAIN,
                    primary: true
                  })
                  .subscribe({
                    next: () => {
                      this.isSubmitting = false;
                      this._snackbarService.showSuccess('Business account created successfully.');
                      this._router.navigateByUrl('/collaborations/list');
                    },
                    error: err => {
                      console.error('Error creating address:', err);
                      // Continue anyway since user was created
                      this.isSubmitting = false;
                      this._snackbarService.showSuccess(
                        'Account created, but address could not be saved.'
                      );
                      this._router.navigateByUrl('/collaborations/list');
                    }
                  });
              } else {
                this.isSubmitting = false;
                this._snackbarService.showSuccess('Business account created successfully.');
                this._router.navigateByUrl('/collaborations/list');
              }
            },
            error: async err => {
              this.isSubmitting = false;
              console.error('Error creating user:', err);
              this._snackbarService.showFailure(
                `Error creating account: ${err.message || 'Unknown error'}`
              );

              // Delete Firebase user if backend creation fails
              const user = this._authService.getCurrentUser();
              console.log(user);
              if (user) {
                try {
                  await user.delete();
                  this._authService.signOut();
                } catch (deleteError) {
                  console.error('Error deleting Firebase user:', deleteError);
                }
              }
            }
          });
        })
        .catch(err => {
          this.isSubmitting = false;
          console.error('Firebase signup error:', err);
          this._snackbarService.showFailure(
            `Account creation failed: ${err.message || 'Email already in use or invalid'}`
          );
        });
    }
  }
}
