import {
    Component,
    Input,
    ViewChild,
    Output,
    EventEmitter,
} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FuseCardComponent } from '@fuse/components/card';
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [NgClass, FuseCardComponent, NgIf, MatButton, MatTooltip],
    templateUrl: './card.component.html',
})
export class CardComponent{
    @Input() customClass: string = '';
    @Input() flippable: boolean = false;
    @Input() imgAlt: string | null;
    @Input() imgSrc: string | null;
    @Input() tooltip: string | null = null;
    @Input() tooltipShowDelay: number = 1000;
    @Input() tooltipHideDelay: number = 300;

    @Output() click?: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild(FuseCardComponent) fuseCard!: FuseCardComponent;

    /**
     * Toggle card face if flippable equals to true
     * Emit click event if flippable equals to false
     */
    handleCardClick(e:Event): void {
        e.stopPropagation()
        if(this.flippable && this.fuseCard) {
            this.fuseCard.face = this.fuseCard.face === 'back' ? 'front' : 'back';
        } else {
            this.click.emit();
        }
    }
}
