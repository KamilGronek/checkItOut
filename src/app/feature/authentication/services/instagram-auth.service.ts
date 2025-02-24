import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from 'environments/environment';
import {AuthService} from 'app/core/services/authentication/auth.service';
import {InfluencerService} from 'app/feature/influencers/services/influencer.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class InstagramAuthService {
    constructor(
        private http: HttpClient,
        private _router: Router,
        private _authService: AuthService,
        private _influencerService: InfluencerService
    ) {
    }

    exchangeToken(code: string) {
        return this.http.post<any>(
            `${environment.apiUrl}/auth/instagram/exchange-token`,
            {
                code,
            }
        );
    }

    createUser(instagramUser: any) {
        console.log('Creating user...');
        this.generateFirebaseToken(instagramUser).subscribe({
            next: ({customToken}) => this.signIn(customToken),
        });
    }

    generateFirebaseToken(
        instagramUser: any
    ): Observable<{ customToken: string }> {
        return this.http.post<{ customToken: string }>(
            `${environment.apiUrl}/auth/instagram/generate-firebase-token`,
            instagramUser
        );
    }

    // If user exists, return the Firebase token else null
    checkUserExists(instagramId: string): Observable<any> {
        return this.http.get<any>(
            `${environment.apiUrl}/auth/instagram/firebase-user-exist?instagramId=${instagramId}`
        );
    }

    signIn(firebaseToken: string) {
        this._authService.signInWithInstagram(firebaseToken).then(() => {
            this._influencerService
                .getInfluencerUser()
                .subscribe((userData) => {
                    const status = userData.accountStatus;
                    localStorage.setItem('userStatus', status);

                    console.log('status:', status);
                    if (status === 'ACTIVE') {
                        this._router.navigateByUrl('collaborations');
                    } else {
                        this._router.navigateByUrl('home');
                    }
                });
            this._router.navigateByUrl('home');
        });
    }
}
