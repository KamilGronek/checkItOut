/**
 * @fileoverview Angular component that provides a reusable and customizable data table with expandable rows.
 * Built on Angular Material's mat-table with added functionality for filtering, sorting, and expandable row details.
 */

import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgTemplateOutlet } from '@angular/common';
import { Column } from 'app/shared/components/ui/table/table.types';
import { InputComponent } from '../input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@ngneat/transloco';
import { Output, EventEmitter } from '@angular/core';

/**
 * A flexible table component that extends Angular Material's table with additional features like
 * expandable rows, built-in search filtering, and translation support.
 *
 * The component is generic and can work with any data type provided through the type parameter T.
 *
 * @example
 * // Basic usage with required inputs
 * <app-table
 *   [columnsToDisplay]="[
 *     { key: 'name', label: 'Name' },
 *     { key: 'email', label: 'Email' }
 *   ]"
 *   [data]="myDataSource"
 *   [expandableTemplate]="expandedRowTemplate">
 * </app-table>
 *
 * <ng-template #expandedRowTemplate let-element>
 *   <div>
 *     <p>Additional details for: {{element.name}}</p>
 *     <!-- More details here -->
 *   </div>
 * </ng-template>
 *
 * @example
 * // With custom title
 * <app-table
 *   title="User Management"
 *   [columnsToDisplay]="columns"
 *   [data]="usersDataSource"
 *   [expandableTemplate]="userDetailsTemplate">
 * </app-table>
 *
 * @template T The type of data displayed in the table rows
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    InputComponent,
    ReactiveFormsModule,
    NgTemplateOutlet,
    TranslocoPipe
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnInit {
  /**
   * The title displayed at the top of the table.
   * @default 'title'
   */
  @Input() title: string = 'title';

  /**
   * Columns configuration defining what data to display and column headers.
   * Each column should have a key (corresponding to a property in the data) and a label.
   * Labels are automatically translated using the Transloco pipe.
   * @required
   */
  @Input() columnsToDisplay: Column[];

  /**
   * Internal array that includes both data columns and the expand column.
   * This is calculated automatically during initialization.
   * @internal
   */
  columnsToDisplayWithExpand: string[];

  /**
   * The data source for the table.
   * Should be an instance of MatTableDataSource containing the items to display.
   * @required
   */
  @Input() data: MatTableDataSource<T>;

  /**
   * Template reference for the expandable content.
   * This template will be rendered inside the expanded row section.
   * The template context will include the row's data element as the implicit variable.
   * @required
   */
  @Input() expandableTemplate!: any;

  /**
   * Reference to the MatSort directive for enabling sorting functionality.
   */
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Reference to the MatPaginator directive for enabling pagination.
   * Note: Pagination is currently not implemented in the template.
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Event emitted when a row is toggled (e.g. expanded or collapsed).
   * The generic type `T` represents the type of the row's data.
   */
  @Output() rowToggled = new EventEmitter<T>();

  /**
   * Tracks the currently expanded element.
   * Only one row can be expanded at a time.
   */
  expandedElement: T | null;

  /**
   * Form group for the header controls like the search filter.
   */
  headerForm = new FormGroup({
    filter: new FormControl('')
  });

  /**
   * Initializes the component, particularly setting up the columns display array
   * that includes both data columns and the expand column.
   */
  ngOnInit() {
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay.map(col => col.key), 'expand'];
  }

  /**
   * Checks whether a specific element is currently expanded.
   *
   * @param {T} element - The row data element to check
   * @returns {boolean} True if the element is expanded, false otherwise
   */

  isExpanded(element: T) {
    return this.expandedElement === element;
  }

  /**
   * Toggles the expanded state of an element.
   * If the element is already expanded, it will be collapsed.
   * If another element is currently expanded, it will be collapsed and the new element expanded.
   *
   * @param {T} element - The row data element to toggle
   */

  toggle(element: T) {
    this.expandedElement = this.isExpanded(element) ? null : element;
    this.rowToggled.emit(element);
  }

  /**
   * Applies a filter to the table data based on user input.
   * The filter is case-insensitive and trims whitespace.
   *
   * @param {Event} event - The keyboard event from the filter input
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
  }
}
