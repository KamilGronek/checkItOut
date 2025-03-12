import {
    AfterContentInit,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
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
    NgSwitchDefault, NgTemplateOutlet,
} from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import {
    MatInputType,
    OtherInputType,
} from 'app/shared/components/ui/input/input.types';
import { ImageService } from 'app/core/services/image/image.service'; // Update with correct path
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTooltip} from "@angular/material/tooltip";

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
    ],
    templateUrl: './input.component.html',
})
export class InputComponent implements AfterContentInit {
    @Input() customClass: string = '';
    @Input() label!: string;
    @Input() type: MatInputType | OtherInputType = 'text';
    @Input() control!: FormControl;
    @Input() placeholder: string = '';
    @Input() hint?: string;
    @Input() prefixIcon?: string;
    @Input() id: string = `input-${Math.random()
        .toString(36)
        .substring(2, 15)}`;

    // Textarea specific inputs
    @Input() rows: number = 3;
    @Input() maxLength?: number;
    @Input() autosize: boolean = false;

    // Image specific inputs
    @Input() storagePath: string = 'default'; // Default path for storing images
    @Input() acceptedFileTypes: string = 'image/*'; // Default to all image types

    @Output() change = new EventEmitter<any>();
    @Output() keyup = new EventEmitter<any>();
    @Output() imageUploaded = new EventEmitter<string>(); // New event for image upload
    @Output() uploadError = new EventEmitter<string>(); // New event for upload errors

    inputType: string = null; // Track input type dynamically
    selectedFile: File | null = null;
    isUploading: boolean = false;
    previewUrl: string | null = null;

    constructor(private imageService: ImageService) {}

    ngAfterContentInit(): void {
        this.inputType = this.type;

        // Check if we already have an image URL in the control value
        if (this.type === 'image' && this.control?.value && typeof this.control.value === 'string' && this.control.value.trim() !== '') {
            // If we have a URL but no preview, it means we're initializing with an existing image URL
            if (!this.previewUrl && (this.control.value.startsWith('http') || this.control.value.startsWith('blob'))) {
                // No need to create a preview, the control.value will be used directly
            }
        }
    }

    isRequired(): boolean {
        if (this.control.validator) {
            const validatorFn = this.control.validator({} as any);
            return validatorFn && validatorFn['required'];
        }
        return false;
    }

    handleInput(event: Event): void {
        if (!this.control.disabled) {
            this.change.emit();
        }
    }

    handleKeyup(event: Event): void {
        if (!this.control.disabled) {
            this.keyup.emit(event);
        }
    }

    togglePasswordVisibility(): void {
        this.inputType = this.inputType === 'password' ? 'text' : 'password';
    }

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
        if (this.control?.hasError('invalidFileType')) {
            return 'Invalid file type. Please select an image.';
        }
        if (this.control?.hasError('fileTooLarge')) {
           return 'File is too large. Maximum size is 5MB.';
        }
        return 'Invalid input';
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];

            // Check if file is an image
            if (!this.selectedFile.type.startsWith('image/')) {
                this.control.setErrors({ invalidFileType: true });
                this.selectedFile = null;
                return;
            }

            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
             if (this.selectedFile.size > maxSizeInBytes) {
                this.control.setErrors({ fileTooLarge: true });
                this.selectedFile = null;
                return;
            }

            // Create preview URL
            this.createImagePreview();

            // Update form control value with the file name (we'll replace with URL after upload)
            this.control.setValue(this.selectedFile.name);
            this.change.emit();
        }
    }

    createImagePreview(): void {
        if (!this.selectedFile) {
            return;
        }

        // Revoke previous URL to prevent memory leaks
        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
        }

        this.previewUrl = URL.createObjectURL(this.selectedFile);
    }

    async uploadImage(): Promise<void> {
        if (!this.selectedFile || this.isUploading) {
            return;
        }

        this.isUploading = true;

        try {
            const downloadUrl = await this.imageService.uploadImage(this.selectedFile, this.storagePath);

            // Update form control with the download URL
            this.control.setValue(downloadUrl);
            this.imageUploaded.emit(downloadUrl);

            // Clean up temporary preview
            if (this.previewUrl) {
                URL.revokeObjectURL(this.previewUrl);
                this.previewUrl = null;
            }

            // Reset selected file after successful upload since we now have the URL
            this.selectedFile = null;

        } catch (error) {
            console.error('Upload failed:', error);
            this.uploadError.emit(error.message || 'Upload failed');
        } finally {
            this.isUploading = false;
        }
    }

    removeImage(): void {
        // First, reset the selected file
        this.selectedFile = null;

        // Clean up any preview URL
        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
            this.previewUrl = null;
        }

        // Finally, clear the form control value
        this.control.setValue('');
        this.control.markAsPristine();
        this.control.markAsUntouched();
        this.change.emit();
    }
}
