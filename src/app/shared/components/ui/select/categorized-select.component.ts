import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { Option } from 'app/shared/components/ui/select/select.types';

@Component({
  selector: 'app-categorized-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, ReactiveFormsModule, NgFor],
  templateUrl: './categorized-select.component.html'
})
export class CategorizedSelectComponent {
  @Input() label!: string;
  @Input() control!: FormControl;

  @Input() options: string[] = [];
  @Input() subOptions: string[] = [];

  @Input() subOptionMap: { [key: string]: string[] } = {};

  @Input() categorySelected: boolean = false;

  @Output() selectionChange = new EventEmitter<any>();

  @Output() reset = new EventEmitter<void>();

  selectedValue: string | null = null;

  onSelectionChange(value: string): void {
    this.selectionChange.emit(value);
  }

  resetSelection(): void {
    this.reset.emit();
  }
}
