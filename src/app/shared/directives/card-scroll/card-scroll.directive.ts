import { Directive, OnInit, AfterViewInit, ElementRef, NgZone } from '@angular/core';

@Directive({
  selector: '[appCardScroll]',
  standalone: true
})
export class CardScrollDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    // Run outside Angular's change detection to avoid performance issues
    this.zone.runOutsideAngular(() => {
      this.fixFuseCardScrolling();
    });
  }

  private fixFuseCardScrolling(): void {
    const checkAndFix = () => {
      // Get all fuse cards within the current element
      const fuseCards = this.el.nativeElement.querySelectorAll('fuse-card');
      
      if (fuseCards.length === 0) {
        // If no cards found yet, try again in a moment
        setTimeout(checkAndFix, 1000);
        return;
      }
      
      fuseCards.forEach((card: HTMLElement) => {
        // Find the card back container within this card
        const cardBack = card.querySelector('.fuse-card-back');
        if (cardBack) {
          // Prevent touchmove from being canceled
          cardBack.addEventListener('touchmove', (e) => {
            e.stopPropagation();
          }, { passive: true });
        }
      });
      
      // Check periodically for new cards that might be added dynamically
      setTimeout(checkAndFix, 2000);
    };
    
    // Start the process
    checkAndFix();
  }
}
