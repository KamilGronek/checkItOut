import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import {
  Address,
  AddressForm,
  AddressType,
  CreateAddressDto
} from 'app/feature/users/services/user-addresses/user-addresses.types';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';

export interface AddressDialogData {
  operation: 'create' | 'update';
  address?: Address;
  addressTypes: { label: string; value: AddressType }[];
}

// Mock user instead of using user service
interface MockUser {
  id: number;
  name: string;
}

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    MatDialogModule,
    MatSlideToggleModule,
    TranslocoModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent
  ]
})
export class AddressDialogComponent implements OnInit {
  currentUser: MockUser = { id: 1, name: 'Mock User' };
  addressForm: FormGroup<AddressForm>;
  formOperation: 'create' | 'update';
  isLoading = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<AddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddressDialogData
  ) {
    this.formOperation = data.operation;
  }

  ngOnInit(): void {
    this.initAddressForm();

    // Patch form with address data if in update mode
    if (this.formOperation === 'update' && this.data.address) {
      this.addressForm.patchValue({
        userId: this.currentUser.id,
        street: this.data.address.street,
        city: this.data.address.city,
        postalCode: this.data.address.postalCode,
        country: this.data.address.country,
        state: this.data.address.state,
        additionalInfo: this.data.address.additionalInfo || '',
        addressType: this.data.address.addressType,
        primary: this.data.address.primary
      });
    }
  }

  /**
   * Initialize the address form
   */
  initAddressForm(): void {
    this.addressForm = this._formBuilder.group<AddressForm>({
      userId: this._formBuilder.control(this.currentUser.id),
      street: this._formBuilder.control('', { nonNullable: true, validators: Validators.required }),
      city: this._formBuilder.control('', { nonNullable: true, validators: Validators.required }),
      postalCode: this._formBuilder.control('', {
        nonNullable: true,
        validators: Validators.required
      }),
      country: this._formBuilder.control('', {
        nonNullable: true,
        validators: Validators.required
      }),
      state: this._formBuilder.control('', { nonNullable: true, validators: Validators.required }),
      additionalInfo: this._formBuilder.control('', { nonNullable: true }),
      addressType: this._formBuilder.control(AddressType.MAIN, {
        nonNullable: true,
        validators: Validators.required
      }),
      primary: this._formBuilder.control(false, { nonNullable: true })
    });
  }

  /**
   * Submit the form
   */
  submitForm(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.addressForm.getRawValue();

    const addressData: CreateAddressDto = {
      userId: this.currentUser.id,
      street: formValue.street,
      city: formValue.city,
      postalCode: formValue.postalCode,
      country: formValue.country,
      state: formValue.state,
      additionalInfo: formValue.additionalInfo,
      addressType: formValue.addressType,
      primary: formValue.primary
    };

    // Close the dialog with the form data
    this._dialogRef.close(addressData);
  }

  /**
   * Cancel and close the dialog
   */
  cancel(): void {
    this._dialogRef.close();
  }
}
