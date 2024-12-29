import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Influencer } from 'app/services/influencer/Influencer';
import { InfluencerResponse } from 'app/services/influencer/Influencer';
import { MatSelect } from '@angular/material/select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';

import { InfluencerService } from 'app/services/influencer/influencer.service';

import {
    FormGroup,
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'newInfluencers',
    standalone: true,
    templateUrl: './newInfluencers-list.component.html',
    styleUrl: './newInfluencers-list.styles.css',
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
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
        DatePipe,
        MatSelectModule,
        MatPaginatorModule,
    ],
})
export class newInfluencersListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('influencersTable', { read: MatSort })
    influencersTableMatSort: MatSort;
    @ViewChild('textItem')
    textInput: ElementRef;
    @ViewChild('selectItem')
    selectInput: any;
    data: any;

    influencersTableColumns: string[] = [
        'id',
        'lastUpdateTime',
        'firstName',
        'lastName',
        'email',
        'city',
        'instagramId',
        'followersAmount',
        'instagramAccountType',
        'accountStatus',
    ];
    columnsToDisplayWithExpand: string[] = [
        ...this.influencersTableColumns,
        'expand',
    ];
    expandedInfluencer: Influencer | null;

    formLaunched: boolean = false;
    editformLaunched: boolean = false;
    idOfEditedUser: number;
    flashMessage: 'success' | 'error' | null = null;

    editInfluencerFormGroup: UntypedFormGroup;

    influencerList: Influencer[] = [];
    InfluencerResponse: { Influencer: any };
    dataSource: MatTableDataSource<Influencer>;

    resInput: any;
    form: FormGroup;
    selectedProduct: Influencer | null = null;
    isLoading: boolean = false;
    updatedNoteInfo: boolean = false;
    instagramAccountTypeInfo: boolean = false;
    confrimEditionInfo: boolean = false;
    ascDescInfo: boolean = false;

    sortDirection: string = 'asc';

    myControl = new FormControl('');
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    categories: Influencer[];

    selectedSortOption = 'default';

    fieldOptions: string[] = ['Imię', 'Nazwisko', 'Status', 'Rodzaj Konta'];
    statusOptions: string[] = [];

    arrStatus: string[] = [];
    statusReduceArr: string[] = [];
    dataToken: any;

    length = 100;
    pageSize = 20;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 20, 50];

    resNumberRecord = 0;

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;

    disabled = false;

    pageEvent: PageEvent;

    sortBy: string = 'id';
    direction: string = 'asc';
    statusInflu: string = '';
    instagramAccountType: string = '';
    firstName: string = '';
    lastName: string = '';

    searchValue: string = '';
    searchOptions: string[];

    isTextInput: boolean = true;
    isSelectInput: boolean = false;

    statusTextTableHtml = false;
    statusTextTable: string = '';

    selectedTypeAccount: string = 'NONPUBLIC';

    selectedStatus: string = 'IN_VALIDATION';
    selectedFilter: string = 'Imię';

    filterByAccountType: string = '';
    filterByStatus: string = '';

    filteredStatus: string[] = [];
    influencerStatuses: any;

    typeStatus: string[] = ['Walidowany', 'Aktywny', 'Nieaktywny'];
    typeAccountOptions: string[] = ['Publiczne', 'Niepubliczne', 'NA'];

    constructor(
        private _influencerService: InfluencerService,
        private _formBuilder: UntypedFormBuilder,
        private buttonStateService: InfluencerService,
        private changeDetectorRefs: ChangeDetectorRef,
        private fb: FormBuilder
    ) {
        this.editInfluencerFormGroup = this.fb.group({
            id: ['', [Validators.required]],
            lastUpdateTime: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required]],
            city: ['', [Validators.required]],
            instagramId: ['', [Validators.required]],
            followersAmount: ['', [Validators.required]],
            instagramAccountType: ['', [Validators.required]],
            accountStatus: ['', [Validators.required]],
            noteFromAdmin: [],
        });
    }

    ngAfterViewInit(): void {
        if (this.dataSource) this.dataSource.paginator = this.paginator;

        this.dataSource = new MatTableDataSource<Influencer>(
            this.influencerList
        );
    }

    ngOnInit(): void {
        this.loadInfluencers(this.pageIndex);
    }

    private setSearchFiltersToEmptyStrings() {
        this.firstName = '';
        this.lastName = '';
        this.statusInflu = '';
        this.instagramAccountType = '';
    }

    private setValueOfSelectedFilter(valueOfSelectedFilter: string) {
        switch (this.selectedFilter) {
            case 'Imię':
                this.firstName = valueOfSelectedFilter;
                break;
            case 'Nazwisko':
                this.lastName = valueOfSelectedFilter;
                break;
            case 'Status':
                this.statusInflu = valueOfSelectedFilter;
                break;
            case 'Rodzaj Konta':
                this.instagramAccountType = valueOfSelectedFilter;
                break;
        }
    }

    onSearchInputChange(searchInputValue: string) {
        this.searchValue = searchInputValue;

        this.setSearchFiltersToEmptyStrings();
        this.setValueOfSelectedFilter(this.searchValue);
        this.loadInfluencers(0);
    }

    onSearchSelectChange(event: any): void {
        this.selectedFilter = event.value;

        if (['Imię', 'Nazwisko'].includes(this.selectedFilter)) {
            this.isTextInput = true;
            this.isSelectInput = false;
            setTimeout(() => {
                this.textInput.nativeElement.focus();
            }, 0);
        }

        if (this.selectedFilter === 'Status') {
            this.isTextInput = false;
            this.isSelectInput = true;
            this.searchOptions = this.typeStatus;
            setTimeout(() => {
                this.selectInput.focus();
            }, 0);
        }

        if (this.selectedFilter === 'Rodzaj Konta') {
            this.isTextInput = false;
            this.isSelectInput = true;
            this.searchOptions = this.typeAccountOptions;
            setTimeout(() => {
                this.selectInput.focus();
            }, 0);
        }

        this.onSearchInputChange('');
    }

    private async loadInfluencers(pageIndex: number): Promise<void> {
        this._influencerService
            .getInfluencerPaged(
                pageIndex,
                this.pageSize,
                this.sortBy,
                this.direction,
                this.statusInflu,
                this.instagramAccountType,
                this.firstName,
                this.lastName
            )
            .subscribe({
                next: (response: InfluencerResponse) => {
                    this.length = response.page.totalElements;
                    this.pageIndex = response.page.number;
                    this.paginator.length = response.page.totalElements;
                    this.paginator.pageIndex = response.page.number;
                    this.paginator.pageSize = response.page.size;

                    this.dataSource.data = response.content;
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

        this.loadInfluencers(0);
    }

    handlePageNavigationChange(e: PageEvent): void {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;

        this.loadInfluencers(e.pageIndex);
    }

    handlePageEvent(e: PageEvent) {
        if (this.pageSizeChanged(this.pageSize, e.pageSize)) {
            this.handlePageSizeChange(e);
        } else {
            this.handlePageNavigationChange(e);
        }
    }

    onSortData(event: any): void {
        this.ascDescInfo = true;
        this.direction = event.direction;
        this.sortBy = event.active;

        this.loadInfluencers(0);
    }

    closeDetails(): void {
        this.selectedProduct = null;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    sendToInluencer(influencerId: number): void {
        const instagramId =
            this.editInfluencerFormGroup.get('instagramId').value;
        const firstName = this.editInfluencerFormGroup.get('firstName').value;
        const lastName = this.editInfluencerFormGroup.get('lastName').value;
        const email = this.editInfluencerFormGroup.get('email').value;
        const city = this.editInfluencerFormGroup.get('city').value;
        const followersAmount =
            this.editInfluencerFormGroup.get('followersAmount').value;
        const updatedNote =
            this.editInfluencerFormGroup.get('noteFromAdmin').value;
        const updatedStatus =
            this.editInfluencerFormGroup.get('accountStatus').value;
        const updatedAccountType = this.editInfluencerFormGroup.get(
            'instagramAccountType'
        ).value;
        const influencerToUpdate = this.influencerList.find(
            (influencer) => influencer.id === influencerId
        );

        this.confrimEditionInfo = true;

        const influencerUpdate = {
            ...influencerToUpdate,
            instagramId: instagramId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            city: city,
            followersAmount: followersAmount,
            noteFromAdmin: updatedNote,
            accountStatus: updatedStatus,
            instagramAccountType: updatedAccountType,
        };

        this._influencerService
            .updateNoteFromAdmin(influencerUpdate, influencerId)
            .subscribe((updatedInfluencer) => {
                updatedInfluencer.accountStatus =
                    updatedInfluencer.accountStatus;
                updatedInfluencer.instagramAccountType =
                    updatedInfluencer.instagramAccountType;
                const idToUpdate: number = this.dataSource.data.findIndex(
                    (influ) => influ.id === updatedInfluencer.id
                );
                this.dataSource.data[idToUpdate] = updatedInfluencer;
                this.dataSource._updateChangeSubscription();
                this.changeDetectorRefs.detach();
                this.fillEditForm();
                this.changeDetectorRefs.markForCheck();
                this.changeDetectorRefs.reattach();
            });

        const shouldDisable = true;
        this.buttonStateService.setDisabledState(shouldDisable);
    }

    onTypeAccountChange(event: MatSelectChange): void {
        this.selectedTypeAccount = event.value;
    }

    onStatusChange(event: MatSelectChange): void {
        this.selectedStatus = event.value;
    }

    openAddInfluencerForm(): void {
        if (!this.formLaunched) {
            this.formLaunched = true;
        } else this.formLaunched = false;
    }

    getExpandedInfluencer(): Influencer {
        return this.expandedInfluencer;
    }

    fillEditForm(): void {
        if (this.expandedInfluencer != null) {
            this.editInfluencerFormGroup.controls['id'].setValue(
                this.expandedInfluencer.id
            );
            this.editInfluencerFormGroup.controls['firstName'].setValue(
                this.expandedInfluencer.firstName
            );
            this.editInfluencerFormGroup.controls['lastName'].setValue(
                this.expandedInfluencer.lastName
            );
            this.editInfluencerFormGroup.controls['email'].setValue(
                this.expandedInfluencer.email
            );
            this.editInfluencerFormGroup.controls['city'].setValue(
                this.expandedInfluencer.city
            );
            this.editInfluencerFormGroup.controls['instagramId'].setValue(
                this.expandedInfluencer.instagramId
            );
            this.editInfluencerFormGroup.controls['followersAmount'].setValue(
                this.expandedInfluencer.followersAmount
            );
            this.editInfluencerFormGroup.controls[
                'instagramAccountType'
            ].setValue(this.expandedInfluencer.instagramAccountType);
            this.editInfluencerFormGroup.controls['accountStatus'].setValue(
                this.expandedInfluencer.accountStatus
            );
            this.editInfluencerFormGroup.controls['noteFromAdmin'].setValue(
                this.expandedInfluencer.noteFromAdmin
            );
            this.editInfluencerFormGroup.controls['id'].disable();
        }
    }
}
