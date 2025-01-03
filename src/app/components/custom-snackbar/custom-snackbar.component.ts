import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-custom-snackbar',
    templateUrl: './custom-snackbar.component.html',
    styleUrls: ['./custom-snackbar.component.scss'],
    imports: [CommonModule, MatIcon],
    standalone: true,
})
export class CustomSnackbarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
