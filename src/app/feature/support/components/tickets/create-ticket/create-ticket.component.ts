import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { SupportTicketService } from 'app/feature/support/services/tickets/support-ticket.service';
import {
  TicketCategory,
  SupportTicketDtoIn,
  TicketAttachmentDtoIn
} from 'app/feature/support/services/tickets/support-tickets.types';
import { Subject, finalize, forkJoin, of, takeUntil } from 'rxjs';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { CardComponent } from 'app/shared/components/ui/card/card.component';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { Option } from 'app/shared/components/ui/select/select.types';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LinkComponent } from '../../../../../shared/components/ui/link/link.component';
import { MatButtonModule } from '@angular/material/button';
import { FileInfo } from 'app/core/services/file/file.types';
import { generateAttachmentDirectory } from 'app/core/utilities/file.utils';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    ReactiveFormsModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    TranslocoPipe,
    FuseAlertComponent,
    ButtonComponent,
    CardComponent,
    InputComponent,
    SelectComponent,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    LinkComponent
  ]
})
export class CreateTicketComponent implements OnInit, OnDestroy {
  ticketForm: FormGroup;
  private ticketAttachmentPath: string;

  isSubmitting = false;
  ticketCreated = false;
  showError = false;
  errorMessage = '';

  uploadedAttachments: TicketAttachmentDtoIn[] = [];

  ticketReference: string = null;
  ticketCategories: Option[] = [];

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _supportTicketService: SupportTicketService,
    private _snackbarService: SnackbarService
  ) {
    // Get ticket categories for select dropdown
    this.ticketCategories = this._supportTicketService
      .getTicketCategories()
      .map(cat => ({ label: cat.label, value: cat.value }));

    // Initialize the form
    this.ticketForm = this._formBuilder.group({
      contactEmail: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(5000)]],
      category: [this.ticketCategories[0].value, Validators.required],
      attachments: [[]] // Add a form control for attachments
    });
  }

  ngOnInit(): void {
    // Reset state
    this._supportTicketService.clearCurrentTicket();
    this.ticketAttachmentPath = `tickets/attachments/${generateAttachmentDirectory('ticket')}`;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onFilesUploaded(fileInfos: FileInfo[]): void {
    // Store the uploaded file information to use after ticket creation
    this.uploadedAttachments = fileInfos.map(fileInfo => ({
      fileName: fileInfo.fileName,
      contentType: fileInfo.contentType,
      fileUrl: fileInfo.fileUrl,
      fileSize: fileInfo.fileSize
    }));

    // Log the uploaded files information
    console.log('Files uploaded:', this.uploadedAttachments);
  }

  /**
   * Submit the ticket form
   */
  submitTicket(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showError = false;

    // First, create the ticket
    const ticketData: SupportTicketDtoIn = {
      contactEmail: this.ticketForm.get('contactEmail').value,
      subject: this.ticketForm.get('subject').value,
      description: this.ticketForm.get('description').value,
      category: this.ticketForm.get('category').value
    };

    this._supportTicketService
      .createTicket(ticketData)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          if (!this.ticketCreated) {
            this.isSubmitting = false;
          }
        })
      )
      .subscribe(response => {
        if (response) {
          this.ticketCreated = true;
          this.ticketReference = response.ticketReference;

          // Now handle the previously uploaded files
          if (this.uploadedAttachments.length > 0) {
            this._supportTicketService
              .addTicketAttachments(response.id, this.uploadedAttachments)
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe();
          }
        } else {
          this.showError = true;
          this.errorMessage = 'Failed to create ticket. Please try again.';
        }
      });
  }

  /**
   * Navigate to ticket status page
   */
  goToTicketStatus(): void {
    if (this.ticketReference) {
      const email = this.ticketForm.get('contactEmail').value;
      this._router.navigate(['/support/tickets/status'], {
        queryParams: { ref: this.ticketReference, email: email }
      });
    }
  }

  /**
   * Start over with a new ticket
   */
  createNewTicket(): void {
    this.ticketForm.reset();
    this.uploadedAttachments = [];
    this.ticketCreated = false;
    this.ticketReference = null;
    this.showError = false;
  }
}
