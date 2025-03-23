import {Component, inject, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatStep, MatStepLabel, MatStepper} from "@angular/material/stepper";
import {InputComponent} from "app/shared/components/ui/input/input.component";
import {
    AccountCredentialsForm, businessCategories,
    businessCategoryDefault,
    BusinessFormGroup,
    BusinessRepresentativeForm
} from "./business-sign-up.types";
import {SelectComponent} from "app/shared/components/ui/select/select.component";
import {ButtonComponent} from "app/shared/components/ui/button/button.component";
import {SnackbarService} from "app/core/services/custom-snackbar/custom-snackbar.service";
import {LinkComponent} from "app/shared/components/ui/link/link.component";
import {CompanyService} from "app/feature/companies/services/company.service";
import {AuthService} from "app/core/services/authentication/auth.service";
import {TranslocoPipe} from "@ngneat/transloco";

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
    private _snackbarService = inject(SnackbarService)
    private _companyService = inject(CompanyService);
    private _authService = inject(AuthService);
    private _router = inject(Router);

    // Form completion indicators
    businessFormCompleted = false;
    representativeFormCompleted = false;

    // Loading states
    isSubmitting = false;
    selectedIndex = 0;

    // Options
    categories = businessCategories;

    // Business Form
    businessForm: FormGroup<BusinessFormGroup> = this._formBuilder.group({
        logo: this._formBuilder.control(null),
        name: this._formBuilder.control('', [Validators.required]),
        description: this._formBuilder.control(''),
        category: this._formBuilder.control(businessCategoryDefault.value, [Validators.required]),
        country: this._formBuilder.control('', [Validators.required]),
        address: this._formBuilder.group({
            street: this._formBuilder.control('', [Validators.required]),
            city: this._formBuilder.control('', [Validators.required]),
            state: this._formBuilder.control('', [Validators.required]),
            zip: this._formBuilder.control('', [Validators.required])
        }),
        phone: this._formBuilder.control('', [Validators.required, Validators.pattern(/^\+?[0-9\s-()]+$/)]),
        email: this._formBuilder.control('', [Validators.required, Validators.email])
    });

    // Business Representative Form
    representativeForm: FormGroup<BusinessRepresentativeForm> = this._formBuilder.group({
        firstName: this._formBuilder.control('', [Validators.required]),
        lastName: this._formBuilder.control('', [Validators.required]),
        email: this._formBuilder.control('', [Validators.required, Validators.email]),
        phone: this._formBuilder.control('', [Validators.required, Validators.pattern(/^\+?[0-9\s-()]+$/)])
    });

    // Business Credentials Form
    credentialsForm: FormGroup<AccountCredentialsForm> = this._formBuilder.group({
        email: this._formBuilder.control('', [Validators.required, Validators.email]),
        password: this._formBuilder.control('', [
            Validators.required,
            Validators.minLength(8),
        ]),
        confirmPassword: this._formBuilder.control('', [Validators.required]),
        termsOfService: this._formBuilder.control(false, [Validators.requiredTrue])
    }, { validators: this.passwordMatchValidator });

    // Custom validator to ensure password and confirmPassword match
    passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        return password === confirmPassword ? null : { passwordMismatch: true };
    }

    // Step completion methods
    completeBusinessForm(): void {
        if (this.businessForm.valid) {
            this.businessFormCompleted = true;
            // Use setTimeout to ensure the completion state is updated before moving to next step
            setTimeout(() => {
                this.selectedIndex = 1;
                this.stepper.next();
            });
        }
    }

    completeRepresentativeForm(): void {
        if (this.representativeForm.valid) {
            this.representativeFormCompleted = true;
            // Use setTimeout to ensure the completion state is updated before moving to next step
            setTimeout(() => {
                this.selectedIndex = 2;
                this.stepper.next();
            });
        }
    }

    onProfilePictureUploaded(): void {
        this._snackbarService.showSuccess(
            'Business Logo uploaded successfully.'
        );
    }

    // Final submission
    submitForms(): void {
        if (this.businessForm.valid && this.representativeForm.valid && this.credentialsForm.valid) {
            this.isSubmitting = true;

            // Create final submission object
            const submissionData = {
                business: this.businessForm.value,
                representative: this.representativeForm.value,
                credentials: {
                    email: this.credentialsForm.value.email,
                    password: this.credentialsForm.value.password
                }
            };

            this._authService.signUpWithPassword({
                name: submissionData.representative.firstName,
                email: submissionData.credentials.email,
                password: submissionData.credentials.password,
            })
                .then(() => {
                    // Create user on backend after user is created in firebase
                    this._companyService.create(submissionData).subscribe({
                        next: (result) => {
                            this.isSubmitting = false;
                            this._snackbarService.showSuccess("Business account created successfully.");
                            this._router.navigateByUrl('/collaborations/list');
                        },
                        error: async (err) => {
                            this.isSubmitting = false;
                            this._snackbarService.showFailure(`Error creating account: ${err.message}`);

                            // Delete Firebase user if backend creation fails
                            const user = this._authService.getCurrentUser();
                            if (user) {
                                try {
                                    await user.delete();
                                    this._authService.signOut();
                                } catch (deleteError) {
                                    console.error("Error deleting Firebase user:", deleteError);
                                }
                            }
                        }
                    })
                })
                .catch((err) => {
                    this.isSubmitting = false;
                    console.log(err);
                    this._snackbarService.showFailure(`Account with this email already exists.`);
                })
        }
    }
}
