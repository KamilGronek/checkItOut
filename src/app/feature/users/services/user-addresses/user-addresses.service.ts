import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Address, AddressType, CreateAddressDto, UpdateAddressDto } from './user-addresses.types';
import { BehaviorSubject, Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAddressesService {
  private _httpClient = inject(HttpClient);
  private _addresses = new BehaviorSubject<Address[]>([]);
  private _baseUrl = `${environment.apiUrl}/address`;
  private _currentUserId: number | null = null;

  /**
   * Getter for addresses
   */
  get addresses$(): Observable<Address[]> {
    return this._addresses.asObservable();
  }

  /**
   * Get all addresses for a user
   *
   * @param userId The user ID
   */
  getUserAddresses(userId: number): Observable<Address[]> {
    this._currentUserId = userId;
    return this._httpClient.get<Address[]>(`${this._baseUrl}/user/${userId}`).pipe(
      tap(addresses => {
        this._addresses.next(this.sortAddresses(addresses));
      }),
      catchError(error => {
        console.error('Error fetching addresses:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get primary address for a user
   *
   * @param userId The user ID
   */
  getUserPrimaryAddress(userId: number): Observable<Address> {
    return this._httpClient.get<Address>(`${this._baseUrl}/user/${userId}/primary`).pipe(
      catchError(error => {
        console.error('Error fetching primary address:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get addresses of a specific type for a user
   *
   * @param userId The user ID
   * @param addressType The address type
   */
  getUserAddressesByType(userId: number, addressType: AddressType): Observable<Address[]> {
    return this._httpClient
      .get<Address[]>(`${this._baseUrl}/user/${userId}/type/${addressType}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching ${addressType} addresses:`, error);
          return throwError(() => error);
        })
      );
  }

  private sortAddresses(addresses: Address[]): Address[] {
    return addresses.sort((a, b) => {
      // Sort by primary first (true first)
      if (b.primary !== a.primary) {
        return Number(b.primary) - Number(a.primary);
      }
      // If primary is the same, sort by lastUpdateTime (descending order)
      return new Date(b.lastUpdateTime).getTime() - new Date(a.lastUpdateTime).getTime();
    });
  }

  /**
   * Refresh addresses for the current user
   * Used after operations to ensure data consistency
   */
  private _refreshAddresses(): Observable<Address[]> {
    if (!this._currentUserId) {
      return throwError(() => new Error('No current user ID'));
    }
    return this.getUserAddresses(this._currentUserId);
  }

  /**
   * Create a new address for a user
   *
   * @param userId The user ID
   * @param address The address data
   */
  createAddress(userId: number, address: CreateAddressDto): Observable<Address[]> {
    this._currentUserId = userId;
    return this._httpClient.post<Address>(`${this._baseUrl}/user/${userId}`, address).pipe(
      switchMap(() => this._refreshAddresses()),
      catchError(error => {
        console.error('Error creating address:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an address
   *
   * @param addressId The address ID
   * @param address The updated address data
   */
  updateAddress(addressId: number, address: UpdateAddressDto): Observable<Address[]> {
    return this._httpClient.put<Address>(`${this._baseUrl}/${addressId}`, address).pipe(
      switchMap(() => this._refreshAddresses()),
      catchError(error => {
        console.error('Error updating address:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Patch specific fields of an address
   *
   * @param addressId The address ID
   * @param partialAddress The partial address data to update
   */
  patchAddress(
    addressId: number,
    partialAddress: Partial<UpdateAddressDto>
  ): Observable<Address[]> {
    return this._httpClient.patch<Address>(`${this._baseUrl}/${addressId}`, partialAddress).pipe(
      switchMap(() => this._refreshAddresses()),
      catchError(error => {
        console.error('Error patching address:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete an address
   *
   * @param addressId The address ID
   */
  deleteAddress(addressId: number): Observable<Address[]> {
    return this._httpClient.delete<boolean>(`${this._baseUrl}/${addressId}`).pipe(
      switchMap(() => this._refreshAddresses()),
      catchError(error => {
        console.error('Error deleting address:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Set an address as primary
   *
   * @param addressId The address ID
   */
  setAsPrimary(addressId: number): Observable<Address[]> {
    return this._httpClient.post<boolean>(`${this._baseUrl}/${addressId}/primary`, {}).pipe(
      switchMap(() => this._refreshAddresses()),
      catchError(error => {
        console.error('Error setting primary address:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get available address types
   */
  getAddressTypes(): Observable<AddressType[]> {
    return this._httpClient.get<AddressType[]>(`${this._baseUrl}/types`).pipe(
      catchError(error => {
        console.error('Error fetching address types:', error);
        // Fallback to enum values if API fails
        return new Observable<AddressType[]>(observer => {
          observer.next(Object.values(AddressType));
          observer.complete();
        });
      })
    );
  }

  /**
   * Get a specific address by ID
   *
   * @param addressId The address ID
   */
  getAddressById(addressId: number): Observable<Address> {
    return this._httpClient.get<Address>(`${this._baseUrl}/${addressId}`).pipe(
      catchError(error => {
        console.error('Error fetching address:', error);
        return throwError(() => error);
      })
    );
  }
}
