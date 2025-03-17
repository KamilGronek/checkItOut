import {
    Component,
    Input,
    ViewChild,
    Output,
    EventEmitter,
} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FuseCardComponent } from '@fuse/components/card';
import { MatTooltip } from "@angular/material/tooltip";

/**
 * A versatile card component that wraps the Fuse card with additional functionality.
 * Supports image display, content projection, flippable behavior, and tooltips.
 *
 * @example
 * <app-card [flippable]="true" [imgSrc]="'path/to/image.jpg'" [imgAlt]="'Description'">
 *   <div card-header>Card Title</div>
 *   Main content goes here
 *   <div card-footer>Footer information</div>
 *   <div card-back>Content for the back of the card</div>
 * </app-card>
 *
 * @example
 * <app-card [tooltip]="'Click to view details'" (click)="handleCardClick()">
 *   Simple card with tooltip and click handler
 * </app-card>
 */
@Component({
    selector: 'app-card',
    standalone: true,
    imports: [NgClass, FuseCardComponent, NgIf, MatTooltip],
    templateUrl: './card.component.html',
})
export class CardComponent {
    /**
     * Additional CSS classes to apply to the card.
     * Use this for customizing the card appearance beyond the built-in options.
     * @default ''
     */
    @Input() customClass: string = '';

    /**
     * Whether the card can be flipped to reveal back content.
     * When true, clicking the card toggles between front and back faces.
     * @default false
     */
    @Input() flippable: boolean = false;

    /**
     * Alt text for the card's image for accessibility.
     * Should describe the content of the image.
     * @optional
     */
    @Input() imgAlt: string | null;

    /**
     * Source URL for the card's header image.
     * If provided, an image will be displayed at the top of the card.
     * @optional
     */
    @Input() imgSrc: string | null;

    /**
     * Text to display in the tooltip when hovering over the card.
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
     * Event emitted when the card is clicked.
     * Only emitted if the card is not flippable or if click functionality is explicitly desired.
     */
    @Output() click?: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Reference to the underlying Fuse card component.
     * Used to control the flipping behavior.
     */
    @ViewChild(FuseCardComponent) fuseCard!: FuseCardComponent;

    /**
     * Handles the card click event.
     * If the card is flippable, toggles between front and back faces.
     * Otherwise, emits the click event.
     * Stops event propagation in either case.
     *
     * @param e The mouse or keyboard event that triggered the click
     */
    handleCardClick(e: Event): void {
        e.stopPropagation();
        if (this.flippable && this.fuseCard) {
            this.fuseCard.face = this.fuseCard.face === 'back' ? 'front' : 'back';
        } else {
            this.click.emit();
        }
    }
}
