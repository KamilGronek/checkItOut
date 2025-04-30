import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FaqService } from 'app/feature/support/services/faqs/faq.service';
import { FaqCategory } from 'app/feature/support/services/faqs/faq.types';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatProgressSpinnerModule
  ]
})
export class FaqsComponent implements OnInit, OnDestroy {
  faqCategories: FaqCategory[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _faqService: FaqService) {}

  ngOnInit(): void {
    // Load FAQs from service
    this._faqService
      .getAllFaqCategories()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: categories => {
          this.faqCategories = categories;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading FAQs:', err);
          this.error = 'Failed to load FAQ data. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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
