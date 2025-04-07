import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserPreferencesService } from 'app/feature/users/services/user-preferences/user-preferences.service';
import {
  UserPreference,
  CommunicationFrequency,
  UserPreferenceForm
} from 'app/feature/users/services/user-preferences/user-preferences.types';
import { catchError, finalize, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { FuseConfigService } from '@fuse/services/config';
import { AuthService } from 'app/core/services/authentication/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'settings-preferences',
  templateUrl: './preferences.component.html',
  imports: [
    CommonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    TranslocoPipe,
    SelectComponent,
    ButtonComponent
  ],
  standalone: true
})
export class SettingsPreferencesComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _userPreferencesService: UserPreferencesService,
    private _translocoService: TranslocoService,
    private _snackbarService: SnackbarService,
    private _fuseConfigService: FuseConfigService,
    private _authService: AuthService
  ) {
    this.preferencesForm = this.createForm();
  }

  preferencesForm: FormGroup<UserPreferenceForm>;
  loading = false;
  saving = false;
  originalValues: UserPreference | null = null;
  formDirty = false;

  ngOnInit(): void {
    this.loadUserPreferences();

    // Track form changes
    this.preferencesForm.valueChanges.subscribe(() => {
      this.formDirty = true;
    });
  }

  createForm(): FormGroup<UserPreferenceForm> {
    return this._formBuilder.group<UserPreferenceForm>({
      notificationEmailEnabled: this._formBuilder.control<boolean>(false),
      notificationPushEnabled: this._formBuilder.control<boolean>(false),
      notificationSmsEnabled: this._formBuilder.control<boolean>(false),
      darkModeEnabled: this._formBuilder.control<boolean>(false),
      language: this._formBuilder.control<string>('en'),
      communicationFrequency: this._formBuilder.control<CommunicationFrequency>(
        CommunicationFrequency.WEEKLY
      ),
      gdprMarketingConsent: this._formBuilder.control<boolean>(false),
      twoFactorAuthenticationEnabled: this._formBuilder.control<boolean>(false)
    });
  }

  loadUserPreferences(): void {
    this.loading = true;
    this._userPreferencesService
      .getCurrentUserPreference()
      .pipe(
        take(1),
        catchError(error => {
          console.error('Error loading user preferences', error);
          this._snackbarService.showFailure('Could not load your preferences');
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(preferences => {
        if (preferences) {
          this.originalValues = { ...preferences };
          this.preferencesForm.patchValue(preferences);
          this.formDirty = false;

          // Apply dark mode theme immediately for preview
          this.preferencesForm.get('darkModeEnabled')?.valueChanges.subscribe(isDarkMode => {
            this.applyTheme(isDarkMode);
          });

          // Apply language changes immediately for preview
          this.preferencesForm.get('language')?.valueChanges.subscribe(language => {
            if (language) {
              this._translocoService.setActiveLang(language);
            }
          });
        }
      });
  }

  savePreferences(): void {
    if (this.preferencesForm.invalid) {
      return;
    }

    const formValue = this.preferencesForm.getRawValue();
    this.saving = true;

    this._userPreferencesService
      .updateCurrentUserPreferences(formValue as UserPreference)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Error saving preferences', error);
          this._snackbarService.showFailure('Could not save preferences');
          return of(null);
        }),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(result => {
        if (result) {
          this.originalValues = { ...result };
          this.formDirty = false;
          this._snackbarService.showSuccess('Preferences saved successfully');

          // Apply theme if needed
          this.applyTheme(result.darkModeEnabled);
        }
      });
  }

  cancelChanges(): void {
    if (this.originalValues) {
      this.preferencesForm.patchValue(this.originalValues);
      this.formDirty = false;

      // Reapply original theme
      this.applyTheme(this.originalValues.darkModeEnabled);

      // Reapply original language
      if (this.originalValues.language) {
        this._translocoService.setActiveLang(this.originalValues.language);
      }
    }
  }

  private applyTheme(isDarkMode: boolean): void {
    this._fuseConfigService.config = { scheme: isDarkMode ? 'dark' : 'light' };
  }
}
