import {
  Component,
  OnInit,
  HostListener,
  OnDestroy,
  inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslocoService, TranslocoPipe } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, RouterModule, TranslocoPipe, MatTooltipModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  private translocoService = inject(TranslocoService);
  private router = inject(Router);

  isMenuOpen = false;
  isLangDropdownOpen = false;
  isScrolled = false;

  private langSubscription?: Subscription;
  private routerSubscription?: Subscription;

  ngOnInit(): void {
    // Check if page is already scrolled on init
    this.checkScroll();

    // Close mobile menu on route change
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
      });

    // Add listener to close dropdowns when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    document.removeEventListener('click', this.handleOutsideClick);
  }

  @HostListener('window:scroll', [])
  checkScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    // Close mobile menu on window resize (especially when switching to desktop)
    if (window.innerWidth > 1024 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:keydown.escape', [])
  onEscapePress(): void {
    // Close mobile menu and language dropdown when Escape key is pressed
    if (this.isMenuOpen || this.isLangDropdownOpen) {
      this.isMenuOpen = false;
      this.isLangDropdownOpen = false;
      document.body.style.overflow = '';
    }
  }

  /**
   * Handle clicks outside dropdowns
   */
  handleOutsideClick = (event: MouseEvent): void => {
    const langSwitcher = document.querySelector('.relative');
    if (langSwitcher && !langSwitcher.contains(event.target as Node) && this.isLangDropdownOpen) {
      this.isLangDropdownOpen = false;
    }
  };

  /**
   * Toggle mobile menu
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Lock body scroll when menu is open
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
      this.isLangDropdownOpen = false;
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Close mobile menu
   */
  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  /**
   * Toggle language dropdown
   */
  toggleLangDropdown(event: Event): void {
    event.stopPropagation();
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }

  /**
   * Switch language
   */
  switchLanguage(lang: string): void {
    if (lang && (lang === 'en' || lang === 'pl')) {
      this.translocoService.setActiveLang(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
    this.isLangDropdownOpen = false;
  }

  /**
   * Get current language
   */
  getCurrentLang(): string {
    return this.translocoService.getActiveLang();
  }

  /**
   * Get current flag image path
   */
  getCurrentFlag(): string {
    const lang = this.getCurrentLang();
    return lang === 'pl' ? 'assets/images/flags/PL2.png' : 'assets/images/flags/UK.png';
  }
}
