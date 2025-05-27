import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslocoService, TranslocoPipe } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

// Import shared components
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ContactFormModalComponent } from '../support/components/contact-form-modal/contact-form-modal.component';
import { FaqService } from '../support/services/faqs/faq.service';
import { Faq } from '../support/services/faqs/faq.types';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoPipe,
    HeaderComponent,
    FooterComponent,
    MatTooltipModule,
    MatIconModule,
    ContactFormModalComponent
  ],
  standalone: true
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private translocoService = inject(TranslocoService);
  private route = inject(ActivatedRoute);

  private langSubscription?: Subscription;
  cookiesAccepted = false;
  activeTab = 'influencers';
  openFaqIndex: number | null = null;

  private faqService = inject(FaqService);
  landingFaqs: Faq[] = [];
  isLoadingFaqs = false;
  isContactModalOpen = false;

  ngOnInit(): void {
    // Check for cookie consent
    this.cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';

    // Scroll to fragment if present in URL
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });

    // Initialize observer for animation on scroll
    this.setupScrollObserver();

    // this.loadLandingFaqs();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  /**
   * Load top FAQs for landing page display
   */
  private loadLandingFaqs(): void {
    this.isLoadingFaqs = true;

    this.faqService.getAllFaqCategories().subscribe({
      next: categories => {
        // Get first 5 FAQs from all categories for landing page
        const allFaqs = categories.flatMap(category => category.faqs);
        this.landingFaqs = allFaqs
          .filter(faq => faq.active)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .slice(0, 5);
        this.isLoadingFaqs = false;
      },
      error: () => {
        this.isLoadingFaqs = false;
        // Keep landingFaqs empty, fallback will be handled by FAQ service
      }
    });
  }

  /**
   * Open contact modal
   */
  openContactModal(): void {
    this.isContactModalOpen = true;
  }

  /**
   * Close contact modal
   */
  closeContactModal(): void {
    this.isContactModalOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScrollAnimation();
  }

  /**
   * Set active tab for how it works section
   */
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  /**
   * Toggle FAQ item
   */
  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  /**
   * Accept cookies
   */
  acceptCookies(): void {
    localStorage.setItem('cookiesAccepted', 'true');
    this.cookiesAccepted = true;
  }

  /**
   * Setup scroll observer for animations
   */
  private setupScrollObserver(): void {
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-5');
          }
        });
      }, observerOptions);

      // Observe all elements with slide-up animation
      setTimeout(() => {
        document.querySelectorAll('.slide-up').forEach(element => {
          observer.observe(element);
        });
      }, 100);
    }
  }

  /**
   * Check scroll animation (fallback method)
   */
  private checkScrollAnimation(): void {
    const scrollElements = document.querySelectorAll('.slide-up');
    const windowHeight = window.innerHeight;

    scrollElements.forEach(element => {
      const position = element.getBoundingClientRect();

      // If element is in viewport
      if (position.top < windowHeight - 50) {
        element.classList.add('opacity-100', 'translate-y-0');
        element.classList.remove('opacity-0', 'translate-y-5');
      }
    });
  }
}
