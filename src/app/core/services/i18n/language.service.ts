import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>(this.getInitialLanguage());
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translocoService: TranslocoService) {
    // Initialize language from localStorage or default to 'en'
    const savedLanguage = this.getInitialLanguage();
    this.setLanguage(savedLanguage);
  }

  private getInitialLanguage(): string {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pl')) {
      return savedLanguage;
    }
    // Default to English if no saved preference
    return 'en';
  }

  public setLanguage(lang: string): void {
    if (lang && (lang === 'en' || lang === 'pl')) {
      console.log('LanguageService.setLanguage called with:', lang);

      // Update the active language in Transloco
      this.translocoService.setActiveLang(lang);

      // Store the language preference
      localStorage.setItem('preferredLanguage', lang);

      // Update the observable
      this.currentLanguageSubject.next(lang);
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }
}
