import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CollaborationFormService {
  constructor(private fb: FormBuilder) {}

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      details: ['', [Validators.required]],
      title: ['', [Validators.required]],
      photos: ['', [Validators.required]],
      requirements: ['', [Validators.required]],
      compensationType: ['', [Validators.required]],
      compensationAmountMin: ['', [Validators.required]],
      compensationAmountMax: ['', [Validators.required]],
      company: ['', [Validators.required]],
      platforms: ['', [Validators.required]],
      contentTypes: ['', [Validators.required]],
      serviceType: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }
}
