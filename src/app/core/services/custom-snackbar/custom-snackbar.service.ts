import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomSnackbarComponent} from 'app/shared/components/custom-snackbar/custom-snackbar.component';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private snackBar: MatSnackBar) {
    }

    showSuccess(message: string): void {
        const snackBarRef = this.snackBar.openFromComponent(
            CustomSnackbarComponent,
            {
                data: {
                    message,
                    type: 'success',
                    dismiss: () => snackBarRef.dismiss(),
                },
                duration: 3000,
                panelClass: 'snackbar-container',
                verticalPosition: 'top',
                horizontalPosition: 'right',
            }
        );
    }

    showFailure(message: string): void {
        const snackBarRef = this.snackBar.openFromComponent(
            CustomSnackbarComponent,
            {
                data: {
                    message,
                    type: 'failure',
                    dismiss: () => snackBarRef.dismiss(),
                },
                duration: 3000,
                panelClass: 'snackbar-container',
                verticalPosition: 'top',
                horizontalPosition: 'right',
            }
        );
    }
}
