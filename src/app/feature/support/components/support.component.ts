import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FaqService } from 'app/feature/support/services/faqs/faq.service';
import { Faq } from 'app/feature/support/services/faqs/faq.types';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'support',
  templateUrl: './support.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
    MatExpansionModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ]
})
export class SupportComponent implements OnInit, OnDestroy {
  faqs: Faq[] = [];
  searchControl = new FormControl('');
  isSearching = false;
  searchResults: Faq[] = [];

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(private _faqService: FaqService) {}

  ngOnInit(): void {
    // Load top FAQs from all categories
    this.loadTopFaqs();

    // Setup search functionality
    this.setupSearch();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   * Load the top/featured FAQs to display on the support home page
   */
  private loadTopFaqs(): void {
    this._faqService
      .getAllFaqCategories()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(categories => {
        // Get the top FAQ from each category
        this.faqs = [];
        categories.forEach(category => {
          // Sort FAQs by display order and take the first 1-2 from each category
          const sortedFaqs = [...category.faqs].sort((a, b) => a.displayOrder - b.displayOrder);
          if (sortedFaqs.length > 0) {
            this.faqs.push(sortedFaqs[0]);
            // Add second FAQ if available and we have space
            if (sortedFaqs.length > 1 && this.faqs.length < 5) {
              this.faqs.push(sortedFaqs[1]);
            }
          }
        });

        // Limit to 5 FAQs total
        this.faqs = this.faqs.slice(0, 5);
      });
  }

  /**
   * Setup the search functionality
   */
  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query || query.trim() === '') {
            this.searchResults = [];
            return [];
          }

          this.isSearching = true;
          return this._faqService.searchFaqs(query);
        })
      )
      .subscribe({
        next: results => {
          this.searchResults = results;
          this.isSearching = false;
        },
        error: () => {
          this.isSearching = false;
          this.searchResults = [];
        }
      });
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
