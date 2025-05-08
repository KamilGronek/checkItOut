import { Component, OnInit, Input, HostListener, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() currentLang: string = 'en';

  isMenuOpen: boolean = false;
  isLangDropdownOpen: boolean = false;
  isScrolled: boolean = false;

  private langSubscription: Subscription;
  private routerSubscription: Subscription;

  constructor(
    private translocoService: TranslocoService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if page is already scrolled on init
    this.checkScroll();

    // Subscribe to language changes from TranslocoService
    this.langSubscription = this.translocoService.langChanges$.subscribe(lang => {
      this.currentLang = lang;
      // Trigger change detection
      this.cdRef.markForCheck();
    });

    // If currentLang was provided as an input, update TranslocoService
    if (this.currentLang) {
      this.setActiveLang(this.currentLang);
    }

    // Close mobile menu on route change
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
    });

    // Add listener to close language dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If currentLang is changed from parent component, update TranslocoService
    if (changes.currentLang) {
      this.setActiveLang(this.currentLang);
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    // Remove document event listener
    document.removeEventListener('click', this.handleOutsideClick);
  }

  // Handle clicks outside language dropdown
  handleOutsideClick = (event: MouseEvent) => {
    const langSwitcher = document.querySelector('.lang-switcher');
    if (langSwitcher && !langSwitcher.contains(event.target as Node) && this.isLangDropdownOpen) {
      this.isLangDropdownOpen = false;
      this.cdRef.markForCheck();
    }
  };

  @HostListener('window:scroll', [])
  checkScroll() {
    this.isScrolled = window.scrollY > 20;
    this.cdRef.markForCheck();
  }

  @HostListener('window:resize', [])
  onResize() {
    // Close mobile menu on window resize (especially when switching to desktop)
    if (window.innerWidth > 992 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:keydown.escape', [])
  onEscapePress() {
    // Close mobile menu and language dropdown when Escape key is pressed
    if (this.isMenuOpen || this.isLangDropdownOpen) {
      this.isMenuOpen = false;
      this.isLangDropdownOpen = false;
      document.body.style.overflow = '';
      this.cdRef.markForCheck();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Lock body scroll when menu is open
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Close language dropdown when menu is opened
      this.isLangDropdownOpen = false;
    } else {
      document.body.style.overflow = '';
    }

    this.cdRef.markForCheck();
  }

  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
      this.cdRef.markForCheck();
    }
  }

  toggleLangDropdown(event: Event): void {
    event.stopPropagation();
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
    this.cdRef.markForCheck();
  }

  switchLanguage(lang: string): void {
    console.log('Header switchLanguage called with:', lang);
    this.setActiveLang(lang);
    this.isLangDropdownOpen = false;
    this.cdRef.markForCheck();
  }

  // Helper method to set language and save preference
  private setActiveLang(lang: string): void {
    if (lang && (lang === 'en' || lang === 'pl')) {
      // Set the active language in TranslocoService
      this.translocoService.setActiveLang(lang);

      // Save language preference to localStorage
      localStorage.setItem('preferredLanguage', lang);
    }
  }
}
