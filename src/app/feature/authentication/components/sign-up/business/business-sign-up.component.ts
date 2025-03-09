import {Component, inject, ViewChild} from '@angular/core';
import {FuseAlertComponent, FuseAlertType} from "../../../../../../@fuse/components/alert";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {InputComponent} from "../../../../../shared/components/ui/input/input.component";
import {
    AccountCredentialsForm, businessCategories,
    businessCategoryDefault,
    BusinessFormGroup,
    BusinessRepresentativeForm
} from "./business-sign-up.types";
import {SelectComponent} from "../../../../../shared/components/ui/select/select.component";
import {ButtonComponent} from "../../../../../shared/components/ui/button/button.component";
import {SnackbarService} from "../../../../../core/services/custom-snackbar/custom-snackbar.service";

@Component({
  selector: 'app-business',
  standalone: true,
    imports: [
        FuseAlertComponent,
        NgIf,
        RouterLink,
        MatStep,
        ReactiveFormsModule,
        InputComponent,
        MatStepLabel,
        MatStepper,
        SelectComponent,
        ButtonComponent
    ],
  templateUrl: './business-sign-up.component.html'
})
export class BusinessSignUpComponent {
    @ViewChild('stepper') stepper: MatStepper;

    private _formBuilder = inject(FormBuilder);
    private _snackbarService = inject(SnackbarService)

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
        logo: this._formBuilder.control(''),
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
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        ]),
        confirmPassword: this._formBuilder.control('', [Validators.required])
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

            // Here you would typically make an API call
            console.log('Submitting data:', submissionData);

            // Simulate API call
            setTimeout(() => {
                this.isSubmitting = false;
                // Handle success or navigate to next page
            }, 1500);
        }
    }
}
