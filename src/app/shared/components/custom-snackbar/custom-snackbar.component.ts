import {CommonModule} from '@angular/common';
import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {FuseAlertComponent} from '@fuse/components/alert';

@Component({
    selector: 'app-custom-snackbar',
    templateUrl: './custom-snackbar.component.html',
    imports: [CommonModule, FuseAlertComponent],
    standalone: true,
})
export class CustomSnackbarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    }
}
