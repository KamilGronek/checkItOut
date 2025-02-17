import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import {
    sendPasswordResetEmail,
    Auth,
    sendEmailVerification,
    RecaptchaVerifier,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    FacebookAuthProvider,
    signInWithPopup,
    signInWithCredential,
    signOut,
    GoogleAuthProvider,
    UserCredential,
    signInWithCustomToken,
    getAuth,
} from '@angular/fire/auth';
import { user } from 'app/mock-api/common/user/data';
import { jwtDecode } from 'jwt-decode';
import { User } from '../user/user.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private auth = inject(Auth);

    // private userRole: string | null = null;

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

            this._userService.user = this.getUserFromToken();
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
            console.warn('Brak tokenu dostępowego.');
            return null;
        }

        try {
            return this.decodeToken(token);
        } catch (error) {
            console.error('Błąd podczas dekodowania tokenu:', error);
            return null;
        }
    }

    //norbert.marchewka44@gmail.com   // Admin
    // Janekmapsa66!ppp

    //norbert.marchewka97@gmail.com   // Influenser
    // Janekmapsa66!ppp

    //norbert.marchewka22@gmail.com   // Brak roli
    // Janekmapsa66!ppp

    getRole() {
        const decodedToken = this.getDecodedToken();
        let dataTokenRole = decodedToken.custom_claims?.[0] ?? null;

        if (dataTokenRole == null) {
            dataTokenRole = 'unauthorized';
        }

        return dataTokenRole;
    }

    getUserFromToken(): User {
        const decodedToken = this.getDecodedToken();

        if (!decodedToken) {
            console.warn(
                'Nie można utworzyć użytkownika — brak poprawnego tokenu.'
            );
            return {} as User;
        }

        let newUser = { ...user };
        newUser.email = decodedToken.email || '';
        newUser.id = decodedToken.user_id || null;

        return newUser;
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

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError(() => 'User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = this.getUserFromToken();

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    signInUsingEmailAndPassword(credentials: {
        email: string;
        password: string;
    }): Promise<any> {
        if (this._authenticated) {
            throwError(() => 'User is already logged in.');
        }

        return signInWithEmailAndPassword(
            this.auth,
            credentials.email,
            credentials.password
        )
            .then((userCredential) => {
                return new Promise<string>((resolve, reject) => {
                    resolve(userCredential.user.getIdToken());
                });
            })
            .then((token) => {
                return new Promise((resolve, reject) => {
                    this.accessToken = token;
                    this._authenticated = true;
                    this._userService.user = this.getUserFromToken();
                    resolve(true);
                });
            });
    }

    signInWithFacebook(): Promise<any> {
        if (this._authenticated) {
            throwError(() => 'User is already logged in.');
        }

        const provider = new FacebookAuthProvider();

        return signInWithPopup(this.auth, provider)
            .then((userCredential) => {
                return new Promise<string>((resolve, reject) => {
                    resolve(userCredential.user.getIdToken());
                });
            })
            .then((token) => {
                return new Promise((resolve, reject) => {
                    this.accessToken = token;
                    this._authenticated = true;
                    this._userService.user = this.getUserFromToken();
                    resolve(true);
                });
            });
    }

    signInWithGoogle(): Promise<any> {
        if (this._authenticated) {
            throwError(() => 'User is already logged in.');
        }

        const provider = new GoogleAuthProvider();

        return signInWithPopup(this.auth, provider)
            .then((userCredential) => {
                return new Promise<string>((resolve, reject) => {
                    resolve(userCredential.user.getIdToken());
                });
            })
            .then((token) => {
                return new Promise((resolve, reject) => {
                    this.accessToken = token;
                    this._authenticated = true;
                    this._userService.user = this.getUserFromToken();
                    resolve(true);
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
            const userCredential = await signInWithCustomToken(
                this.auth,
                firebaseToken
            );
            const token = await userCredential.user.getIdToken();

            this.accessToken = token;
            this._authenticated = true;
            this._userService.user = this.getUserFromToken();
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
                accessToken: this.accessToken,
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

                    // Store the user on the user service
                    this._userService.user = this.getUserFromToken();

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

        return this.auth.signOut();
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUpWithPassword(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Promise<any> {
        return createUserWithEmailAndPassword(
            this.auth,
            user.email,
            user.password
        );
    }

    sendConfirmationEmail(userCredential: UserCredential): Promise<any> {
        return sendEmailVerification(userCredential.user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
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
