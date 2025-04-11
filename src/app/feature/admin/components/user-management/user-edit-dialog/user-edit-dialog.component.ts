import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { TranslocoModule } from '@ngneat/transloco';
import { Option } from 'app/shared/components/ui/select/select.types';
import {
  AccountStatus,
  UpdateUserRequest,
  User,
  UserType
} from 'app/feature/users/services/user.types';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';

interface DialogData {
  user: User;
}

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    TranslocoModule,
    MatSlideToggleModule
  ]
})
export class UserEditDialogComponent implements OnInit {
  userForm: FormGroup;
  isLoading = false;

  // Type options
  userTypeOptions: Option[] = [
    { label: 'Admin', value: UserType.ADMIN },
    { label: 'Company', value: UserType.COMPANY },
    { label: 'Influencer', value: UserType.INFLUENCER }
  ];

  // Status options
  statusOptions: Option[] = [
    { label: 'Active', value: AccountStatus.ACTIVE },
    { label: 'In Validation', value: AccountStatus.IN_VALIDATION },
    { label: 'Inactive', value: AccountStatus.INACTIVE },
    { label: 'To Be Deleted', value: AccountStatus.TO_BE_DELETED },
    { label: 'Deleted', value: AccountStatus.DELETED }
  ];

  constructor(
    private _dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize form with user data
   */
  private initForm(): void {
    this.userForm = this._formBuilder.group({
      firstName: [this.data.user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.data.user.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.data.user.email, [Validators.required, Validators.email]],
      phoneNumber: [this.data.user.phoneNumber || ''],
      name: [this.data.user.name || ''],
      userType: [this.data.user.userType, Validators.required],
      accountStatus: [this.data.user.accountStatus, Validators.required],
      noteFromAdmin: [this.data.user.noteFromAdmin || '']
    });
  }

  /**
   * Close dialog and send back updated user data
   */
  submitForm(): void {
    if (this.userForm.invalid) {
      // Mark form as touched to show validation errors
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const updateRequest: UpdateUserRequest = {
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      email: this.userForm.get('email').value,
      phoneNumber: this.userForm.get('phoneNumber').value || null,
      name: this.userForm.get('name').value || null,
      userType: this.userForm.get('userType').value,
      accountStatus: this.userForm.get('accountStatus').value,
      noteFromAdmin: this.userForm.get('noteFromAdmin').value || null
    };

    this._dialogRef.close(updateRequest);
  }

  /**
   * Close dialog without saving
   */
  cancel(): void {
    this._dialogRef.close();
  }
}
