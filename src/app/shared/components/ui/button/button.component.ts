import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    NgClass,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgTemplateOutlet,
} from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ButtonColor, ButtonVariant } from './button.types';
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        NgIf,
        NgSwitchCase,
        NgSwitch,
        NgClass,
        MatProgressSpinner,
        NgTemplateOutlet,
        MatTooltip,
    ],
    templateUrl: './button.component.html',
})
export class ButtonComponent {
    @Input() variant: ButtonVariant = 'text';
    @Input() color: ButtonColor = 'primary';
    @Input() type: string = 'button';
    @Input() disabled: boolean = false;
    @Input() icon?: string;
    @Input() loading: boolean = false; // Loading state
    @Input() tooltip: string | null = null;
    @Input() tooltipShowDelay: number = 1000;
    @Input() tooltipHideDelay: number = 300;


    @Input() customClass: string = ''; // Allow custom classes

    @Output() click: EventEmitter<void> = new EventEmitter<void>();

    handleClick(event: Event): void {
        event.stopPropagation();
        if (!this.disabled) {
            this.click.emit();
        }
    }
}
