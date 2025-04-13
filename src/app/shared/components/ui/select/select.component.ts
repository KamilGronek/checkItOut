/**
 * @fileoverview Angular component that provides a reusable select input wrapped around Angular Material's mat-select.
 * This component simplifies the implementation of select dropdowns while maintaining form integration.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { Option } from 'app/shared/components/ui/select/select.types';

/**
 * A wrapper component for Material's mat-select that simplifies the creation of select dropdowns.
 * Integrates with Angular's Reactive Forms and provides a clean API for common select functionality.
 *
 * @example
 * // Basic usage with form control
 * <app-select
 *   [control]="myFormControl"
 *   [options]="[
 *     { label: 'Option 1', value: 1 },
 *     { label: 'Option 2', value: 2 }
 *   ]">
 * </app-select>
 *
 * @example
 * // With custom label and selection change event
 * <app-select
 *   label="Select a country"
 *   [control]="countryControl"
 *   [options]="countries"
 *   (selectionChange)="onCountrySelected($event)">
 * </app-select>
 */
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, ReactiveFormsModule, NgFor],
  templateUrl: './select.component.html'
})
export class SelectComponent {
  /**
   * The label displayed above the select input.
   * @default 'Select an option'
   */
  @Input() label: string = null;

  /**
   * Array of options to display in the dropdown.
   * Each option should have a label (displayed text) and value (form value).
   * @default []
   */
  @Input() options: Option[] = [];

  /**
   * Form control for the select input.
   * This allows the select to integrate with Angular Reactive Forms.
   * @required
   */
  @Input() control!: FormControl;

  /**
   * Event emitted when the selection changes.
   * Emits the selected value (not the entire option object).
   */
  @Output() selectionChange = new EventEmitter<any>();
}
