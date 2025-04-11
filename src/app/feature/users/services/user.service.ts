import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'environments/environment';
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserResponse,
  UserSearchParams
} from './user.types';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _httpClient = inject(HttpClient);
  private _snackbarService = inject(SnackbarService);
  private _baseUrl = `${environment.apiUrl}/user`;

  // Current user subject
  private _currentUser = new BehaviorSubject<User | null>(null);

  /**
   * Current user as observable
   */
  get currentUser$(): Observable<User | null> {
    return this._currentUser.asObservable();
  }

  /**
   * Set current user
   */
  setCurrentUser(user: User): void {
    this._currentUser.next(user);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this._currentUser.value;
  }

  /**
   * Get account statuses
   */
  getAccountStatuses(): Observable<string[]> {
    return this._httpClient.get<string[]>(`${this._baseUrl}/accounts/status`);
  }

  /**
   * Get users with pagination and filtering
   */
  getUsers(params: UserSearchParams): Observable<UserResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page?.toString() || '0')
      .set('size', params.size?.toString() || '10');

    // Add optional filter parameters
    if (params.firstName) httpParams = httpParams.set('firstName', params.firstName);
    if (params.lastName) httpParams = httpParams.set('lastName', params.lastName);
    if (params.email) httpParams = httpParams.set('email', params.email);
    if (params.accountStatus) httpParams = httpParams.set('accountStatus', params.accountStatus);
    if (params.userType) httpParams = httpParams.set('userType', params.userType);
    if (params.followersAmount)
      httpParams = httpParams.set('followersAmount', params.followersAmount);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);

    return this._httpClient.get<UserResponse>(`${this._baseUrl}/paged`, { params: httpParams });
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): Observable<User> {
    return this._httpClient.get<User>(`${this._baseUrl}/${id}`);
  }

  /**
   * Get user by firebase ID
   */
  getUserByFirebaseId(firebaseId: string): Observable<User> {
    return this._httpClient.get<User>(`${this._baseUrl}/user/${firebaseId}`);
  }

  /**
   * Get currently logged in user
   */
  getLoggedInUser(): Observable<User> {
    const accessToken = localStorage.getItem('accessToken');

    var decodedToken = null;
    try {
      decodedToken = jwtDecode(accessToken);
    } catch (error) {
      console.error('Error decoding token:', error);
    }

    if (!decodedToken) {
      return of(null);
    }

    return this.getUserByFirebaseId(decodedToken.sub).pipe(
      tap(user => {
        this._currentUser.next(user);
      }),
      catchError(error => {
        console.error('Error fetching current user:', error);
        return of(null);
      })
    );
  }

  /**
   * Create user
   */
  createUser(user: CreateUserRequest): Observable<User> {
    return this._httpClient.post<User>(this._baseUrl, user).pipe(
      tap(response => {
        this._snackbarService.showSuccess('User created successfully');
        return response;
      }),
      catchError(error => {
        console.error('Error creating user:', error);
        this._snackbarService.showFailure(error.error?.message || 'Error creating user');
        return of(null);
      })
    );
  }

  /**
   * Update user (PATCH - partial update)
   */
  updateUser(id: number, user: UpdateUserRequest): Observable<User> {
    return this._httpClient.patch<User>(`${this._baseUrl}/${id}`, user).pipe(
      tap(response => {
        if (this._currentUser.value?.id === id) {
          this._currentUser.next({ ...this._currentUser.value, ...response });
        }
        this._snackbarService.showSuccess('User updated successfully');
        return response;
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        this._snackbarService.showFailure(error.error?.message || 'Error updating user');
        return of(null);
      })
    );
  }

  /**
   * Replace user (PUT - full update)
   */
  replaceUser(id: number, user: User): Observable<User> {
    return this._httpClient.put<User>(`${this._baseUrl}/${id}`, user).pipe(
      tap(response => {
        if (this._currentUser.value?.id === id) {
          this._currentUser.next(response);
        }
        this._snackbarService.showSuccess('User replaced successfully');
        return response;
      }),
      catchError(error => {
        console.error('Error replacing user:', error);
        this._snackbarService.showFailure(error.error?.message || 'Error replacing user');
        return of(null);
      })
    );
  }

  /**
   * Delete user
   */
  deleteUser(id: number): Observable<boolean> {
    return this._httpClient.delete<boolean>(`${this._baseUrl}/${id}`).pipe(
      tap(response => {
        this._snackbarService.showSuccess('User deleted successfully');
        return response;
      }),
      catchError(error => {
        console.error('Error deleting user:', error);
        this._snackbarService.showFailure(error.error?.message || 'Error deleting user');
        return of(false);
      })
    );
  }

  /**
   * Delete multiple users
   */
  deleteMultipleUsers(ids: number[]): Observable<boolean> {
    const idsString = ids.join(',');
    return this._httpClient.delete<boolean>(`${this._baseUrl}/${idsString}`).pipe(
      tap(response => {
        this._snackbarService.showSuccess('Users deleted successfully');
        return response;
      }),
      catchError(error => {
        console.error('Error deleting users:', error);
        this._snackbarService.showFailure(error.error?.message || 'Error deleting users');
        return of(false);
      })
    );
  }

  /**
   * Initialize the user service
   * This should be called from app initialization to load the current user
   */
  initialize(): Observable<User> {
    return this.getLoggedInUser();
  }
}
