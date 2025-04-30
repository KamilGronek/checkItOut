import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { FuseAlertComponent } from '@fuse/components/alert';
import { TranslocoPipe } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { SupportTicketService } from 'app/feature/support/services/tickets/support-ticket.service';
import {
  ResponseAttachmentDtoIn,
  SupportTicketDtoOut,
  TicketAttachmentDtoIn,
  TicketResponseDtoIn,
  TicketResponseDtoOut,
  TicketStatus
} from 'app/feature/support/services/tickets/support-tickets.types';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { CardComponent } from 'app/shared/components/ui/card/card.component';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { FileInfo } from 'app/core/services/file/file.types';
import { FileService } from 'app/core/services/file/file.service';
import { generateAttachmentDirectory } from 'app/core/utilities/file.utils';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ticket-status',
  templateUrl: './ticket-status.component.html',
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
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
    FuseAlertComponent,
    TranslocoPipe,
    ButtonComponent,
    CardComponent,
    RouterLink,
    MatButtonModule,
    InputComponent
  ]
})
export class TicketStatusComponent implements OnInit, OnDestroy {
  ticket: SupportTicketDtoOut | null = null;
  lookupForm: FormGroup;
  responseForm: FormGroup;

  private ticketResponseAttachmentPath: string;
  uploadedAttachments: TicketAttachmentDtoIn[] = [];

  isLoading = false;
  isSubmitting = false;
  showLookupForm = true;
  showError = false;
  errorMessage = '';

  selectedFiles: File[] = [];
  uploadingFiles = false;

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _supportTicketService: SupportTicketService,
    private _fileService: FileService
  ) {
    // Initialize lookup form
    this.lookupForm = this._formBuilder.group({
      reference: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    // Initialize response form
    this.responseForm = this._formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(5000)]],
      attachments: [[]] // Add control for attachments
    });
  }

  ngOnInit(): void {
    // Check if reference and email are provided in query params
    this.ticketResponseAttachmentPath = `tickets/responses/attachments/${generateAttachmentDirectory(
      'response'
    )}`;

    this._route.queryParams.subscribe(params => {
      const reference = params['ref'];
      const email = params['email'];

      if (reference && email) {
        this.lookupForm.patchValue({ reference, email });
        this.lookupTicket();
      }
    });

    // Subscribe to current ticket
    this._supportTicketService.currentTicket$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(ticket => {
        this.ticket = ticket;
        if (ticket) {
          this.showLookupForm = false;
        }
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Lookup ticket using reference and email
   */
  lookupTicket(): void {
    if (this.lookupForm.invalid) {
      this.lookupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.showError = false;

    const { reference, email } = this.lookupForm.value;

    this._supportTicketService
      .getTicketByReference(reference, email)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.isLoading = false;

        if (!response) {
          this.showError = true;
          this.errorMessage = 'Ticket not found. Please check your reference number and email.';
        } else {
          // Update URL with reference and email for easier sharing/bookmarking
          this._router.navigate([], {
            relativeTo: this._route,
            queryParams: { ref: reference, email: email },
            queryParamsHandling: 'merge'
          });
        }
      });
  }

  onResponseFilesUploaded(fileInfos: FileInfo[]): void {
    // Store the uploaded file information to use after response creation
    this.uploadedAttachments = fileInfos.map(fileInfo => ({
      fileName: fileInfo.fileName,
      contentType: fileInfo.contentType,
      fileUrl: fileInfo.fileUrl,
      fileSize: fileInfo.fileSize
    }));

    console.log('Response files uploaded:', this.uploadedAttachments);
  }

  /**
   * Add customer response to ticket
   */
  submitResponse(): void {
    if (this.responseForm.invalid || !this.ticket) {
      this.responseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showError = false;

    const response: TicketResponseDtoIn = {
      content: this.responseForm.get('content').value
    };

    this._supportTicketService
      .addCustomerResponse(this.ticket.ticketReference, this.ticket.contactEmail, response)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(responseResult => {
        if (responseResult) {
          // Reset form after successful submission
          this.responseForm.reset({
            content: '',
            attachments: []
          });

          // Handle the previously uploaded files
          if (this.uploadedAttachments.length > 0 && responseResult.id) {
            this._supportTicketService
              .addResponseAttachments(responseResult.id, this.uploadedAttachments)
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe();
          }

          this.uploadedAttachments = []; // Clear the uploaded files
          this.isSubmitting = false;
        } else {
          this.isSubmitting = false;
          this.showError = true;
          this.errorMessage = 'Failed to submit response. Please try again.';
        }
      });
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

  getAttachmentIcon(mimeType: string): string {
    return this._fileService.getFileIcon(mimeType);
  }

  getFormattedFileSize(size: number): string {
    return this._fileService.getFormattedFileSize(size);
  }

  /**
   * Check if the ticket is closed or resolved
   */
  isTicketClosed(): boolean {
    return (
      this.ticket?.status === TicketStatus.CLOSED || this.ticket?.status === TicketStatus.RESOLVED
    );
  }

  /**
   * Go back to lookup form
   */
  backToLookup(): void {
    this.showLookupForm = true;
    this._supportTicketService.clearCurrentTicket();

    // Clear URL params
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {},
      replaceUrl: true
    });
  }
}
