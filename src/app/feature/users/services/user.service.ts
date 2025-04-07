import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {User} from 'app/feature/users/services/user.types';
import {map, Observable, ReplaySubject, tap} from 'rxjs';
import {AuthService} from "app/core/services/authentication/auth.service";
import {environment} from "environments/environment";

@Injectable({providedIn: 'root'})
export class UserService {
    private apiUrl: string = environment.apiUrl;

    private _httpClient = inject(HttpClient);
    // private _authService = inject(AuthService);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<User> {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    // getCurrentUser() {
    //     let user = this._authService.getDecodedToken();
    //     return this._httpClient.get(
    //         this.apiUrl + `/user/user/${user.sub}`
    //     );
    // }
}
