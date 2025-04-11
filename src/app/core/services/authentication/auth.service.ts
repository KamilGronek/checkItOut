import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/utilities/auth.utils';
import { UserService } from 'app/feature/users/services/user.service';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  UserCredential
} from '@angular/fire/auth';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../../feature/users/services/user.types';
import { SnackbarService } from '../custom-snackbar/custom-snackbar.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated: boolean = false;
  private _httpClient = inject(HttpClient);
  private _userService = inject(UserService);
  private _snackbarService = inject(SnackbarService);
  private auth = inject(Auth);

  constructor() {
    this.initializeAuth();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  initializeAuth(): void {
    const token = this.getAccessToken();

    if (token && !AuthUtils.isTokenExpired(token)) {
      this._authenticated = true;
      this.dataTokenRole = this.getRole();
    }
  }

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  decodeToken(token: string): any {
    return jwtDecode(token);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async refreshToken(): Promise<void> {
    const token = this.getAccessToken();

    if (!token || AuthUtils.isTokenExpired(token)) {
      const user = this.auth.currentUser;
      if (user) {
        const newToken = await user.getIdToken(true); // Force refresh
        this.accessToken = newToken;
        console.log('Token refreshed:', newToken);
      }
    }
  }

  dataTokenRole: any;

  getDecodedToken(): any {
    const token = this.getAccessToken();
    if (!token) {
      console.warn('No access token available.');
      return null;
    }

    try {
      return this.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRole() {
    const decodedToken = this.getDecodedToken();
    let dataTokenRole = decodedToken?.custom_claims?.[0] ?? null;

    if (dataTokenRole == null) {
      dataTokenRole = 'unauthorized';
    }

    return dataTokenRole;
  }

  getUserFromToken(): User {
    const decodedToken = this.getDecodedToken();

    if (!decodedToken) {
      console.warn('Cannot create user - no valid token.');
      return null;
    }

    // Return minimal user info from token, full details will be fetched from UserService
    return {
      firebaseUserId: decodedToken.user_id || null,
      email: decodedToken.email || '',
      firstName: '',
      lastName: '',
      userType: null,
      accountStatus: null
    } as User;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Promise<any> {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  async signInUsingEmailAndPassword(credentials: {
    email: string;
    password: string;
  }): Promise<any> {
    if (this._authenticated) {
      throwError(() => 'User is already logged in.');
    }

    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    );
    const token = await new Promise<string>((resolve, reject) => {
      resolve(userCredential.user.getIdToken());
    });
    return await new Promise((resolve_1, reject_1) => {
      this.accessToken = token;
      this._authenticated = true;

      // Load user data from backend
      this._userService.getLoggedInUser().subscribe({
        next: user_1 => {
          if (user_1) {
            this._snackbarService.showSuccess(`Welcome back, ${user_1.firstName}!`);
          }
          resolve_1(true);
        },
        error: error_1 => {
          console.error('Error loading user data:', error_1);
          // Continue even if user data fails to load
          resolve_1(true);
        }
      });
    });
  }

  /**
   * Sign in with instagram
   */
  async signInWithInstagram(firebaseToken: string): Promise<void> {
    if (this._authenticated) {
      throwError(() => 'User is already logged in.');
    }

    try {
      const userCredential = await signInWithCustomToken(this.auth, firebaseToken);
      const token = await userCredential.user.getIdToken();

      this.accessToken = token;
      this._authenticated = true;

      // Load user data from backend
      this._userService.getLoggedInUser().subscribe();
    } catch (error) {
      console.error('Firebase Login Error:', error);
      throw error;
    }
  }

  /**
   * Sign in using the access token
   */
  signInUsingToken(): Observable<any> {
    // Sign in using the token
    return this._httpClient
      .post('api/auth/sign-in-with-token', {
        accessToken: this.accessToken
      })
      .pipe(
        catchError(() =>
          // Return false
          of(false)
        ),
        switchMap((response: any) => {
          // Replace the access token with the new one if it's available on
          // the response object.
          //
          // This is an added optional step for better security. Once you sign
          // in using the token, you should generate a new one on the server
          // side and attach it to the response object. Then the following
          // piece of code can replace the token with the refreshed one.
          if (response.accessToken) {
            this.accessToken = response.accessToken;
          }

          // Set the authenticated flag to true
          this._authenticated = true;

          // Load user data from backend
          this._userService.getLoggedInUser().subscribe();

          // Return true
          return of(true);
        })
      );
  }

  /**
   * Sign out
   */
  signOut(): Promise<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');

    // Set the authenticated flag to false
    this._authenticated = false;

    // Clear user data
    this._userService.setCurrentUser(null);

    return this.auth.signOut().then(() => {
      this._snackbarService.showSuccess('You have been successfully signed out.');
    });
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUpWithPassword(user: { name: string; email: string; password: string }): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  sendConfirmationEmail(userCredential: UserCredential): Promise<any> {
    return sendEmailVerification(userCredential.user);
  }

  /**
   * Unlock session
   *
   * @param credentials
   */
  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return this._httpClient.post('api/auth/unlock-session', credentials);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    // If the access token exists, and it didn't expire, sign in using it
    return this.signInUsingToken();
  }
}
