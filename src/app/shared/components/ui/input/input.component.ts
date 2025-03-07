import {
    AfterContentInit,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
    NgClass,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
} from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import {
    MatInputType,
    OtherInputType,
} from 'app/shared/components/ui/input/input.types';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        NgIf,
        MatCheckbox,
        NgSwitch,
        NgSwitchDefault,
        NgSwitchCase,
        NgClass,
    ],
    templateUrl: './input.component.html',
})
export class InputComponent implements AfterContentInit {
    @Input() customClass: string = '';
    @Input() label!: string;
    @Input() type: MatInputType | OtherInputType = 'text';
    @Input() control!: FormControl;
    @Input() placeholder: string = '';
    @Input() hint?: string;
    @Input() prefixIcon?: string;
    @Input() id: string = `input-${Math.random()
        .toString(36)
        .substring(2, 15)}`;

    @Output() change = new EventEmitter<any>();
    @Output() keyup = new EventEmitter<any>();

    inputType: string = null; // Track input type dynamically

    ngAfterContentInit(): void {
        this.inputType = this.type;
    }

    handleInput(event: Event): void {
        if (!this.control.disabled) {
            this.change.emit();
        }
    }

    handleKeyup(event: Event): void {
        if (!this.control.disabled) {
            this.change.emit();
        }
    }

    togglePasswordVisibility(): void {
        this.inputType = this.inputType === 'password' ? 'text' : 'password';
    }

    getErrorMessage(): string {
        if (this.control?.hasError('required')) {
            return 'This field is required';
        }
        if (this.control?.hasError('email')) {
            return 'Invalid email format';
        }
        if (this.control?.hasError('minlength')) {
            return `Must be at least ${this.control.errors?.['minlength'].requiredLength} characters`;
        }
        return 'Invalid input';
    }
}
