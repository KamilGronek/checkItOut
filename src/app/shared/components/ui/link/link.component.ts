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
import {baseClasses, colorClasses} from "app/shared/components/ui/link/link.styles";

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
    @Input() href?: string; // For external links
    @Input() routerLink?: string | any[]; // For Angular routes
    @Input() target: '_self' | '_blank' = '_self';
    @Input() icon?: string;
    @Input() customClass: string = '';
    @Input() variant: LinkVariant = 'default';
    @Input() color: LinkColor = 'primary';

    baseClass: string = 'font-medium text-primary-500 hover:underline';
    type: 'external' | 'routing' = 'external';

    ngOnInit(): void {
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

        this.baseClass = this.getBaseClass();
    }

    private getBaseClass(): string {
        const baseClass = baseClasses[this.variant] || baseClasses['default'];
        const colorClass = colorClasses[this.color]?.[this.variant] || colorClasses['primary']['default'];
        return `${baseClass} ${colorClass}`;
    }
}
