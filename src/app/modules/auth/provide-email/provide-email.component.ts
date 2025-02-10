import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-provide-email',
    standalone: true,
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
    ],
    templateUrl: './provide-email.component.html',
})
export class ProvideEmailComponent {
    @Output() emailSubmitted = new EventEmitter<string>();
    @Output() canceled = new EventEmitter<void>();

    email: string = '';

    submitEmail(): void {
        if (this.email) {
            this.emailSubmitted.emit(this.email);
        }
    }

    cancel(): void {
        this.canceled.emit();
    }
}
