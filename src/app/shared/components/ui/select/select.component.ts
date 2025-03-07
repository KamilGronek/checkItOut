import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { Option } from 'app/shared/components/ui/select/select.types';

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        ReactiveFormsModule,
        NgFor,
    ],
    templateUrl: './select.component.html',
})
export class SelectComponent {
    @Input() label: string = 'Select an option';
    @Input() options: Option[] = [];
    @Input() control!: FormControl;
    @Output() selectionChange = new EventEmitter<any>();
}
