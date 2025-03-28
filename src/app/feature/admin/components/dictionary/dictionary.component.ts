import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, MatSortHeader } from "@angular/material/sort";

import {
    DictionaryEntry,
    DictionaryService, NewDictionaryEntry,
    NewDictionaryEntryForm
} from "app/feature/admin/services/dictionary/dictionary.service";
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";
import { toSignal } from '@angular/core/rxjs-interop';
import {InputComponent} from "../../../../shared/components/ui/input/input.component";
import {SelectComponent} from "../../../../shared/components/ui/select/select.component";
import {Option} from "../../../../shared/components/ui/select/select.types";

@Component({
    selector: 'app-dictionary',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatDialogModule,
        MatButtonModule,
        MatSnackBarModule,
        MatSort,
        MatSortHeader,
        ButtonComponent,
        InputComponent,
        SelectComponent
    ],
    templateUrl: './dictionary.component.html',
})
export class DictionaryComponent implements OnInit {
    // Use signals for reactive state management
    categories = signal<Option[]>([]);
    entries = signal<DictionaryEntry[]>([]);
    selectedCategory = new FormControl<string>("all");
    filteredEntries = signal<DictionaryEntry[]>([]);

    // Define columns to be displayed in the table
    displayedColumns: string[] = ['key', 'value', 'languageCode', 'category', 'actions'];

    // Form for creating new entry
    createEntryForm: FormGroup<NewDictionaryEntryForm>;

    constructor(
        private dictionaryService: DictionaryService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        // Initialize the form
        this.createEntryForm = this.formBuilder.group({
            key: ['', Validators.required],
            value: ['', Validators.required],
            languageCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
            category: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.loadCategories();
        this.loadEntries();
    }

    filterEntries(){
        if(this.selectedCategory.value === "all"){
            this.filteredEntries.set(this.entries());
            return;
        }
        let entriesFount = this.entries().filter(entry => entry.category === this.selectedCategory.value);
        this.filteredEntries.set(entriesFount);
    }

    loadCategories() {
        this.dictionaryService.getCategories().subscribe({
            next: (categories) => {
                this.categories.set(
                    categories.map((category) => {
                        return {label: category, value: category};
                    })
                )
                this.categories.update(categories => [...categories, { label: "all", value: "all" }]);
            },
            error: (err) => {
                this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
            }
        });
    }

    loadEntries() {
        this.dictionaryService.getAllEntries().subscribe({
            next: (entries) => {
                this.entries.set(entries);
                this.filteredEntries.set(entries);
            },
            error: (err) => {
                this.snackBar.open('Failed to load entries', 'Close', { duration: 3000 });
            }
        });
    }

    onSubmitNewEntry() {
        if (this.createEntryForm.valid) {
            const newEntry: NewDictionaryEntry = this.createEntryForm.value;

            this.dictionaryService.createEntry(newEntry).subscribe({
                next: (createdEntry) => {
                    // Update entries signal by adding the new entry
                    this.entries.update(entries => [...entries, createdEntry]);
                    this.loadCategories();
                    this.loadEntries();

                    // Show success message
                    this.snackBar.open('Entry created successfully', 'Close', { duration: 3000 });
                },
                error: (err) => {
                    // Show error message
                    this.snackBar.open('Failed to create entry', 'Close', { duration: 3000 });
                }
            });
        }
    }

    onDeleteEntry(id: string) {
        this.dictionaryService.deleteEntry(id).subscribe({
            next: () => {
                // Update entries signal by filtering out the deleted entry
                this.entries.update(entries => entries.filter(entry => entry.id !== id));
                this.loadCategories();
                this.loadEntries();

                // Show success message
                this.snackBar.open('Entry deleted successfully', 'Close', { duration: 3000 });
            },
            error: (err) => {
                // Show error message
                this.snackBar.open('Failed to delete entry', 'Close', { duration: 3000 });
            }
        });
    }
}
