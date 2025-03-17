/**
 * @fileoverview Angular component that provides a flexible and reusable link element with multiple variants and styling options.
 * The component supports both internal routing links and external links with customizable appearance.
 */

import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgTemplateOutlet,
} from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LinkColor, LinkVariant } from 'app/shared/components/ui/link/link.types';
import { baseClasses, colorClasses } from "app/shared/components/ui/link/link.styles";

/**
 * A versatile link component that can be used for both internal navigation and external links.
 * Supports multiple styling variants, colors, and optional icon display.
 *
 * @example
 * // Basic usage for external link
 * <app-link href="https://example.com">Visit Example</app-link>
 *
 * @example
 * // Internal routing link with custom color
 * <app-link [routerLink]="['/dashboard']" color="accent">Go to Dashboard</app-link>
 *
 * @example
 * // Button-style link with icon
 * <app-link href="/downloads" variant="button" icon="download">Download</app-link>
 *
 * @example
 * // Icon-only link
 * <app-link href="/settings" variant="icon" icon="settings"></app-link>
 */
@Component({
    selector: 'app-link',
    standalone: true,
    imports: [
        RouterModule,
        NgIf,
        MatIcon,
        NgSwitch,
        NgTemplateOutlet,
        NgSwitchCase,
        NgSwitchDefault,
    ],
    templateUrl: './link.component.html',
})
export class LinkComponent implements OnInit {
    /**
     * URL for external links. Use this for links outside the application.
     * If both href and routerLink are provided, routerLink takes precedence.
     */
    @Input() href?: string;

    /**
     * Target for internal routing. Can be a string path or array of route segments.
     * This will automatically use Angular's router for navigation.
     */
    @Input() routerLink?: string | any[];

    /**
     * Specifies where to open the linked document.
     * '_self' opens in the same window/tab (default).
     * '_blank' opens in a new window/tab.
     * @default '_self'
     */
    @Input() target: '_self' | '_blank' = '_self';

    /**
     * Optional icon to display with the link.
     * Uses Material icons. Provide the icon name as a string.
     * For icon-only links (variant='icon'), defaults to 'link' if not specified.
     */
    @Input() icon?: string;

    /**
     * Additional CSS classes to apply to the link.
     * These will be appended to the base classes determined by variant and color.
     * @default ''
     */
    @Input() customClass: string = '';

    /**
     * Visual style variant of the link.
     * - 'default': Standard text link with hover underline
     * - 'underlined': Permanently underlined text link
     * - 'button': Button-styled link with padding and background
     * - 'subtle': Lower opacity text that increases on hover
     * - 'icon': Icon-only link (uses icon property)
     * @default 'default'
     */
    @Input() variant: LinkVariant = 'default';

    /**
     * Color theme for the link.
     * - 'primary': Main application color
     * - 'accent': Secondary accent color
     * - 'warn': Warning/error color
     * - 'neutral': Gray/neutral color
     * @default 'primary'
     */
    @Input() color: LinkColor = 'primary';

    /**
     * Base CSS class determined by the variant and color.
     * This is computed during initialization.
     */
    baseClass: string = 'font-medium text-primary-500 hover:underline';

    /**
     * Link type determined by inputs.
     * - 'external': Standard <a> element with href
     * - 'routing': Angular router link
     */
    type: 'external' | 'routing' = 'external';

    /**
     * Initializes the component, determines link type, validates inputs,
     * and computes the appropriate CSS classes.
     */
    ngOnInit(): void {
        // Determine if this is a routing or external link
        this.type = this.routerLink ? 'routing' : 'external';

        // Validate variant and color
        const validVariants: LinkVariant[] = ['default', 'underlined', 'button', 'subtle', 'icon'];
        const validColors: LinkColor[] = ['primary', 'accent', 'warn', 'neutral'];

        if (!validVariants.includes(this.variant)) {
            console.warn(`Invalid link variant: ${this.variant}. Falling back to 'default'.`);
            this.variant = 'default';
        }

        if (!validColors.includes(this.color)) {
            console.warn(`Invalid link color: ${this.color}. Falling back to 'primary'.`);
            this.color = 'primary';
        }

        // Set the appropriate CSS classes based on variant and color
        this.baseClass = this.getBaseClass();
    }

    /**
     * Constructs the CSS class string based on the current variant and color.
     *
     * @returns {string} Combined CSS classes for styling the link
     * @private
     */
    private getBaseClass(): string {
        const baseClass = baseClasses[this.variant] || baseClasses['default'];
        const colorClass = colorClasses[this.color]?.[this.variant] || colorClasses['primary']['default'];
        return `${baseClass} ${colorClass}`;
    }
}
