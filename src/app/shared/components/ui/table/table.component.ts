import {
    Component,
    Input,
    AfterViewInit,
    ViewChild,
    OnInit,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgTemplateOutlet } from '@angular/common';
import { Column } from 'app/shared/components/ui/table/table.types';
import { InputComponent } from '../input/input.component';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

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
        TranslocoPipe,
        TranslocoDirective,
    ],
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit {
    @Input() title: string = 'title';
    @Input() columnsToDisplay: Column[];
    columnsToDisplayWithExpand: string[];
    @Input() data: MatTableDataSource<T>;
    @Input() expandableTemplate!: any;

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    expandedElement: T | null;

    headerForm = new FormGroup({
        filter: new FormControl(''),
    });

    ngOnInit() {
        this.columnsToDisplayWithExpand = [
            ...this.columnsToDisplay.map((col) => col.key),
            'expand',
        ];
    }

    // ngAfterViewInit() {
    //     this.data.sort = this.sort;
    // }

    /** Checks whether an element is expanded. */
    isExpanded(element: T) {
        return this.expandedElement === element;
    }

    /** Toggles the expanded state of an element. */
    toggle(element: T) {
        this.expandedElement = this.isExpanded(element) ? null : element;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.data.filter = filterValue.trim().toLowerCase();
    }
}
