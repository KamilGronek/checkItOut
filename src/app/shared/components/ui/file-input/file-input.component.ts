import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  selector: 'app-file-input',
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
  templateUrl: './file-input.component.html'
})
export class FileInputComponent {
  /**
   * The label for the input field
   */
  @Input() label: string;

  /**
   * FormControl to bind the input value
   */
  @Input() control!: FormControl;

  /**
   * Whether multiple files can be selected
   */
  @Input() multiple: boolean = false;

  /**
   * Accepted file types (MIME types or extensions)
   */
  @Input() acceptedFileTypes: string = '*/*';

  /**
   * Maximum allowed file size in bytes (default: 5MB)
   */
  @Input() maxFileSize: number = 5 * 1024 * 1024;

  /**
   * Path where files will be stored
   */
  @Input() storagePath: string = 'default';

  /**
   * Root directory for storage (defaults to 'files')
   */
  @Input() storageRoot: string = 'files';

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
  @Input() id: string = `file-input-${Math.random().toString(36).substring(2, 15)}`;

  /**
   * Event emitted when file(s) are uploaded
   * Now always returns FileInfo[] array
   */
  @Output() fileUploaded = new EventEmitter<FileInfo[]>();

  /**
   * Event emitted when an error occurs
   */
  @Output() uploadError = new EventEmitter<string>();

  /**
   * Currently selected file (single mode)
   */
  selectedFile: File | null = null;

  /**
   * Currently selected files (multiple mode)
   */
  selectedFiles: File[] = [];

  /**
   * Whether the entire component is in uploading state
   */
  isUploading: boolean = false;

  /**
   * Track which files are currently being uploaded
   */
  uploadingFiles: Set<string> = new Set();

  /**
   * Track uploaded files with their full FileInfo objects
   */
  uploadedFiles: Map<string, FileInfo> = new Map();

  /**
   * Preview URLs for image files
   */
  previewUrls: { [fileName: string]: string } = {};

  constructor(public fileService: FileService, private snackbarService: SnackbarService) {}

  /**
   * Handles file selection from the input element
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      if (this.multiple) {
        this.handleMultipleFileSelection(input.files);
      } else {
        this.handleSingleFileSelection(input.files[0]);
      }
    }
  }

  /**
   * Processes a single file selection
   */
  private handleSingleFileSelection(file: File): void {
    // Clear previous selections
    this.revokeAllPreviews();
    this.selectedFiles = [];
    this.selectedFile = file;

    // Check if file type is acceptable
    if (!this.isAcceptedFileType(file)) {
      this.control.setErrors({ invalidFileType: true });
      this.selectedFile = null;
      return;
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      this.control.setErrors({ fileTooLarge: true });
      this.selectedFile = null;
      return;
    }

    // Create preview if it's an image
    if (file.type.startsWith('image/')) {
      this.createPreview(file);
    }

    // Update control with filename temporarily
    this.control.setValue(file.name);
    this.control.markAsDirty();

    // Automatically start upload
    this.uploadSingleFile();
  }

  /**
   * Processes multiple file selection
   */
  private handleMultipleFileSelection(fileList: FileList): void {
    // Keep existing files if any
    const currentFiles = [...this.selectedFiles];

    // Add new files
    const newFiles = Array.from(fileList);
    const validFiles: File[] = [];
    const fileNames: string[] = [];

    for (const file of newFiles) {
      // Check if file type is acceptable
      if (!this.isAcceptedFileType(file)) {
        continue;
      }

      // Check file size
      if (file.size > this.maxFileSize) {
        continue;
      }

      // Add to valid files
      validFiles.push(file);
      fileNames.push(file.name);

      // Create preview if it's an image
      if (file.type.startsWith('image/')) {
        this.createPreview(file);
      }
    }

    if (validFiles.length === 0) {
      this.snackbarService.showFailure('No valid files selected');
      return;
    }

    // Combine existing and new files
    this.selectedFiles = [...currentFiles, ...validFiles];

    // Update control value
    const currentValue = this.control.value || [];
    const newValue = Array.isArray(currentValue) ? [...currentValue, ...fileNames] : fileNames;

    this.control.setValue(newValue);
    this.control.markAsDirty();

    // Automatically start uploading the new files
    this.uploadNewFiles(validFiles);
  }

  /**
   * Upload new files in multiple mode
   */
  private async uploadNewFiles(files: File[]): Promise<void> {
    // Start uploading each file in parallel
    const uploadPromises = files.map(file => this.uploadFileWithTracking(file));

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
  }

  /**
   * Upload a single file with tracking of its upload state
   */
  private async uploadFileWithTracking(file: File): Promise<void> {
    // Mark this file as uploading
    this.uploadingFiles.add(file.name);

    try {
      const fileInfo = await this.fileService.uploadFileWithInfo(
        file,
        this.storagePath,
        this.storageRoot
      );

      // Store the FileInfo
      this.uploadedFiles.set(file.name, fileInfo);

      // Update the form control with array of FileInfo objects
      this.updateControlValueWithFileInfo();

      // Emit all files or just this one, depending on what we're doing
      if (this.multiple) {
        // Emit all uploaded files
        this.fileUploaded.emit(Array.from(this.uploadedFiles.values()));
      } else {
        // Emit just this file in an array
        this.fileUploaded.emit([fileInfo]);
      }
    } catch (error) {
      console.error(`Upload failed for ${file.name}:`, error);
      this.snackbarService.showFailure(`Failed to upload ${file.name}`);
      this.uploadError.emit(error.message || 'Upload failed');
    } finally {
      // Remove from uploading state
      this.uploadingFiles.delete(file.name);
    }
  }

  /**
   * Update the control value with FileInfo objects
   */
  private updateControlValueWithFileInfo(): void {
    if (this.multiple) {
      // For multiple mode, store array of FileInfo objects
      const allFileInfos = Array.from(this.uploadedFiles.values());
      this.control.setValue(allFileInfos);
    } else {
      // For single mode, get the latest file's FileInfo
      const lastFileInfo = Array.from(this.uploadedFiles.values()).pop();
      if (lastFileInfo) {
        this.control.setValue(lastFileInfo);
      }
    }
  }

  /**
   * Checks if a specific file is currently being uploaded
   */
  isUploadingFile(file: File): boolean {
    return this.uploadingFiles.has(file.name);
  }

  /**
   * Checks if a file's type is acceptable
   */
  private isAcceptedFileType(file: File): boolean {
    if (this.acceptedFileTypes === '*/*') {
      return true;
    }

    const acceptedTypes = this.acceptedFileTypes.split(',');
    const fileType = file.type;

    return acceptedTypes.some(type => {
      type = type.trim();

      // Handle wildcards like "image/*"
      if (type.includes('*')) {
        const [category, extension] = type.split('/');

        if (extension === '*') {
          return fileType.startsWith(`${category}/`);
        } else if (category === '*') {
          return fileType.endsWith(`/${extension}`);
        }
        return false;
      }

      // Handle extensions like ".pdf"
      if (type.startsWith('.')) {
        const extension = type.substring(1).toLowerCase();
        return file.name.toLowerCase().endsWith(`.${extension}`);
      }

      // Exact MIME type match
      return fileType === type;
    });
  }

  /**
   * Creates a preview URL for an image file
   */
  createPreview(file: File): void {
    if (!file) return;

    // Revoke previous URL if it exists
    if (this.previewUrls[file.name]) {
      URL.revokeObjectURL(this.previewUrls[file.name]);
    }

    this.previewUrls[file.name] = URL.createObjectURL(file);
  }

  /**
   * Releases all preview URLs
   */
  revokeAllPreviews(): void {
    for (const fileName in this.previewUrls) {
      URL.revokeObjectURL(this.previewUrls[fileName]);
    }
    this.previewUrls = {};
  }

  /**
   * Uploads the selected file(s)
   */
  async uploadFiles(): Promise<void> {
    if (this.isUploading) return;

    this.isUploading = true;

    try {
      if (this.multiple && this.selectedFiles.length > 0) {
        await this.uploadMultipleFiles();
      } else if (this.selectedFile) {
        await this.uploadSingleFile();
      }
    } finally {
      this.isUploading = false;
    }
  }

  /**
   * Uploads a single file
   */
  private async uploadSingleFile(): Promise<void> {
    if (!this.selectedFile) return;

    // Set global uploading state
    this.isUploading = true;

    try {
      // Track this specific file as uploading
      this.uploadingFiles.add(this.selectedFile.name);

      const fileInfo = await this.fileService.uploadFileWithInfo(
        this.selectedFile,
        this.storagePath,
        this.storageRoot
      );

      // Store the file info
      this.uploadedFiles.set(this.selectedFile.name, fileInfo);

      // Update control with the FileInfo
      this.control.setValue(fileInfo);

      // Always emit an array of FileInfo objects
      this.fileUploaded.emit([fileInfo]);

      this.snackbarService.showSuccess('File uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      this.snackbarService.showFailure('File upload failed');
      this.uploadError.emit(error.message || 'Upload failed');
    } finally {
      this.uploadingFiles.delete(this.selectedFile.name);
      this.isUploading = false;
    }
  }

  /**
   * Uploads multiple files
   */
  private async uploadMultipleFiles(): Promise<void> {
    if (this.selectedFiles.length === 0) return;

    // Set global uploading state
    this.isUploading = true;

    const uploadedFileInfos: FileInfo[] = [];
    const uploadPromises = this.selectedFiles.map(async file => {
      // Skip already uploaded files
      if (this.uploadedFiles.has(file.name)) {
        uploadedFileInfos.push(this.uploadedFiles.get(file.name));
        return;
      }

      this.uploadingFiles.add(file.name);

      try {
        const fileInfo = await this.fileService.uploadFileWithInfo(
          file,
          this.storagePath,
          this.storageRoot
        );

        uploadedFileInfos.push(fileInfo);
        this.uploadedFiles.set(file.name, fileInfo);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      } finally {
        this.uploadingFiles.delete(file.name);
      }
    });

    await Promise.all(uploadPromises);

    // Update the control with all FileInfo objects
    if (uploadedFileInfos.length > 0) {
      this.control.setValue(uploadedFileInfos);
      this.fileUploaded.emit(uploadedFileInfos);
      this.snackbarService.showSuccess('Files uploaded successfully');
    }

    this.isUploading = false;
  }

  /**
   * Removes a file from the selection
   */
  removeFile(fileToRemove?: File, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.multiple && this.selectedFiles.length > 0) {
      if (fileToRemove) {
        // Don't allow removing a file that's currently uploading
        if (this.isUploadingFile(fileToRemove)) {
          return;
        }

        // Remove the file from selected files
        this.selectedFiles = this.selectedFiles.filter(file => file !== fileToRemove);

        // Clean up preview
        if (this.previewUrls[fileToRemove.name]) {
          URL.revokeObjectURL(this.previewUrls[fileToRemove.name]);
          delete this.previewUrls[fileToRemove.name];
        }

        // Remove from uploaded files map
        this.uploadedFiles.delete(fileToRemove.name);

        // Update control value with current FileInfo array
        const remainingFileInfos = Array.from(this.uploadedFiles.values());
        this.control.setValue(remainingFileInfos.length > 0 ? remainingFileInfos : []);
      } else {
        // Remove all files that aren't currently uploading
        const filesBeingUploaded = this.selectedFiles.filter(file => this.isUploadingFile(file));
        this.selectedFiles = filesBeingUploaded;

        // Clean up previews for removed files
        for (const fileName in this.previewUrls) {
          if (!filesBeingUploaded.some(f => f.name === fileName)) {
            URL.revokeObjectURL(this.previewUrls[fileName]);
            delete this.previewUrls[fileName];
          }
        }

        // Clear uploaded files map, except for files being uploaded
        this.uploadedFiles.forEach((value, key) => {
          if (!filesBeingUploaded.some(f => f.name === key)) {
            this.uploadedFiles.delete(key);
          }
        });

        // Update control value
        const remainingFileInfos = Array.from(this.uploadedFiles.values());
        this.control.setValue(remainingFileInfos.length > 0 ? remainingFileInfos : []);
      }
    } else {
      // Single file mode
      if (this.selectedFile && !this.isUploading) {
        if (this.previewUrls[this.selectedFile.name]) {
          URL.revokeObjectURL(this.previewUrls[this.selectedFile.name]);
          delete this.previewUrls[this.selectedFile.name];
        }

        // Clear the uploaded file info
        this.uploadedFiles.delete(this.selectedFile.name);

        this.selectedFile = null;
        this.control.setValue(null);
      }
    }
  }

  /**
   * Gets an appropriate icon for a file based on its type
   */
  getFileIcon(file: File): string {
    return this.fileService.getFileIcon(file.type);
  }

  /**
   * Formats a file size for display
   */
  getFormattedFileSize(file: File): string {
    return this.fileService.getFormattedFileSize(file.size);
  }

  /**
   * Checks if a URL is an image URL
   */
  isImageUrl(url: string): boolean {
    if (!url) return false;

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  }
}
