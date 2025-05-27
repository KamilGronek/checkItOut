import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslocoPipe } from '@ngneat/transloco';
import { SupportTicketService } from 'app/feature/support/services/tickets/support-ticket.service';
import { ContactFormData } from 'app/feature/support/services/tickets/support-tickets.types';

@Component({
  selector: 'app-contact-form-modal',
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      *ngIf="isOpen"
      (click)="onBackdropClick($event)"
    >
      <div
        class="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative"
        [ngClass]="{ 'animate-bounce': isSubmitting }"
      >
        <!-- Close button -->
        <button
          (click)="closeModal()"
          class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Header -->
        <div class="mb-6">
          <h3 class="text-2xl font-bold text-slate-800 mb-2">
            {{ 'landing.contact.modal.title' | transloco }}
          </h3>
          <p class="text-slate-600">
            {{ 'landing.contact.modal.description' | transloco }}
          </p>
        </div>

        <!-- Success state -->
        <div *ngIf="isSuccess" class="text-center py-8">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h4 class="text-xl font-semibold text-slate-800 mb-2">
            {{ 'landing.contact.modal.success.title' | transloco }}
          </h4>
          <p class="text-slate-600 mb-6">
            {{ 'landing.contact.modal.success.message' | transloco }}
          </p>
          <button
            (click)="closeModal()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            {{ 'landing.contact.modal.success.close' | transloco }}
          </button>
        </div>

        <!-- Form -->
        <form *ngIf="!isSuccess" [formGroup]="contactForm" (ngSubmit)="onSubmit()">
          <!-- User Type Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ 'landing.contact.modal.userType.label' | transloco }}
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                class="p-3 rounded-lg border-2 transition-all duration-300 text-left"
                [ngClass]="{
                  'border-blue-600 bg-blue-50 text-blue-700': selectedUserType === 'company',
                  'border-slate-200 hover:border-slate-300': selectedUserType !== 'company'
                }"
                (click)="selectUserType('company')"
              >
                <div class="font-semibold">
                  {{ 'landing.contact.modal.userType.company' | transloco }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ 'landing.contact.modal.userType.companyDesc' | transloco }}
                </div>
              </button>
              <button
                type="button"
                class="p-3 rounded-lg border-2 transition-all duration-300 text-left"
                [ngClass]="{
                  'border-blue-600 bg-blue-50 text-blue-700': selectedUserType === 'influencer',
                  'border-slate-200 hover:border-slate-300': selectedUserType !== 'influencer'
                }"
                (click)="selectUserType('influencer')"
              >
                <div class="font-semibold">
                  {{ 'landing.contact.modal.userType.influencer' | transloco }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ 'landing.contact.modal.userType.influencerDesc' | transloco }}
                </div>
              </button>
            </div>
          </div>

          <!-- Name field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{
                selectedUserType === 'company'
                  ? ('landing.contact.modal.companyName' | transloco)
                  : ('landing.contact.modal.nickname' | transloco)
              }}
            </label>
            <input
              type="text"
              formControlName="name"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
              [placeholder]="
                selectedUserType === 'company'
                  ? ('landing.contact.modal.companyNamePlaceholder' | transloco)
                  : ('landing.contact.modal.nicknamePlaceholder' | transloco)
              "
            />
            <div
              *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched"
              class="text-red-600 text-sm mt-1"
            >
              {{ 'landing.contact.modal.validation.nameRequired' | transloco }}
            </div>
          </div>

          <!-- Email field -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ 'landing.contact.modal.email' | transloco }}
            </label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
              [placeholder]="'landing.contact.modal.emailPlaceholder' | transloco"
            />
            <div
              *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched"
              class="text-red-600 text-sm mt-1"
            >
              <span *ngIf="contactForm.get('email')?.errors?.['required']">
                {{ 'landing.contact.modal.validation.emailRequired' | transloco }}
              </span>
              <span *ngIf="contactForm.get('email')?.errors?.['email']">
                {{ 'landing.contact.modal.validation.emailInvalid' | transloco }}
              </span>
            </div>
          </div>

          <!-- Submit button -->
          <div class="flex gap-3">
            <button
              type="button"
              (click)="closeModal()"
              class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            >
              {{ 'landing.contact.modal.cancel' | transloco }}
            </button>
            <button
              type="submit"
              [disabled]="contactForm.invalid || isSubmitting"
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            >
              <span *ngIf="!isSubmitting">{{ 'landing.contact.modal.submit' | transloco }}</span>
              <span *ngIf="isSubmitting">{{ 'landing.contact.modal.submitting' | transloco }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  imports: [CommonModule, ReactiveFormsModule, TranslocoPipe],
  standalone: true
})
export class ContactFormModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);
  private supportTicketService = inject(SupportTicketService);

  contactForm: FormGroup;
  selectedUserType: 'company' | 'influencer' = 'company';
  isSubmitting = false;
  isSuccess = false;

  constructor() {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  selectUserType(type: 'company' | 'influencer'): void {
    this.selectedUserType = type;
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const contactData: ContactFormData = {
        name: this.contactForm.get('name')?.value,
        email: this.contactForm.get('email')?.value,
        userType: this.selectedUserType
      };

      this.supportTicketService.submitContactForm(contactData).subscribe({
        next: response => {
          if (response) {
            this.isSuccess = true;
          }
          this.isSubmitting = false;
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  closeModal(): void {
    this.isOpen = false;
    this.isSuccess = false;
    this.isSubmitting = false;
    this.contactForm.reset();
    this.selectedUserType = 'company';
    this.closeEvent.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
