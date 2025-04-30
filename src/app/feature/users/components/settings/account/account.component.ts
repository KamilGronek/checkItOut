import { TextFieldModule } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/feature/users/services/user.service';
import { User, UpdateUserRequest } from 'app/feature/users/services/user.types';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoPipe } from '@ngneat/transloco';
import { NgIf, NgClass } from '@angular/common';
import { FileInfo } from 'app/core/services/file/file.types';

type PersonalInfoForm = {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  profilePicture: FormControl<FileInfo | null>;
  phoneNumber: FormControl<string | null>;
  name: FormControl<string | null>;
};

@Component({
  selector: 'settings-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TextFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    InputComponent,
    ButtonComponent,
    TranslocoPipe
  ],
  standalone: true
})
export class SettingsAccountComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _userService = inject(UserService);
  private _snackbarService = inject(SnackbarService);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  accountForm: FormGroup<PersonalInfoForm>;
  currentUser: User | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
    // Initialize the form
    this.accountForm = this._formBuilder.group({
      firstName: this._formBuilder.control('', [Validators.required, Validators.minLength(2)]),
      lastName: this._formBuilder.control('', [Validators.required, Validators.minLength(2)]),
      email: this._formBuilder.control('', [Validators.required, Validators.email]),
      profilePicture: this._formBuilder.control(null),
      phoneNumber: this._formBuilder.control(''),
      name: this._formBuilder.control('')
    });
  }

  ngOnInit(): void {
    // Subscribe to user changes
    this._userService.currentUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.initAccountForm(user);
      } else {
        this.isLoading = true;
        this._userService
          .getLoggedInUser()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next: user => {
              if (user) {
                this.currentUser = user;
                this.initAccountForm(user);
              }
              this.isLoading = false;
              this._changeDetectorRef.markForCheck();
            },
            error: () => {
              this.isLoading = false;
              this._snackbarService.showFailure('Failed to load user profile');
              this._changeDetectorRef.markForCheck();
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  initAccountForm(user: User): void {
    console.log(user);
    this.accountForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: {
        fileName: 'Profile picture',
        contentType: 'image/jpeg',
        fileUrl: user.profilePicture || '',
        fileSize: 0,
        uploadedAt: Date.now()
      },
      phoneNumber: user.phoneNumber || '',
      name: user.name || ''
    });
    console.log(this.accountForm.value);
    this._changeDetectorRef.markForCheck();
  }

  saveProfile(): void {
    if (this.accountForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.accountForm.markAllAsTouched();
      return;
    }

    if (!this.currentUser?.id) {
      this._snackbarService.showFailure('User profile not loaded');
      return;
    }

    this.isSaving = true;
    const updateRequest: UpdateUserRequest = {
      firstName: this.accountForm.get('firstName').value,
      lastName: this.accountForm.get('lastName').value,
      email: this.accountForm.get('email').value,
      profilePicture: this.accountForm.get('profilePicture').value.fileUrl || null,
      phoneNumber: this.accountForm.get('phoneNumber').value || null,
      name: this.accountForm.get('name').value || null
    };

    this._userService
      .updateUser(this.currentUser.id, updateRequest)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: updatedUser => {
          this.isSaving = false;
          if (updatedUser) {
            this._snackbarService.showSuccess('Profile updated successfully');
          }
          this._changeDetectorRef.markForCheck();
        },
        error: () => {
          this.isSaving = false;
          this._snackbarService.showFailure('Failed to update profile');
          this._changeDetectorRef.markForCheck();
        }
      });
  }

  cancelChanges(): void {
    if (this.currentUser) {
      this.initAccountForm(this.currentUser);
    }
  }
}
