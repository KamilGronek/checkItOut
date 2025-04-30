import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { FileService } from 'app/core/services/file/file.service';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { FileInfo } from 'app/core/services/file/file.types';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgClass,
    NgTemplateOutlet,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './image-input.component.html'
})
export class ImageInputComponent implements OnInit {
  /**
   * The label for the input field
   */
  @Input() label: string;

  /**
   * FormControl to bind the input value
   */
  @Input() control!: FormControl;

  /**
   * Whether the image should be displayed as a circle
   */
  @Input() rounded: boolean = false;

  /**
   * Whether multiple images can be selected
   */
  @Input() multiple: boolean = false;

  /**
   * Accepted image types
   */
  @Input() acceptedFileTypes: string = 'image/*';

  /**
   * Maximum allowed file size in bytes (default: 5MB)
   */
  @Input() maxFileSize: number = 5 * 1024 * 1024;

  /**
   * Path where images will be stored
   */
  @Input() storagePath: string = 'default';

  /**
   * Root directory for storage (defaults to 'images')
   */
  @Input() storageRoot: string = 'images';

  /**
   * Fit mode for images (contain or cover)
   */
  @Input() objectFit: 'contain' | 'cover' = 'contain';

  /**
   * Height for the single image container
   */
  @Input() imageHeight: string = '12rem'; // Set a default of 12rem (192px)

  /**
   * Hint text displayed below the input
   */
  @Input() hint?: string;

  /**
   * Additional CSS classes
   */
  @Input() customClass: string = '';

  /**
   * Unique ID for the input element
   */
  @Input() id: string = `image-input-${Math.random().toString(36).substring(2, 15)}`;

  /**
   * Event emitted when an image is uploaded
   * Always returns an array of FileInfo objects
   */
  @Output() imageUploaded = new EventEmitter<FileInfo[]>();

  /**
   * Event emitted when an error occurs
   */
  @Output() uploadError = new EventEmitter<string>();

  /**
   * Currently selected image files
   */
  selectedFiles: File[] = [];

  /**
   * Track which files are currently being uploaded
   */
  uploadingFiles: Set<string> = new Set();

  /**
   * Track uploaded files with their full FileInfo objects
   */
  uploadedFiles: Map<string, FileInfo> = new Map();

  /**
   * Preview URLs for images
   */
  previewUrls: Map<string, string> = new Map();

  constructor(public fileService: FileService, private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    // Initialize from existing control value
    this.initFromControlValue();

    // Subscribe to future control value changes
    this.control.valueChanges.subscribe(value => {
      // Only handle external value changes, not ones we trigger ourselves
      if (this.uploadedFiles.size === 0 || !this.hasMatchingUrls(value)) {
        this.initFromControlValue();
      }
    });
  }

  /**
   * Check if the current value matches our uploaded files
   */
  private hasMatchingUrls(value: any): boolean {
    if (!value) return false;

    // Handle single file case
    if (!this.multiple && value.fileUrl) {
      // Check if the URL is in our uploadedFiles map
      for (const fileInfo of this.uploadedFiles.values()) {
        if (fileInfo.fileUrl === value.fileUrl) {
          return true;
        }
      }
      return false;
    }

    // Handle multiple files case
    if (this.multiple && Array.isArray(value)) {
      if (value.length !== this.uploadedFiles.size) return false;

      // Check if all URLs match
      const ourUrls = new Set(Array.from(this.uploadedFiles.values()).map(info => info.fileUrl));
      for (const item of value) {
        if (item.fileUrl && !ourUrls.has(item.fileUrl)) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  /**
   * Initialize component state from existing control value
   */
  private initFromControlValue(): void {
    // Clear existing state
    this.selectedFiles = [];
    this.uploadedFiles.clear();
    for (const url of this.previewUrls.values()) {
      URL.revokeObjectURL(url);
    }
    this.previewUrls.clear();

    const value = this.control.value;
    if (!value) return;

    // Handle single file case
    if (!this.multiple && value.fileUrl) {
      const fileInfo: FileInfo = {
        fileName: value.fileName || `file-${Date.now()}`,
        fileUrl: value.fileUrl,
        thumbnailUrl: value.thumbnailUrl || value.fileUrl,
        contentType: value.contentType || 'image/jpeg',
        fileSize: value.fileSize || 0,
        uploadedAt: value.uploadedAt || Date.now()
      };

      this.uploadedFiles.set(fileInfo.fileName, fileInfo);
      // Create a dummy File object for UI purposes
      this.selectedFiles.push(new File([], fileInfo.fileName, { type: fileInfo.contentType }));
    }

    // Handle multiple files case
    if (this.multiple && Array.isArray(value)) {
      for (const item of value) {
        if (item.fileUrl) {
          const fileInfo: FileInfo = {
            fileName:
              item.fileName || `file-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
            fileUrl: item.fileUrl,
            thumbnailUrl: item.thumbnailUrl || item.fileUrl,
            contentType: item.contentType || 'image/jpeg',
            fileSize: item.fileSize || 0,
            uploadedAt: item.uploadedAt || Date.now()
          };

          this.uploadedFiles.set(fileInfo.fileName, fileInfo);
          // Create a dummy File object for UI purposes
          this.selectedFiles.push(new File([], fileInfo.fileName, { type: fileInfo.contentType }));
        }
      }
    }
  }

  /**
   * Handles file selection from the input element
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      if (this.multiple) {
        this.handleMultipleImageSelection(input.files);
      } else {
        this.handleSingleImageSelection(input.files[0]);
      }

      // Reset the input value to allow selecting the same file again
      input.value = '';
    }
  }

  /**
   * Processes single image file selection
   */
  private handleSingleImageSelection(file: File): void {
    // Clear previous selections if in single mode
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(oldFile => {
        // Don't remove files that are currently uploading
        if (!this.uploadingFiles.has(oldFile.name)) {
          this.revokePreviewUrl(oldFile.name);
        }
      });

      // Filter out any files that aren't currently uploading
      this.selectedFiles = this.selectedFiles.filter(f => this.uploadingFiles.has(f.name));
    }

    // Validate file is an image
    if (!this.isValidImageFile(file)) {
      this.snackbarService.showFailure('Please select a valid image file');
      return;
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      this.snackbarService.showFailure(
        `File size exceeds maximum of ${this.fileService.getFormattedFileSize(this.maxFileSize)}`
      );
      return;
    }

    // Add to selected files
    this.selectedFiles.push(file);

    // Create preview
    this.createPreviewUrl(file);

    // Upload immediately
    this.uploadFile(file);
  }

  /**
   * Processes multiple image file selection
   */
  private handleMultipleImageSelection(fileList: FileList): void {
    const newFiles: File[] = [];

    // Process new files
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Validate file is an image
      if (!this.isValidImageFile(file)) {
        continue;
      }

      // Check file size
      if (file.size > this.maxFileSize) {
        continue;
      }

      // Add to new files array
      newFiles.push(file);

      // Add to selected files
      this.selectedFiles.push(file);

      // Create preview
      this.createPreviewUrl(file);
    }

    if (newFiles.length === 0) {
      this.snackbarService.showFailure('No valid image files were selected');
      return;
    }

    // Upload new files immediately
    newFiles.forEach(file => this.uploadFile(file));
  }

  /**
   * Check if a file is a valid image
   */
  private isValidImageFile(file: File): boolean {
    // Basic check if the file is an image
    if (!file.type.startsWith('image/')) {
      this.control.setErrors({ invalidFileType: true });
      return false;
    }

    // If acceptedFileTypes is specified and not the default
    if (this.acceptedFileTypes !== 'image/*') {
      const acceptedTypes = this.acceptedFileTypes.split(',').map(type => type.trim());

      // Check if file type matches any of the accepted types
      const isAccepted = acceptedTypes.some(type => {
        if (type === 'image/*') return file.type.startsWith('image/');
        if (type.startsWith('.')) {
          // Check file extension
          const extension = type.substring(1).toLowerCase();
          return file.name.toLowerCase().endsWith(`.${extension}`);
        }
        return file.type === type;
      });

      if (!isAccepted) {
        this.control.setErrors({ invalidFileType: true });
        return false;
      }
    }

    return true;
  }

  /**
   * Creates a preview URL for a file
   */
  private createPreviewUrl(file: File): void {
    // Revoke previous URL if it exists
    this.revokePreviewUrl(file.name);

    // Create new preview URL
    const previewUrl = URL.createObjectURL(file);
    this.previewUrls.set(file.name, previewUrl);
  }

  /**
   * Revokes a preview URL to prevent memory leaks
   */
  private revokePreviewUrl(fileName: string): void {
    const url = this.previewUrls.get(fileName);
    if (url) {
      URL.revokeObjectURL(url);
      this.previewUrls.delete(fileName);
    }
  }

  /**
   * Upload a file with progress tracking
   */
  private async uploadFile(file: File): Promise<void> {
    // Mark as uploading
    this.uploadingFiles.add(file.name);

    try {
      // Create FileInfo object by uploading file and getting URL
      const fileInfo: FileInfo = {
        fileName: file.name,
        contentType: file.type,
        fileUrl: '', // Will be filled by uploadFileWithInfo
        fileSize: file.size,
        uploadedAt: Date.now()
      };

      // Upload and get the URL
      const uploadedFileInfo = await this.fileService.uploadFileWithInfo(
        file,
        this.storagePath,
        this.storageRoot
      );

      // Update FileInfo with the uploaded file URL
      fileInfo.fileUrl = uploadedFileInfo.fileUrl;

      // Generate a thumbnail URL for the image
      // For simplicity, we just use the same URL, but in a real application
      // you might want to generate an actual thumbnail
      fileInfo.thumbnailUrl = uploadedFileInfo.fileUrl;

      // Save URL
      this.uploadedFiles.set(file.name, fileInfo);

      // Update the form control
      this.updateFormControlValue();

      // Emit the event
      if (this.multiple) {
        const fileInfos = Array.from(this.uploadedFiles.values());
        this.imageUploaded.emit(fileInfos);
      } else {
        this.imageUploaded.emit([fileInfo]);
      }
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      this.snackbarService.showFailure(`Failed to upload "${file.name}"`);
      this.uploadError.emit(error.message || 'Upload failed');

      // Remove the file from the selection
      this.removeFile(file.name);
    } finally {
      // Mark as no longer uploading
      this.uploadingFiles.delete(file.name);
    }
  }

  /**
   * Update the form control value with uploaded URLs
   */
  private updateFormControlValue(): void {
    if (this.multiple) {
      // Get all uploaded file infos
      const fileInfos = Array.from(this.uploadedFiles.values());
      this.control.setValue(fileInfos.length > 0 ? fileInfos : null);
    } else {
      // Get the file info of the most recently uploaded file
      const fileInfos = Array.from(this.uploadedFiles.values());
      if (fileInfos.length > 0) {
        // Use the last uploaded file (most recent)
        this.control.setValue(fileInfos[fileInfos.length - 1]);
      } else {
        this.control.setValue(null);
      }
    }
  }

  /**
   * Check if a file is currently uploading
   */
  isFileUploading(fileName: string): boolean {
    return this.uploadingFiles.has(fileName);
  }

  /**
   * Get URL for a file (either preview or uploaded)
   */
  getFileUrl(fileName: string): string {
    // First check if we have an uploaded URL
    const fileInfo = this.uploadedFiles.get(fileName);
    if (fileInfo && fileInfo.fileUrl) return fileInfo.fileUrl;

    // Fall back to preview URL
    return this.previewUrls.get(fileName) || '';
  }

  /**
   * Removes a file
   */
  removeFile(fileName: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    // Don't allow removing files that are currently uploading
    if (this.isFileUploading(fileName)) {
      return;
    }

    // Find the file in the selected files
    const fileIndex = this.selectedFiles.findIndex(file => file.name === fileName);
    if (fileIndex !== -1) {
      // Remove from selected files
      this.selectedFiles.splice(fileIndex, 1);
    }

    // Revoke preview URL
    this.revokePreviewUrl(fileName);

    // Remove from uploaded files
    this.uploadedFiles.delete(fileName);

    // Update the form control
    this.updateFormControlValue();
  }

  /**
   * Add more images button handler
   */
  openFileSelector(): void {
    // Find the file input element and trigger click
    const fileInput = document.getElementById(this.id) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
