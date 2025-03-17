import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

interface ResponsiveOptionsInterface {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel.component.html',
})
export class CarouselComponent {
  @Input() items: any[];
  @Input() showCarousel: boolean;
  @Input() numVisible: number = 4;
  @Input() numScroll: number = 1;
  defaultResponsiveOptions = [
    { breakpoint: '1600px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '680px', numVisible: 1, numScroll: 1 }
  ];
  @Input() responsiveOptions: ResponsiveOptionsInterface[] = this.defaultResponsiveOptions;

  onPageChange(event: any): void {
    console.log('Carousel event:', event);
  }

  @ContentChild('itemTemplate', { static: true }) itemTemplate: TemplateRef<any>;
}
