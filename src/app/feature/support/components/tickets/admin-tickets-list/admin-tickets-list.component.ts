import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { SupportTicketService } from 'app/feature/support/services/tickets/support-ticket.service';
import {
  PaginatedTicketResponse,
  SupportTicketDtoOut,
  TicketCategory,
  TicketListFilter,
  TicketStatus
} from 'app/feature/support/services/tickets/support-tickets.types';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { CardComponent } from 'app/shared/components/ui/card/card.component';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { Option } from 'app/shared/components/ui/select/select.types';

@Component({
  selector: 'app-admin-tickets-list',
  templateUrl: './admin-tickets-list.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslocoPipe,
    ButtonComponent,
    CardComponent,
    InputComponent,
    SelectComponent
  ]
})
export class AdminTicketsListComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  ticketsData: PaginatedTicketResponse = null;
  isLoading = false;

  statusOptions: Option[] = [];
  categoryOptions: Option[] = [];

  // Table columns definition
  displayedColumns: string[] = [
    'reference',
    'subject',
    'category',
    'status',
    'created',
    'updated',
    'actions'
  ];

  // Pagination defaults
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _supportTicketService: SupportTicketService
  ) {
    // Initialize form
    this.filterForm = this._formBuilder.group({
      searchQuery: [''],
      status: [null],
      category: [null]
    });

    // Initialize select options
    this.statusOptions = this._supportTicketService
      .getTicketStatuses()
      .map(status => ({ label: status.label, value: status.value }));

    this.categoryOptions = this._supportTicketService
      .getTicketCategories()
      .map(category => ({ label: category.label, value: category.value }));

    // Add "All" options
    this.statusOptions.unshift({ label: 'All Statuses', value: null });
    this.categoryOptions.unshift({ label: 'All Categories', value: null });
  }

  ngOnInit(): void {
    // Subscribe to ticket list data
    this._supportTicketService.ticketList$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(tickets => {
        this.ticketsData = tickets;
        this.isLoading = false;
      });

    // Load initial tickets
    this.loadTickets();

    // Subscribe to form changes
    this.filterForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      // Reset to first page when filter changes
      this.pageIndex = 0;
      this.loadTickets();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Load tickets with current filter and pagination
   */
  loadTickets(): void {
    this.isLoading = true;

    const filter: TicketListFilter = {
      searchQuery: this.filterForm.value.searchQuery,
      status: this.filterForm.value.status,
      category: this.filterForm.value.category,
      page: this.pageIndex,
      size: this.pageSize
    };

    this._supportTicketService.getTickets(filter).pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  /**
   * Handle page event from paginator
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTickets();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filterForm.reset({
      searchQuery: '',
      status: null,
      category: null
    });

    // Form valueChanges will trigger loadTickets()
  }

  /**
   * Navigate to ticket detail
   */
  viewTicket(ticket: SupportTicketDtoOut): void {
    this._router.navigate(['/support/admin/tickets', ticket.id]);
  }

  /**
   * Get status badge color class
   */
  getStatusColorClass(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.OPEN:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-50';
      case TicketStatus.IN_PROGRESS:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-600 dark:text-amber-50';
      case TicketStatus.WAITING_FOR_CUSTOMER:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-purple-50';
      case TicketStatus.RESOLVED:
        return 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-50';
      case TicketStatus.CLOSED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-50';
    }
  }

  /**
   * Get category badge color class
   */
  getCategoryColorClass(category: TicketCategory): string {
    switch (category) {
      case TicketCategory.ACCOUNT_ISSUE:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-50';
      case TicketCategory.BILLING_PAYMENT:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-600 dark:text-pink-50';
      case TicketCategory.TECHNICAL_PROBLEM:
        return 'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50';
      case TicketCategory.FEATURE_REQUEST:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-600 dark:text-emerald-50';
      case TicketCategory.PARTNERSHIP_ISSUE:
        return 'bg-sky-100 text-sky-800 dark:bg-sky-600 dark:text-sky-50';
      case TicketCategory.CONTENT_MODERATION:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-600 dark:text-orange-50';
      case TicketCategory.GENERAL_INQUIRY:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-50';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-50';
    }
  }
}
