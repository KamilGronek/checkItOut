import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/authentication/auth.service';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { SocialPlatformConfigService } from './social-platform-config.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';

export interface SocialSignInRequest {
  platformName: string;
  authCode: string;
}

export interface SocialSignInResponse {
  success: boolean;
  userExists: boolean;
  firebaseUserId?: string;
  customToken?: string;
  userId?: number;
  socialUserData?: any;
  errorMessage?: string;
}

export interface RegisterInfluencerRequest {
  email: string;
  platformName: string;
  socialUserData: any;
}

export interface RegisterUserResponse {
  success: boolean;
  firebaseUserId?: string;
  userId?: number;
  customToken?: string;
  socialConnection?: SocialConnectionResponse;
  socialConnectionError?: string;
  errorMessage?: string;
}

export interface SocialConnectionResponse {
  success: boolean;
  connectionId?: number;
  platformName?: string;
  socialUserId?: string;
  displayName?: string;
  followersCount?: number;
  errorMessage?: string;
}

export interface SocialConnectionRequest {
  platformName: string;
  authCode: string;
  setPrimary?: boolean;
}

/**
 * Service for handling social media authentication flows
 */
@Injectable({
  providedIn: 'root'
})
export class SocialAuthService {
  private _baseUrl = `${environment.apiUrl}/auth`;
  private _pendingAuthData = new BehaviorSubject<{ platform: string; socialUserData: any } | null>(
    null
  );

  /**
   * Pending authentication data for registration completion
   */
  get pendingAuthData$() {
    return this._pendingAuthData.asObservable();
  }

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _platformConfigService: SocialPlatformConfigService
  ) {}

  /**
   * Get supported social media platforms
   */
  getSupportedPlatforms(): Observable<string[]> {
    return this._httpClient.get<string[]>(`${this._baseUrl}/supported-platforms`);
  }

  /**
   * Start OAuth flow for the specified platform
   *
   * @param platform Platform name (e.g., 'instagram')
   */
  startOAuthFlow(platform: string): void {
    const authUrl = this._platformConfigService.getOAuthUrl(platform);
    console.log('Auth URL:', authUrl);

    if (!authUrl) {
      this._snackbarService.showFailure(`Unsupported platform: ${platform}`);
      return;
    }

    window.location.href = authUrl;
  }

  /**
   * Start Instagram OAuth flow
   */
  private startInstagramOAuth(): void {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${environment.social.instagram.clientId}&redirect_uri=${environment.social.instagram.redirectUri}&scope=user_profile,user_media&response_type=code`;
    window.location.href = authUrl;
  }

  /**
   * Process OAuth callback with authorization code
   *
   * @param platform Platform name (e.g., 'instagram')
   * @param authCode Authorization code from OAuth provider
   */
  processSocialSignIn(platform: string, authCode: string): Observable<SocialSignInResponse> {
    const request: SocialSignInRequest = {
      platformName: platform,
      authCode: authCode
    };

    return this._httpClient
      .post<SocialSignInResponse>(`${this._baseUrl}/social-sign-in`, request)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.errorMessage || 'Social sign-in failed');
          }

          // If user exists, handle sign in with Firebase
          if (response.userExists && response.customToken) {
            // No need to store data for existing users
            this._pendingAuthData.next(null);
          } else if (!response.userExists && response.socialUserData) {
            // Store the social data for registration
            this._pendingAuthData.next({
              platform,
              socialUserData: response.socialUserData
            });
          }

          return response;
        }),
        catchError(error => {
          console.error('Social sign-in error:', error);
          return throwError(() => new Error(error.error.errorMessage || 'Social sign-in failed'));
        })
      );
  }

  /**
   * Complete influencer registration with email and pending auth data
   *
   * @param email User's email address
   */
  completeInfluencerRegistration(email: string): Observable<RegisterUserResponse> {
    const pendingAuth = this._pendingAuthData.value;

    if (!pendingAuth) {
      return throwError(() => new Error('No pending authentication data'));
    }

    const request: RegisterInfluencerRequest = {
      email: email,
      platformName: pendingAuth.platform,
      socialUserData: pendingAuth.socialUserData
    };

    return this._httpClient
      .post<RegisterUserResponse>(`${this._baseUrl}/register-influencer`, request)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.errorMessage || 'Registration failed');
          }

          // Clear pending auth data
          this._pendingAuthData.next(null);

          return response;
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => new Error(error.error.errorMessage || 'Registration failed'));
        })
      );
  }

  /**
   * Connect a social platform to an existing user account
   *
   * @param firebaseUserId Firebase user ID
   * @param platform Platform name
   * @param authCode Authorization code
   * @param setPrimary Whether to set as primary social connection
   */
  connectSocialPlatform(
    platform: string,
    authCode: string,
    setPrimary = false
  ): Observable<SocialConnectionResponse> {
    const request: SocialConnectionRequest = {
      platformName: platform,
      authCode,
      setPrimary
    };

    return this._httpClient.post<SocialConnectionResponse>(
      `${this._baseUrl}/connect-social`,
      request
    );
  }

  /**
   * Sign in with Firebase using custom token from social auth
   *
   * @param customToken Firebase custom token
   */
  signInWithCustomToken(customToken: string): Promise<void> {
    return this._authService.signInWithCustomToken(customToken);
  }

  /**
   * Clear any pending authentication data
   */
  clearPendingAuthData(): void {
    this._pendingAuthData.next(null);
  }
}
