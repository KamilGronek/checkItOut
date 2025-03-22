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
import { MatTooltip } from "@angular/material/tooltip";

/**
 * A reusable button component that wraps Angular Material buttons with additional functionality.
 * Supports different button variants, loading states, icons, and tooltips.
 *
 * @example
 * <app-button variant="flat" color="primary" [loading]="isLoading" (click)="handleButtonClick()">
 *   Submit Form
 * </app-button>
 *
 * @example
 * <app-button variant="icon" icon="edit" tooltip="Edit Item"></app-button>
 */
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
    /**
     * The visual style variant of the button.
     * @default 'text'
     */
    @Input() variant: ButtonVariant = 'text';

    /**
     * The color theme of the button.
     * @default 'primary'
     */
    @Input() color: ButtonColor = 'primary';

    /**
     * The HTML button type attribute.
     * @default 'button'
     */
    @Input() type: string = 'button';

    /**
     * Whether the button is disabled.
     * @default false
     */
    @Input() disabled: boolean = false;

    /**
     * The name of the icon to display in the button.
     * Should match an icon name from your icon registry.
     * @optional
     */
    @Input() icon?: string;

    /**
     * Whether to show a loading spinner instead of the button content.
     * When true, the button is also effectively disabled.
     * @default false
     */
    @Input() loading: boolean = false;

    /**
     * Text to display in the tooltip when hovering over the button.
     * If null, no tooltip will be shown.
     * @default null
     */
    @Input() tooltip: string | null = null;

    /**
     * Delay in milliseconds before the tooltip is shown.
     * @default 1000
     */
    @Input() tooltipShowDelay: number = 1000;

    /**
     * Delay in milliseconds before the tooltip is hidden.
     * @default 300
     */
    @Input() tooltipHideDelay: number = 300;

    /**
     * Additional CSS classes to apply to the button.
     * Use this for customizing the button appearance beyond the built-in options.
     * @default ''
     */
    @Input() customClass: string = '';

    /**
     * Event emitted when the button is clicked.
     * Will not emit if the button is disabled or in loading state.
     */
    @Output() click: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Handles the button click event.
     * Stops event propagation and emits the click event if the button is not disabled.
     *
     * @param event The mouse event from the button click
     */
    handleClick(event: Event): void {
        event.stopPropagation();
        if (!this.disabled) {
            this.click.emit();
        }
    }
}
