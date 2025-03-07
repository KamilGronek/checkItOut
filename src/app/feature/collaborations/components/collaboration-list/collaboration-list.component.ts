import {CommonModule} from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {Router} from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import {MatDialog, MatDialogModule,} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import {FuseConfirmationService} from '@fuse/services/confirmation';
import {NgApexchartsModule} from 'ng-apexcharts';
import {Subject} from 'rxjs';
import {InfluencerService} from 'app/feature/influencers/services/influencer.service';

import {FormsModule, ReactiveFormsModule, UntypedFormBuilder,} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CollaborationService} from 'app/feature/collaborations/services/collaboration.service';
import {Collaboration, CollaborationResponse} from 'app/feature/collaborations/services/collaboration.types';

import {MatSelectModule} from '@angular/material/select';
import {MatPaginator, MatPaginatorModule, PageEvent,} from '@angular/material/paginator';
import {TranslocoModule} from '@ngneat/transloco';
import {FuseCardComponent} from "../../../../../@fuse/components/card";
import {LinkComponent} from "../../../../shared/components/ui/link/link.component";
import {CardComponent} from "../../../../shared/components/ui/card/card.component";

@Component({
    selector: 'collaboration-list',
    standalone: true,
    templateUrl: './collaboration-list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatDividerModule,
        NgApexchartsModule,
        MatTableModule,
        MatSortModule,
        MatProgressBarModule,
        MatSelectModule,
        MatPaginatorModule,
        TranslocoModule,
        FuseCardComponent,
        LinkComponent,
        CardComponent,
    ],
    styleUrl: 'collaboration-list.styles.css',
})
export class CollaborationsListComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('textItem') textInput: ElementRef;

    @ViewChild('selectItem')
    influencersTableMatSort: MatSort;
    data: any;
    influencersDataSource: MatTableDataSource<any> = new MatTableDataSource();

    // expandedInfluencer: Collaboration | null;
    expandedInfluencer = null;

    formLaunched: boolean = false;
    editformLaunched: boolean = false;
    idOfEditedUser: number;
    flashMessage: 'success' | 'error' | null = null;

    dataSource: MatTableDataSource<Collaboration>;
    res = '';

    collaborationList: Collaboration[];
    blobImgCollaboration = [];
    collaborationUser: Collaboration;
    InfluencerResponse: { Collaboration: any };

    isLoading = true;
    error: string | null = null;

    fieldOptions: string[] = ['Nazwa', 'Miasto', 'Szukaj'];
    selectedFilter: string = 'Nazwa';

    length = 100;
    pageSize = 20;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 20, 50];

    sortBy: string = 'id';
    direction: string = 'asc';
    instagramAccountType: string = '';

    name: string = '';
    city: string = '';
    details: string = '';
    title: string = '';

    disabled = false;
    showFirstLastButtons = true;
    showPageSizeOptions = true;
    hidePageSize = false;

    isTextInput: boolean = true;
    isSelectInput: boolean = false;
    searchOptions: string[];
    selectInput: any;
    typeStatus: string[];

    typeAccountOptions: string[];
    searchValue: string = '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _influencerService: InfluencerService,
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private router: Router,
        private _collaborationService: CollaborationService,
        private _cdRef: ChangeDetectorRef
    ) {
    }

    ngAfterViewInit(): void {
        if (this.dataSource) this.dataSource.paginator = this.paginator;

        this.dataSource = new MatTableDataSource<Collaboration>(
            this.collaborationList
        );
    }

    ngOnInit(): void {
        this.loadCollaboration(this.pageIndex);

        console.log(this.collaborationList);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    readonly dialog = inject(MatDialog);

    private async loadCollaboration(pageIndex: number): Promise<void> {
        this._collaborationService
            .getCollaborationPaged(
                pageIndex,
                this.pageSize,
                this.sortBy,
                this.direction,
                this.name,
                this.city,
                this.details,
                this.title
            )
            .subscribe({
                next: (response: CollaborationResponse) => {
                    console.log(response);
                    this.length = response.page.totalElements;
                    this.pageIndex = response.page.number;
                    this.paginator.length = response.page.totalElements;
                    this.paginator.pageIndex = response.page.number;
                    this.paginator.pageSize = response.page.size;

                    this.collaborationList = response.content;

                    this.blobImgCollaboration = this.collaborationList.map(
                        (collaboration) => {
                            const blob = new Blob([collaboration.imageUrl], {
                                type: 'image/jpeg',
                            });
                            return URL.createObjectURL(blob);
                        }
                    );

                    console.log(this.blobImgCollaboration);
                },
                error: (error) => {
                    console.error('Error fetching influencer list', error);
                },
            });
    }

    pageSizeChanged(previousPageSize: number, newPageSize: number): boolean {
        return previousPageSize != newPageSize;
    }

    handlePageSizeChange(e: PageEvent): void {
        this.pageIndex = 0;
        this.pageSize = e.pageSize;

        this.loadCollaboration(0);
    }

    handlePageNavigationChange(e: PageEvent): void {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;

        this.loadCollaboration(e.pageIndex);
    }

    handlePageEvent(e: PageEvent) {
        if (this.pageSizeChanged(this.pageSize, e.pageSize)) {
            this.handlePageSizeChange(e);
        } else {
            this.handlePageNavigationChange(e);
        }
    }

    onSearchInputChange(searchInputValue: string) {
        this.searchValue = searchInputValue;

        this.setSearchFiltersToEmptyStrings();
        this.setValueOfSelectedFilter(this.searchValue);
        this.loadCollaboration(0);
    }

    private setSearchFiltersToEmptyStrings() {
        this.name = '';
        this.city = '';
        this.details = '';
        this.title = '';
    }

    onSearchSelectChange(event: any): void {
        this.selectedFilter = event.value;

        console.log(this.selectedFilter);

        if (['Nazwa', 'Miasto', 'Szukaj'].includes(this.selectedFilter)) {
            this.isTextInput = true;
            this.isSelectInput = false;
            setTimeout(() => {
                this.textInput.nativeElement.focus();
            }, 0);
        }

        this.onSearchInputChange('');
    }

    private setValueOfSelectedFilter(valueOfSelectedFilter: string) {
        switch (this.selectedFilter) {
            case 'Nazwa':
                this.name = valueOfSelectedFilter;
                break;
            case 'Miasto':
                this.city = valueOfSelectedFilter;
                break;
            case 'Szukaj':
                this.title = valueOfSelectedFilter;
                // this.details = valueOfSelectedFilter;
                break;
        }
    }

    getExpandedInfluencer(): Collaboration {
        return this.expandedInfluencer;
    }
}
