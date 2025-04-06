import { Injectable, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Collaboration } from 'app/feature/collaborations/services/collaboration.types';

@Injectable({
  providedIn: 'root'
})
export class CollaborationValidationService {
  @Output() warningChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  validateCollaborationData(collaboration: Collaboration): boolean {
    const requiredFields = [
      'name',
      'requirements',
      'compensationType',
      'startDate',
      'endDate',
      'title',
      'photos',
      'compensationAmountMin',
      'compensationAmountMax',
      'platforms',
      'contentTypes'
    ];

    const isMissingField = requiredFields.some(field => !collaboration[field]);

    this.warningChanged.emit(isMissingField);

    if (isMissingField) {
      console.warn('Niektóre wymagane pola są puste.');

      return false;
    }

    return true;
  }
}
