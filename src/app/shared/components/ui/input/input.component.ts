import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  NgClass,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet
} from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputType, OtherInputType } from 'app/shared/components/ui/input/input.types';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FileInputComponent } from '../file-input/file-input.component';
import { ImageInputComponent } from '../image-input/image-input.component';
import { FileInfo } from 'app/core/services/file/file.types';

/**
 * A versatile input component that supports multiple input types including:
 * - Standard text-based inputs (text, email, password, etc.)
 * - Textareas for multi-line input
 * - Checkboxes for boolean selection
 * - File uploads (via FileInputComponent)
 * - Image uploads (via ImageInputComponent) with support for multiple images
 * - Date pickers with validation
 * - Date range pickers with start/end validation
 *
 * @example
 * <!-- Basic text input -->
 * <app-input type="text" [control]="myFormControl">Label Text</app-input>
 *
 * @example
 * <!-- Multiple image upload -->
 * <app-input type="image" [control]="imagesControl" [multiple]="true">Upload Images</app-input>
 */

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    MatCheckbox,
    NgSwitch,
    NgSwitchDefault,
    NgSwitchCase,
    NgClass,
    MatProgressSpinnerModule,
    MatTooltip,
    NgTemplateOutlet,
    MatDatepickerModule,
    MatNativeDateModule,
    FileInputComponent,
    ImageInputComponent
  ],
  templateUrl: './input.component.html'
})
export class InputComponent implements AfterContentInit {
  /**
   * Additional CSS classes to apply to the input component.
   * @default ''
   */
  @Input() customClass: string = '';

  /**
   * The label text for the input.
   * Can also be provided via content projection as the component's content.
   */
  @Input() label!: string;

  /**
   * The input type which determines the component's rendering and behavior.
   * Supports all standard HTML input types plus additional custom types.
   * @see MatInputType and OtherInputType for allowed values
   * @default 'text'
   */
  @Input() type: MatInputType | OtherInputType = 'text';

  /**
   * The Angular FormControl that manages this input's value and validation state.
   * Required for the component to function.
   */
  @Input() control!: FormControl;

  /**
   * Placeholder text displayed when the input has no value.
   * @default ''
   */
  @Input() placeholder: string = '';

  /**
   * Help text to provide additional context about the input.
   * Displayed as a tooltip when hovering over the help icon.
   * @optional
   */
  @Input() hint?: string;

  /**
   * Icon to display at the start of the input field.
   * Should be a valid icon name from your icon registry.
   * @optional
   */
  @Input() prefixIcon?: string;

  /**
   * The HTML id attribute value for the input element.
   * Automatically generated if not provided.
   * @default A randomly generated id
   */
  @Input() id: string = `input-${Math.random().toString(36).substring(2, 15)}`;

  /**
   * Number of visible rows for textarea inputs.
   * Only applies when type is 'textarea'.
   * @default 3
   */
  @Input() rows: number = 3;

  /**
   * Maximum character length for text inputs.
   * Used for both validation and UI character count.
   * @optional
   */
  @Input() maxLength?: number;

  /**
   * Whether the textarea should automatically adjust its height based on content.
   * Only applies when type is 'textarea'.
   * @default false
   */
  @Input() autosize: boolean = false;

  /**
   * The storage path to use when uploading files.
   * Only applies when type is 'image' or 'file'.
   * @default 'default'
   */
  @Input() storagePath: string = 'default';

  /**
   * Root directory for file storage.
   * Default is 'images' for image type and 'files' for file type.
   */
  @Input() storageRoot?: string;

  /**
   * File types that can be selected for file/image upload.
   * Only applies when type is 'image' or 'file'.
   * @default 'image/*' for image type, '*;/*' for file type
   */
  @Input() acceptedFileTypes: string = '*/*';

  /**
   * Whether the image preview should have rounded corners (false) or be circular (true).
   * Only applies when type is 'image'.
   * @default false
   */
  @Input() rounded: boolean = false;

  /**
   * Whether multiple files can be selected.
   * Only applies when type is 'file' or 'image'.
   * @default false
   */
  @Input() multiple: boolean = false;

  /**
   * The minimum allowable date for date pickers.
   * Only applies when type is 'datepicker' or 'daterange'.
   * @optional
   */
  @Input() minDate?: Date;

  /**
   * The maximum allowable date for date pickers.
   * Only applies when type is 'datepicker' or 'daterange'.
   * @optional
   */
  @Input() maxDate?: Date;

  /**
   * The format to use when displaying dates.
   * Only applies when type is 'datepicker' or 'daterange'.
   * @default 'MM/dd/yyyy'
   */
  @Input() dateFormat: string = 'MM/dd/yyyy';

  /**
   * The form control name for the start date in a parent form group.
   * Only applies when type is 'daterange'.
   * @default 'start'
   */
  @Input() startKey: string = 'start';

  /**
   * The form control name for the end date in a parent form group.
   * Only applies when type is 'daterange'.
   * @default 'end'
   */
  @Input() endKey: string = 'end';

  /**
   * The Angular FormControl for the start date.
   * Required when type is 'daterange'.
   * @optional
   */
  @Input() startControl?: FormControl;

  /**
   * The Angular FormControl for the end date.
   * Required when type is 'daterange'.
   * @optional
   */
  @Input() endControl?: FormControl;

  /**
   * Maximum file size in bytes (5MB)
   * Applies to file and image uploads
   * @default 5MB
   */
  @Input() maxFileSize: number = 5 * 1024 * 1024;

  /**
   * Event emitted when the input value changes.
   * Emitted for all input types when their value is modified.
   */
  @Output() change = new EventEmitter<any>();

  /**
   * Event emitted on keyup events for text-based inputs.
   * Only applies to text-based input types.
   */
  @Output() keyup = new EventEmitter<any>();

  /**
   * Event emitted when an image is successfully uploaded.
   * Now returns an array of FileInfo objects (even for single uploads).
   */
  @Output() imageUploaded = new EventEmitter<FileInfo[]>();

  /**
   * Event emitted when a file is successfully uploaded.
   * Now returns an array of FileInfo objects (even for single uploads).
   */
  @Output() fileUploaded = new EventEmitter<FileInfo[]>();

  /**
   * Event emitted when a file upload fails.
   * The event payload is the error message.
   * Only applies when type is 'file' or 'image'.
   */
  @Output() uploadError = new EventEmitter<string>();

  /**
   * Event emitted when a date is selected or changed.
   * The event payload is the selected Date object or null.
   * Only applies when type is 'datepicker'.
   */
  @Output() dateChange = new EventEmitter<Date | null>();

  /**
   * Event emitted when a date range is selected or changed.
   * The event payload has start and end properties, each containing a Date object or null.
   * Only applies when type is 'daterange'.
   */
  @Output() dateRangeChange = new EventEmitter<{ start: Date | null; end: Date | null }>();

  /**
   * The current input type being used, which may differ from the initial type.
   * For example, a password field may toggle between 'password' and 'text'.
   */
  inputType: string = null;

  /**
   * Creates a new InputComponent
   */
  constructor() {}

  /**
   * Initializes the component after content is initialized.
   * Sets the initial input type and configures accepted file types and default root paths.
   */
  ngAfterContentInit(): void {
    this.inputType = this.type;

    // Set appropriate accepted file types
    if (this.type === 'image' && this.acceptedFileTypes === '*/*') {
      this.acceptedFileTypes = 'image/*';
    }

    // Set default storage roots if not specified
    if (!this.storageRoot) {
      if (this.type === 'image') {
        this.storageRoot = 'images';
      } else if (this.type === 'file') {
        this.storageRoot = 'files';
      }
    }
  }

  /**
   * Determines if the input is required based on its validator.
   * Used to display required indicators (*) next to the label.
   *
   * @returns True if the input is required, false otherwise
   */
  isRequired(): boolean {
    if (this.control?.validator) {
      const validatorFn = this.control.validator({} as any);
      return validatorFn && validatorFn['required'];
    }
    return false;
  }

  /**
   * Handles input events for text-based inputs.
   * Emits the change event if the control is not disabled.
   *
   * @param event The input event
   */
  handleInput(event: Event): void {
    if (!this.control.disabled) {
      this.change.emit();
    }
  }

  /**
   * Handles keyup events for text-based inputs.
   * Emits the keyup event if the control is not disabled.
   *
   * @param event The keyup event
   */
  handleKeyup(event: Event): void {
    if (!this.control.disabled) {
      this.keyup.emit(event);
    }
  }

  /**
   * Handles date selection events from the datepicker.
   * Emits both dateChange and change events if the control is not disabled.
   *
   * @param event The MatDatepickerInputEvent
   */
  handleDateChange(event: any): void {
    if (!this.control.disabled) {
      this.dateChange.emit(event.value);
      this.change.emit();
    }
  }

  /**
   * Handles date selection events from date range pickers.
   * Emits both dateRangeChange and change events if both start and end controls exist.
   */
  handleDateRangeChange(): void {
    if (this.startControl && this.endControl) {
      const startDate = this.startControl.value;
      const endDate = this.endControl.value;
      this.dateRangeChange.emit({ start: startDate, end: endDate });
      this.change.emit();
    }
  }

  /**
   * Toggles the visibility of password text.
   * Switches between 'password' and 'text' input types.
   */
  togglePasswordVisibility(): void {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  /**
   * Generates appropriate error messages based on the control's validation errors.
   * Handles common validation errors like required, email, minlength, etc.
   *
   * @returns A user-friendly error message
   */
  getErrorMessage(): string {
    if (this.control?.hasError('required')) {
      return 'This field is required';
    }
    if (this.control?.hasError('email')) {
      return 'Invalid email format';
    }
    if (this.control?.hasError('minlength')) {
      return `Must be at least ${this.control.errors?.['minlength'].requiredLength} characters`;
    }
    if (this.control?.hasError('maxlength')) {
      return `Cannot exceed ${this.control.errors?.['maxlength'].requiredLength} characters`;
    }
    if (this.control?.hasError('matDatepickerMin')) {
      return `Date cannot be before ${this.minDate?.toLocaleDateString()}`;
    }
    if (this.control?.hasError('matDatepickerMax')) {
      return `Date cannot be after ${this.maxDate?.toLocaleDateString()}`;
    }
    if (this.control?.hasError('matDatepickerParse')) {
      return 'Invalid date format';
    }
    return 'Invalid input';
  }

  /**
   * Generates error messages for the start date control in a date range.
   * Handles date-specific validation errors.
   *
   * @returns A user-friendly error message for start date errors
   */
  getStartDateErrorMessage(): string {
    if (!this.startControl) {
      return '';
    }

    if (this.startControl.hasError('required')) {
      return 'Start date is required';
    }
    if (this.startControl.hasError('matDatepickerMin')) {
      return `Date cannot be before ${this.minDate?.toLocaleDateString()}`;
    }
    if (this.startControl.hasError('matDatepickerMax')) {
      return `Date cannot be after ${this.maxDate?.toLocaleDateString()}`;
    }
    if (this.startControl.hasError('matDatepickerParse')) {
      return 'Invalid date format';
    }
    return 'Invalid start date';
  }

  /**
   * Generates error messages for the end date control in a date range.
   * Handles date-specific validation errors including start/end date relationship.
   *
   * @returns A user-friendly error message for end date errors
   */
  getEndDateErrorMessage(): string {
    if (!this.endControl) {
      return '';
    }

    if (this.endControl.hasError('required')) {
      return 'End date is required';
    }
    if (this.endControl.hasError('matDatepickerMin')) {
      return `Date cannot be before ${this.minDate?.toLocaleDateString()}`;
    }
    if (this.endControl.hasError('matDatepickerMax')) {
      return `Date cannot be after ${this.maxDate?.toLocaleDateString()}`;
    }
    if (this.endControl.hasError('matStartEnd')) {
      return 'End date must be after start date';
    }
    if (this.endControl.hasError('matDatepickerParse')) {
      return 'Invalid date format';
    }
    return 'Invalid end date';
  }

  /**
   * Handler for the fileUploaded event from FileInputComponent
   * Re-emits the event to parent components
   */
  onFileUploaded(fileInfos: FileInfo[]): void {
    this.fileUploaded.emit(fileInfos);
    this.change.emit();
  }

  /**
   * Handler for the imageUploaded event from ImageInputComponent
   * Re-emits the event to parent components
   */
  onImageUploaded(fileInfos: FileInfo[]): void {
    this.imageUploaded.emit(fileInfos);
    this.change.emit();
  }

  /**
   * Handler for the uploadError event from FileInputComponent or ImageInputComponent
   * Re-emits the error to parent components
   */
  onUploadError(error: string): void {
    this.uploadError.emit(error);
  }
}
