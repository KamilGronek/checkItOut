import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { FuseAlertComponent } from '@fuse/components/alert';
import { TranslocoPipe } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { SupportTicketService } from 'app/feature/support/services/tickets/support-ticket.service';
import {
  AdminTicketResponseDtoIn,
  ResponseAttachmentDtoIn,
  SupportTicketDtoOut,
  TicketAttachmentDtoIn,
  TicketStatus
} from 'app/feature/support/services/tickets/support-tickets.types';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { CardComponent } from 'app/shared/components/ui/card/card.component';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { Option } from 'app/shared/components/ui/select/select.types';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { UserService } from 'app/feature/users/services/user.service';
import { FileInfo } from 'app/core/services/file/file.types';
import { FileService } from 'app/core/services/file/file.service';
import { generateAttachmentDirectory } from 'app/core/utilities/file.utils';

@Component({
  selector: 'app-admin-ticket-detail',
  templateUrl: './admin-ticket-detail.component.html',
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
    MatMenuModule,
    FuseAlertComponent,
    TranslocoPipe,
    ButtonComponent,
    CardComponent,
    InputComponent,
    SelectComponent
  ]
})
export class AdminTicketDetailComponent implements OnInit, OnDestroy {
  ticket: SupportTicketDtoOut | null = null;
  responseForm: FormGroup;
  updateStatusForm: FormGroup;

  private ticketResponseAttachmentPath: string;
  uploadedAttachments: TicketAttachmentDtoIn[] = [];

  isLoading = false;
  isSubmitting = false;
  showError = false;
  errorMessage = '';

  statusOptions: Option[] = [];
  currentUserName: string = 'Support Agent';

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _supportTicketService: SupportTicketService,
    private _snackbarService: SnackbarService,
    private _userService: UserService,
    private _fileService: FileService
  ) {
    // Initialize response form
    this.responseForm = this._formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(5000)]],
      newStatus: [null],
      sendEmail: [true],
      attachments: [[]] // Add control for attachments
    });

    // Initialize status update form
    this.updateStatusForm = this._formBuilder.group({
      status: ['', Validators.required]
    });

    // Get status options for select
    this.statusOptions = this._supportTicketService
      .getTicketStatuses()
      .map(status => ({ label: status.label, value: status.value }));
  }

  ngOnInit(): void {
    // Get ticket ID from route
    this.ticketResponseAttachmentPath = `tickets/responses/attachments/${generateAttachmentDirectory(
      'response'
    )}`;

    this._route.paramMap.subscribe(params => {
      const ticketId = Number(params.get('id'));

      if (ticketId) {
        this.loadTicket(ticketId);
      } else {
        this._router.navigate(['/support/admin/tickets']);
      }
    });

    // Subscribe to current ticket
    this._supportTicketService.currentTicket$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(ticket => {
        this.ticket = ticket;
        this.isLoading = false;
      });

    // Get current user for responses
    const currentUser = this._userService.getCurrentUser();
    if (currentUser) {
      this.currentUserName = `${currentUser.firstName} ${currentUser.lastName}`;
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Load ticket by ID
   */
  loadTicket(id: number): void {
    this.isLoading = true;
    this.showError = false;

    this._supportTicketService
      .getTicketById(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        if (!response) {
          this.showError = true;
          this.errorMessage = 'Ticket not found. It may have been deleted.';
          this.isLoading = false;
        }
      });
  }

  onResponseFilesUploaded(fileInfos: FileInfo[]): void {
    // Store the uploaded file information to use after admin response creation
    this.uploadedAttachments = fileInfos.map(fileInfo => ({
      fileName: fileInfo.fileName,
      contentType: fileInfo.contentType,
      fileUrl: fileInfo.fileUrl,
      fileSize: fileInfo.fileSize
    }));

    console.log('Admin response files uploaded:', this.uploadedAttachments);
  }

  /**
   * Add admin response
   */
  submitResponse(): void {
    if (this.responseForm.invalid || !this.ticket) {
      this.responseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showError = false;

    const formValue = this.responseForm.value;

    const response: AdminTicketResponseDtoIn = {
      content: formValue.content,
      newStatus: formValue.newStatus,
      adminName: this.currentUserName,
      sendEmail: formValue.sendEmail
    };

    this._supportTicketService
      .addAdminResponse(this.ticket.id, response)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(responseResult => {
        if (responseResult) {
          // Reset form after successful submission
          this.responseForm.reset({
            content: '',
            newStatus: null,
            sendEmail: true,
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
   * Update ticket status
   */
  updateStatus(status: TicketStatus): void {
    if (!this.ticket) {
      return;
    }

    this._supportTicketService
      .updateTicketStatus(this.ticket.id, status)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  /**
   * Get formatted file size
   */
  getFormattedFileSize(size: number): string {
    return this._fileService.getFormattedFileSize(size);
  }

  /**
   * Get file icon based on type
   */
  getFileIcon(mimeType: string): string {
    return this._fileService.getFileIcon(mimeType);
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
   * Go back to tickets list
   */
  goBack(): void {
    this._router.navigate(['/support/admin/tickets']);
  }
}
