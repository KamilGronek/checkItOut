import {
    Component,
    Input,
    ViewChild,
    Output,
    EventEmitter,
} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [NgClass, FuseCardComponent, NgIf],
    templateUrl: './card.component.html',
})
export class CardComponent{
    @Input() customClass: string = '';
    @Input() flippable: boolean = false;
    @Input() imgAlt: string | null;
    @Input() imgSrc: string | null;

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
