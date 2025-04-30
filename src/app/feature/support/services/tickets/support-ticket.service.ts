import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'environments/environment';
import {
  AdminTicketResponseDtoIn,
  PaginatedTicketResponse,
  ResponseAttachmentDtoIn,
  SupportTicketDtoIn,
  SupportTicketDtoOut,
  TicketAttachmentDtoIn,
  TicketCategory,
  TicketListFilter,
  TicketResponseDtoIn,
  TicketResponseDtoOut,
  TicketStatus
} from 'app/feature/support/services/tickets/support-tickets.types';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {
  private _baseUrl = `${environment.apiUrl}/support/ticket`;
  private _currentTicket = new BehaviorSubject<SupportTicketDtoOut | null>(null);
  private _ticketList = new BehaviorSubject<PaginatedTicketResponse | null>(null);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient, private _snackbarService: SnackbarService) {}

  /**
   * Observable for current ticket
   */
  get currentTicket$(): Observable<SupportTicketDtoOut | null> {
    return this._currentTicket.asObservable();
  }

  /**
   * Observable for ticket list
   */
  get ticketList$(): Observable<PaginatedTicketResponse | null> {
    return this._ticketList.asObservable();
  }

  /**
   * Get available ticket categories
   */
  getTicketCategories(): { label: string; value: TicketCategory }[] {
    return [
      { label: 'Account Issue', value: TicketCategory.ACCOUNT_ISSUE },
      { label: 'Billing & Payment', value: TicketCategory.BILLING_PAYMENT },
      { label: 'Technical Problem', value: TicketCategory.TECHNICAL_PROBLEM },
      { label: 'Feature Request', value: TicketCategory.FEATURE_REQUEST },
      { label: 'Partnership Issue', value: TicketCategory.PARTNERSHIP_ISSUE },
      { label: 'Content Moderation', value: TicketCategory.CONTENT_MODERATION },
      { label: 'General Inquiry', value: TicketCategory.GENERAL_INQUIRY }
    ];
  }

  /**
   * Get available ticket statuses
   */
  getTicketStatuses(): { label: string; value: TicketStatus }[] {
    return [
      { label: 'Open', value: TicketStatus.OPEN },
      { label: 'In Progress', value: TicketStatus.IN_PROGRESS },
      { label: 'Waiting for Customer', value: TicketStatus.WAITING_FOR_CUSTOMER },
      { label: 'Resolved', value: TicketStatus.RESOLVED },
      { label: 'Closed', value: TicketStatus.CLOSED }
    ];
  }

  /**
   * Create a new support ticket
   */
  createTicket(ticket: SupportTicketDtoIn): Observable<SupportTicketDtoOut> {
    return this._httpClient.post<SupportTicketDtoOut>(this._baseUrl, ticket).pipe(
      tap(response => {
        this._currentTicket.next(response);
        this._snackbarService.showSuccess('Support ticket created successfully');
      }),
      catchError(error => {
        console.error('Error creating ticket:', error);
        this._snackbarService.showFailure('Failed to create support ticket');
        return of(null);
      })
    );
  }

  /**
   * Get ticket by reference and email
   */
  getTicketByReference(reference: string, email: string): Observable<SupportTicketDtoOut> {
    const params = new HttpParams().set('reference', reference).set('email', email);

    return this._httpClient.get<SupportTicketDtoOut>(`${this._baseUrl}/status`, { params }).pipe(
      tap(response => {
        this._currentTicket.next(response);
      }),
      catchError(error => {
        console.error('Error retrieving ticket:', error);
        this._snackbarService.showFailure('Ticket not found or email does not match');
        return of(null);
      })
    );
  }

  /**
   * Add customer response to ticket
   */
  addCustomerResponse(
    reference: string,
    email: string,
    response: TicketResponseDtoIn
  ): Observable<TicketResponseDtoOut> {
    const params = new HttpParams().set('reference', reference).set('email', email);

    return this._httpClient
      .post<TicketResponseDtoOut>(`${this._baseUrl}/response`, response, { params })
      .pipe(
        tap(() => {
          this._snackbarService.showSuccess('Response added successfully');
          // Refresh the current ticket after adding response
          this.getTicketByReference(reference, email).subscribe();
        }),
        catchError(error => {
          console.error('Error adding response:', error);
          this._snackbarService.showFailure('Failed to add response');
          return of(null);
        })
      );
  }

  /**
   * Add ticket attachments
   */
  addTicketAttachments(
    ticketId: number,
    attachments: TicketAttachmentDtoIn[]
  ): Observable<TicketAttachmentDtoIn[]> {
    return this._httpClient
      .post<TicketAttachmentDtoIn[]>(`${this._baseUrl}/${ticketId}/attachments`, attachments)
      .pipe(
        tap(() => {
          this._snackbarService.showSuccess('Attachments added successfully');
        }),
        catchError(error => {
          console.error('Error adding attachments:', error);
          this._snackbarService.showFailure('Failed to add attachments');
          return of([]);
        })
      );
  }

  /**
   * Add response attachments
   */
  addResponseAttachments(
    responseId: number,
    attachments: ResponseAttachmentDtoIn[]
  ): Observable<ResponseAttachmentDtoIn[]> {
    return this._httpClient
      .post<ResponseAttachmentDtoIn[]>(
        `${this._baseUrl}/response/${responseId}/attachments`,
        attachments
      )
      .pipe(
        tap(() => {
          this._snackbarService.showSuccess('Response attachments added successfully');
        }),
        catchError(error => {
          console.error('Error adding response attachments:', error);
          this._snackbarService.showFailure('Failed to add response attachments');
          return of([]);
        })
      );
  }

  // --------------------------------------------------------------------------------
  // Admin-only methods
  // --------------------------------------------------------------------------------

  /**
   * Get all tickets with filtering (admin-only)
   */
  getTickets(filter: TicketListFilter): Observable<PaginatedTicketResponse> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString());

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    if (filter.category) {
      params = params.set('category', filter.category);
    }

    if (filter.searchQuery) {
      params = params.set('searchQuery', filter.searchQuery);
    }

    return this._httpClient.get<PaginatedTicketResponse>(this._baseUrl, { params }).pipe(
      tap(response => {
        this._ticketList.next(response);
      }),
      catchError(error => {
        console.error('Error retrieving tickets:', error);
        this._snackbarService.showFailure('Failed to retrieve tickets');
        return of(null);
      })
    );
  }

  /**
   * Get ticket by ID (admin-only)
   */
  getTicketById(id: number): Observable<SupportTicketDtoOut> {
    return this._httpClient.get<SupportTicketDtoOut>(`${this._baseUrl}/${id}`).pipe(
      tap(response => {
        this._currentTicket.next(response);
      }),
      catchError(error => {
        console.error('Error retrieving ticket by ID:', error);
        this._snackbarService.showFailure('Failed to retrieve ticket');
        return of(null);
      })
    );
  }

  /**
   * Add admin response (admin-only)
   */
  addAdminResponse(
    ticketId: number,
    response: AdminTicketResponseDtoIn
  ): Observable<TicketResponseDtoOut> {
    return this._httpClient
      .post<TicketResponseDtoOut>(`${this._baseUrl}/${ticketId}/admin-response`, response)
      .pipe(
        tap(() => {
          this._snackbarService.showSuccess('Admin response added successfully');
          // Refresh the current ticket after adding response
          this.getTicketById(ticketId).subscribe();
        }),
        catchError(error => {
          console.error('Error adding admin response:', error);
          this._snackbarService.showFailure('Failed to add admin response');
          return of(null);
        })
      );
  }

  /**
   * Update ticket status (admin-only)
   */
  updateTicketStatus(ticketId: number, status: TicketStatus): Observable<SupportTicketDtoOut> {
    const params = new HttpParams().set('status', status);

    return this._httpClient
      .patch<SupportTicketDtoOut>(`${this._baseUrl}/${ticketId}/status`, null, { params })
      .pipe(
        tap(response => {
          this._currentTicket.next(response);
          this._snackbarService.showSuccess(`Ticket status updated to ${status}`);
        }),
        catchError(error => {
          console.error('Error updating ticket status:', error);
          this._snackbarService.showFailure('Failed to update ticket status');
          return of(null);
        })
      );
  }

  /**
   * Clear current ticket from state
   */
  clearCurrentTicket(): void {
    this._currentTicket.next(null);
  }
}
