import { Component } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { CardComponent } from './card/card.component';
import { InputComponent } from './input/input.component';
import { FormControl, Validators } from '@angular/forms';
import { LinkComponent } from './link/link.component';
import { SelectComponent } from './select/select.component';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from './table/table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
import { FileInfo } from 'app/core/services/file/file.types';

@Component({
  selector: 'app-component-samples',
  standalone: true,
  imports: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    LinkComponent,
    SelectComponent,
    TableComponent,
    MatFormFieldModule,
    DatePipe
  ],
  templateUrl: './component-samples.component.html'
})
export class ComponentSamplesComponent {
  // Form controls for input examples
  imageControl = new FormControl<FileInfo | null>(null, [Validators.required]);
  multipleImagesControl = new FormControl<FileInfo[]>([], [Validators.required]);

  // File inputs
  fileControl = new FormControl<FileInfo | null>(null, [Validators.required]);
  multipleFilesControl = new FormControl<FileInfo[]>([], [Validators.required]);

  // Dates
  minDate = new Date(2023, 0, 1);
  maxDate = new Date(2025, 11, 31);
  dateControl = new FormControl(null, [Validators.required]);
  startDateControl = new FormControl(null, Validators.required);
  endDateControl = new FormControl(null, Validators.required);

  textAreaControl = new FormControl('', [Validators.required]);
  textControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  searchControl = new FormControl('');
  checkboxControl = new FormControl(false);

  // Card click event handler
  handleCardClick(): void {
    alert('Card clicked');
  }

  onImageUpload(): void {
    const fileInfo = this.imageControl.value;
    if (fileInfo) {
      alert(`Image uploaded: ${fileInfo.fileName} (${fileInfo.fileSize} bytes)`);
      console.log('Image file info:', fileInfo);
    }
  }

  onMultipleImagesUpload(fileInfos: FileInfo[]): void {
    alert(`${fileInfos.length} images uploaded successfully`);
    console.log('Uploaded image files:', fileInfos);

    // Display file details
    fileInfos.forEach(file => {
      console.log(`- ${file.fileName} (${file.contentType}): ${file.fileUrl}`);
    });
  }

  onFileUpload(): void {
    const fileInfo = this.fileControl.value;
    if (fileInfo) {
      alert(`File uploaded: ${fileInfo.fileName} (${fileInfo.fileSize} bytes)`);
      console.log('File info:', fileInfo);
    }
  }

  onMultipleFilesUpload(fileInfos: FileInfo[]): void {
    alert(`${fileInfos.length} files uploaded successfully`);
    console.log('Uploaded files:', fileInfos);

    // Display file details
    fileInfos.forEach(file => {
      console.log(`- ${file.fileName} (${file.contentType}): ${file.fileUrl}`);
    });
  }

  /**
   * Format a file size in bytes to a human-readable string
   */
  formatFileSize(bytes: number): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Form control for select example
  selectControl = new FormControl('');
  selectControlSelected = new FormControl('option2');

  // Options for the select component
  selectOptions: { label: string; value: string }[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' }
  ];

  // Sample data for table
  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'position', label: 'Position' },
    { key: 'weight', label: 'Weight' },
    { key: 'symbol', label: 'Symbol' }
  ];

  tableData = new MatTableDataSource([
    {
      position: 1,
      name: 'Hydrogen',
      weight: 1.0079,
      symbol: 'H',
      description: 'Hydrogen is the lightest element.'
    },
    {
      position: 2,
      name: 'Helium',
      weight: 4.0026,
      symbol: 'He',
      description: 'Helium is a noble gas.'
    },
    {
      position: 3,
      name: 'Lithium',
      weight: 6.941,
      symbol: 'Li',
      description: 'Lithium is a soft, silvery-white alkali metal.'
    },
    {
      position: 4,
      name: 'Beryllium',
      weight: 9.0122,
      symbol: 'Be',
      description: 'Beryllium is a relatively rare element.'
    },
    {
      position: 5,
      name: 'Boron',
      weight: 10.811,
      symbol: 'B',
      description: 'Boron is a metalloid.'
    }
  ]);
}
