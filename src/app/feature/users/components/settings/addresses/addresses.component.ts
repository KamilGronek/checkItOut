import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserAddressesService } from 'app/feature/users/services/user-addresses/user-addresses.service';
import {
  Address,
  AddressType
} from 'app/feature/users/services/user-addresses/user-addresses.types';
import { AddressDialogComponent } from './address-dialog/address-dialog.component';

// Mock user instead of using user service
interface MockUser {
  id: number;
  name: string;
}

import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { CardComponent } from 'app/shared/components/ui/card/card.component';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { BehaviorSubject, Observable, Subject, finalize, takeUntil } from 'rxjs';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatDialogModule,
    MatSlideToggleModule,
    MatTooltipModule,
    TranslocoModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    AsyncPipe,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressesComponent implements OnInit, OnDestroy {
  addresses$: Observable<Address[]>;
  addressTypes: { label: string; value: AddressType }[] = [];
  currentUser: MockUser = { id: 1, name: 'Mock User' };
  isLoading$ = new BehaviorSubject<boolean>(false);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _addressesService: UserAddressesService,
    private _fuseConfirmation: FuseConfirmationService,
    private _snackbarService: SnackbarService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    private _translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.addresses$ = this._addressesService.addresses$;

    // Initial load of addresses
    this.loadAddresses();

    // Load address types
    this.loadAddressTypes();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Load addresses for the current user
   */
  loadAddresses(): void {
    this.isLoading$.next(true);
    this._addressesService
      .getUserAddresses(this.currentUser.id)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe({
        error: error => {
          console.error('Error loading addresses:', error);
          this._snackbarService.showFailure(
            this._translocoService.translate('address.messages.loadError')
          );
        }
      });
  }

  /**
   * Load address types
   */
  loadAddressTypes(): void {
    this._addressesService
      .getAddressTypes()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: types => {
          this.addressTypes = types.map(type => ({
            label: `address.types.${type}`,
            value: type
          }));
          this._changeDetectorRef.markForCheck();
        },
        error: error => {
          console.error('Error loading address types:', error);
          // Fallback to hardcoded values if API fails
          this.addressTypes = Object.values(AddressType).map(type => ({
            label: `address.types.${type}`,
            value: type as AddressType
          }));
          this._changeDetectorRef.markForCheck();
        }
      });
  }

  /**
   * Open the create address form dialog
   */
  openCreateAddressForm(): void {
    const dialogRef = this._matDialog.open(AddressDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        operation: 'create',
        addressTypes: this.addressTypes
      }
    });

    dialogRef.afterClosed().subscribe(formData => {
      if (formData) {
        this.isLoading$.next(true);
        this._addressesService
          .createAddress(this.currentUser.id, formData)
          .pipe(
            takeUntil(this._unsubscribeAll),
            finalize(() => this.isLoading$.next(false))
          )
          .subscribe({
            next: () => {
              this._snackbarService.showSuccess(
                this._translocoService.translate('address.messages.createSuccess')
              );
              this._changeDetectorRef.markForCheck();
            },
            error: error => {
              console.error('Error creating address:', error);
              this._snackbarService.showFailure(
                this._translocoService.translate('address.messages.createError')
              );
              this._changeDetectorRef.markForCheck();
            }
          });
      }
    });
  }

  /**
   * Open the edit address form dialog
   */
  openEditAddressForm(address: Address): void {
    const dialogRef = this._matDialog.open(AddressDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        operation: 'update',
        address: address,
        addressTypes: this.addressTypes
      }
    });

    dialogRef.afterClosed().subscribe(formData => {
      if (formData) {
        this.isLoading$.next(true);
        this._addressesService
          .updateAddress(address.id, formData)
          .pipe(
            takeUntil(this._unsubscribeAll),
            finalize(() => this.isLoading$.next(false))
          )
          .subscribe({
            next: () => {
              this._snackbarService.showSuccess(
                this._translocoService.translate('address.messages.updateSuccess')
              );
              this._changeDetectorRef.markForCheck();
            },
            error: error => {
              console.error('Error updating address:', error);
              this._snackbarService.showFailure(
                this._translocoService.translate('address.messages.updateError')
              );
              this._changeDetectorRef.markForCheck();
            }
          });
      }
    });
  }

  /**
   * Delete an address
   */
  deleteAddress(address: Address): void {
    const confirmation = this._fuseConfirmation.open({
      title: this._translocoService.translate('address.confirm.deleteTitle'),
      message: this._translocoService.translate('address.confirm.deleteMessage'),
      actions: {
        confirm: {
          label: this._translocoService.translate('address.actions.delete')
        }
      }
    });

    confirmation.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this.isLoading$.next(true);
        this._addressesService
          .deleteAddress(address.id)
          .pipe(
            takeUntil(this._unsubscribeAll),
            finalize(() => this.isLoading$.next(false))
          )
          .subscribe({
            next: () => {
              this._snackbarService.showSuccess(
                this._translocoService.translate('address.messages.deleteSuccess')
              );
              this._changeDetectorRef.markForCheck();
            },
            error: error => {
              console.error('Error deleting address:', error);
              this._snackbarService.showFailure(
                this._translocoService.translate('address.messages.deleteError')
              );
              this._changeDetectorRef.markForCheck();
            }
          });
      }
    });
  }

  /**
   * Set an address as primary
   */
  setPrimaryAddress(address: Address): void {
    if (address.primary) {
      return;
    }

    this.isLoading$.next(true);
    this._addressesService
      .setAsPrimary(address.id)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe({
        next: () => {
          this._snackbarService.showSuccess(
            this._translocoService.translate('address.messages.primarySuccess')
          );
          this._changeDetectorRef.markForCheck();
        },
        error: error => {
          console.error('Error setting primary address:', error);
          this._snackbarService.showFailure(
            this._translocoService.translate('address.messages.primaryError')
          );
          this._changeDetectorRef.markForCheck();
        }
      });
  }

  /**
   * Track by function for ngFor loops
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
