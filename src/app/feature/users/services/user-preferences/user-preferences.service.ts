import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { UserPreference } from './user-preferences.types';
import { TranslocoService } from '@ngneat/transloco';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private apiUrl = `${environment.apiUrl}/user-preferences`;

  constructor(
    private http: HttpClient,
    private translocoService: TranslocoService,
    private userService: UserService
  ) {}

  /**
   * Get current user preferences
   * @returns Observable of user preferences
   */
  getCurrentUserPreference(): Observable<UserPreference> {
    return this.http.get<UserPreference>(`${this.apiUrl}/me`).pipe(
      catchError(error => {
        console.error('Error retrieving user preferences:', error);
        return throwError(() => new Error('Failed to load user preferences'));
      }),
      tap(preferences => {
        // Update application language if user has a language preference
        if (preferences?.language) {
          this.translocoService.setActiveLang(preferences.language);
        }
      })
    );
  }

  /**
   * Get user preferences by user ID (admin only)
   * @param userId User ID
   * @returns Observable of user preferences
   */
  getUserPreference(userId: number): Observable<UserPreference> {
    return this.http.get<UserPreference>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(error => {
        console.error('Error retrieving user preferences:', error);
        return throwError(() => new Error('Failed to load user preferences'));
      })
    );
  }

  /**
   * Update current user preferences
   * @param preferences Partial user preferences to update
   * @returns Observable of updated user preferences
   */
  updateCurrentUserPreferences(preferences: Partial<UserPreference>): Observable<UserPreference> {
    return this.http.patch<UserPreference>(`${this.apiUrl}/me`, preferences).pipe(
      catchError(error => {
        console.error('Error updating user preferences:', error);
        return throwError(() => new Error('Failed to update user preferences'));
      }),
      tap(updatedPreferences => {
        // Update application language if it was changed
        if (updatedPreferences?.language) {
          this.translocoService.setActiveLang(updatedPreferences.language);
        }
      })
    );
  }

  /**
   * Replace all current user preferences (PUT)
   * @param preferences Complete user preferences
   * @returns Observable of updated user preferences
   */
  replaceCurrentUserPreferences(preferences: UserPreference): Observable<UserPreference> {
    return this.http.put<UserPreference>(`${this.apiUrl}/me`, preferences).pipe(
      catchError(error => {
        console.error('Error replacing user preferences:', error);
        return throwError(() => new Error('Failed to replace user preferences'));
      }),
      tap(updatedPreferences => {
        // Update application language
        if (updatedPreferences?.language) {
          this.translocoService.setActiveLang(updatedPreferences.language);
        }
      })
    );
  }

  /**
   * Update user preferences by user ID (admin only)
   * @param userId User ID
   * @param preferences Partial user preferences to update
   * @returns Observable of updated user preferences
   */
  updateUserPreferences(
    userId: number,
    preferences: Partial<UserPreference>
  ): Observable<UserPreference> {
    return this.http.patch<UserPreference>(`${this.apiUrl}/user/${userId}`, preferences).pipe(
      catchError(error => {
        console.error('Error updating user preferences:', error);
        return throwError(() => new Error('Failed to update user preferences'));
      })
    );
  }

  /**
   * Apply user preferences to the application
   * Used when loading the app to set theme, language, etc.
   */
  applyUserPreferences(): void {
    const user = this.userService.getCurrentUser();
    if (!user) return;

    this.getCurrentUserPreference()
      .pipe(
        catchError(error => {
          console.warn('Could not load user preferences, using defaults', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: preferences => {
          // Apply theme
          if (preferences.darkModeEnabled) {
            document.body.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
          }

          // Apply language
          if (preferences.language) {
            this.translocoService.setActiveLang(preferences.language);
          }
        },
        error: () => {
          // Use default settings if preferences cannot be loaded
          document.body.classList.remove('dark');
          this.translocoService.setActiveLang('en');
        }
      });
  }
}
