import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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
// import { MessageToInfluenser } from 'app/services/influencer/Influencer';

// import { UserData } from 'app/services/userData/UserData';

import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import {
    Subject,
    takeUntil,
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    startWith,
    map,
} from 'rxjs';
// import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { InfluencerService } from 'app/services/influencer/influencer.service';
// import { UserDataService } from 'app/services/userData/userData.service';

import {
    FormGroup,
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    UntypedFormControl,
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
import { AuthService } from 'app/core/auth/auth.service';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

import { PageEvent } from '@angular/material/paginator';
import { serverTimestamp } from '@angular/fire/firestore';

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
        NgClass,
        MatProgressBarModule,
        CurrencyPipe,
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
    data: any;

    influencersTableColumns: string[] = [
        'id',
        'date',
        'firstName',
        'lastName',
        'email',
        'city',
        'instagramId',
        'followersAmount',
        'instagramAccountType',
        'status',
    ];
    columnsToDisplayWithExpand: string[] = [
        ...this.influencersTableColumns,
        'expand',
    ];
    expandedInfluencer: Influencer | null;

    // expandedMessageToInfluenser: MessageToInfluenser | null;
    // searchInputControl: UntypedFormControl = new UntypedFormControl();

    // expandedNewInfluencer: UserData | null;
    formLaunched: boolean = false;
    editformLaunched: boolean = false;
    idOfEditedUser: number;
    flashMessage: 'success' | 'error' | null = null;
    // influencerList: Influencer[];
    // userDataList: UserData[];
    // MessageToInfluenser: MessageToInfluenser[];

    // addInfluencerFormGroup: UntypedFormGroup;
    editInfluencerFormGroup: UntypedFormGroup;

    // editTextNoteToInfluenser: UntypedFormGroup;
    // influencersDataSource: MatTableDataSource<any> = new MatTableDataSource();

    influencerList: Influencer[] = [];
    InfluencerResponse: { Influencer: any };
    // influencerUpdate: Influencer[];

    dataSource: MatTableDataSource<Influencer>;

    // dataSource = ELEMENT_DATA;
    resInput: any;
    form: FormGroup;
    selectedProduct: Influencer | null = null;
    isLoading: boolean = false;
    updatedNoteInfo: boolean = false;
    followersAmountInfo: boolean = false;
    instagramAccountTypeInfo: boolean = false;
    confrimEditionInfo: boolean = false;
    ascDescInfo: boolean = false;

    sortDirection: string = 'asc';
    // filterByAccountType: string = '';
    // filterByStatus: string = '';

    // searchInputStatus = new FormControl('');
    // searchInputAccountType = new FormControl('');

    myControl = new FormControl('');
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    categories: Influencer[];

    selectedSortOption = 'default';

    // selectedTypeAccount: string = '';
    // selectedStatus: string = '';

    fieldOptions: string[] = ['Imię', 'Nazwisko', 'Status', 'Rodzaj Konta'];
    statusOptions: string[] = [];

    arrStatus: string[] = [];
    statusReduceArr: string[] = [];
    // statusChoose: string;
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
    // city: string = '';
    firstName: string = '';
    lastName: string = '';

    searchValue: string = '';

    statusTextTableHtml = false;
    statusTextTable: string = '';
    // typeStatus: any;

    selectedTypeAccount: string = 'NONPUBLIC';
    // NIEPUBLICZNE
    typeAccountOptions: any = '';

    selectedStatus: string = 'IN_VALIDATION';
    typeStatus: any = 'IN_VALIDATION';

    selectedFilter: string = 'Imię';

    filterByAccountType: string = '';
    filterByStatus: string = '';

    filteredStatus: string[] = [];
    influencerStatuses: any;

    // id: number = 0;

    constructor(
        private _influencerService: InfluencerService,
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _authService: AuthService,
        private buttonStateService: InfluencerService,

        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            noteFromAdmin: ['', [Validators.required]], // Dodajemy walidację
        });
    }

    ngAfterViewInit(): void {
        if (this.dataSource) {
            console.log('this.dataSource', this.dataSource);
            this.dataSource.paginator = this.paginator;

            // console.log('typeStatus134:', this.typeStatus);

            // this.getStatus();
        }

        this.dataSource = new MatTableDataSource<Influencer>(
            this.influencerList
        );

        console.log('response:', this.influencerList);
    }

    ngOnInit(): void {
        // this.filteredStatus = this.typeStatus.filter(
        //     (type: any) => type !== 'IN_VALIDATION'
        // );

        console.log('typeStatus266:', this.typeStatus);
        // console.log('filteredStatus:', this.filteredStatus);

        // this.pageSize = 20;
        this.initializeForm();
        this.loadInfluencers(
            this.pageIndex,
            this.pageSize,
            this.sortBy,
            this.direction,
            this.statusInflu,
            this.instagramAccountType,
            this.firstName,
            this.lastName
        );
        // this.setupSearch();
        this.getTypeAccount();
    }

    private initializeForm(): void {
        this.editInfluencerFormGroup = this._formBuilder.group({
            id: ['', [Validators.required]],
            date: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required]],
            city: ['', [Validators.required]],
            instagramId: ['', [Validators.required]],
            followersAmount: ['', [Validators.required]],
            instagramAccountType: ['', [Validators.required]],
            status: ['', [Validators.required]],
        });
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

    onSearchInputChange(searchInputValue: string): void {
        this.searchValue = searchInputValue;
        this.setSearchFiltersToEmptyStrings();
        this.setValueOfSelectedFilter(searchInputValue);
        this.loadInfluencers(
            0,
            this.pageSize,
            this.sortBy,
            this.direction,
            this.firstName,
            this.lastName,
            this.statusInflu,
            this.instagramAccountType
        );
    }

    onSearchSelectChange(event?: any): void {
        this.selectedFilter = event.value;
        this.onSearchInputChange(this.searchValue);
    }

    private async loadInfluencers(
        pageIndex: number,
        pageSize: number,
        sortBy: string,
        direction: string,
        statusInflu: string,
        instagramAccountType: string,
        firstName: string,
        lastName: string
    ): Promise<void> {
        this._influencerService
            // .getInfluencerList()
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
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response: InfluencerResponse) => {
                    this.length = response.page.totalElements;
                    this.pageIndex = response.page.number;

                    this.paginator.length = response.page.totalElements;
                    this.paginator.pageIndex = response.page.number;
                    this.paginator.pageSize = response.page.size;

                    this.dataSource.data = response.content;
                    this.getStatus();
                },
                (error) => {
                    console.error('Error fetching influencer list', error);
                }
            );
    }

    pageSizeChanged(previousPageSize: number, newPageSize: number): boolean {
        return previousPageSize != newPageSize;
    }

    handlePageSizeChange(e: PageEvent): void {
        this.pageIndex = 0;
        this.pageSize = e.pageSize;

        this.loadInfluencers(
            0,
            e.pageSize,
            this.sortBy,
            this.direction,
            this.firstName,
            this.lastName,
            this.statusInflu,
            this.instagramAccountType
        );
    }

    handlePageNavigationChange(e: PageEvent): void {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;

        this.loadInfluencers(
            e.pageIndex,
            e.pageSize,
            this.sortBy,
            this.direction,
            this.firstName,
            this.lastName,
            this.statusInflu,
            this.instagramAccountType
        );
    }

    handlePageEvent(e: PageEvent) {
        if (this.pageSizeChanged(this.pageSize, e.pageSize)) {
            this.handlePageSizeChange(e);
        } else {
            this.handlePageNavigationChange(e);
        }
    }

    onSortData(event: any): void {
        console.log(event);

        this.ascDescInfo = true;
        this.direction = event.direction;
        this.sortBy = event.active;

        this.loadInfluencers(
            0,
            this.pageSize,
            this.sortBy,
            this.direction,
            this.statusInflu,
            this.instagramAccountType,
            this.firstName,
            this.lastName
        );
    }

    getStatus() {
        this._influencerService
            .getInfluencerStatus()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response) => {
                    this.typeStatus = response;
                    // this.typeStatus.push('ALL');

                    console.log('typeStatus:', this.typeStatus);
                },
                (error) => {
                    console.error('Error fetching influencer list', error);
                }
            );
    }

    getTypeAccount() {
        this._influencerService
            .getInfluencerTypeAccount()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response) => {
                    this.typeAccountOptions = response;
                    // this.typeAccountOptions.push('ALL');
                },
                (error) => {
                    console.error('Error fetching influencer list', error);
                }
            );
    }

    closeDetails(): void {
        this.selectedProduct = null;
    }

    /**
     * After view init
     */

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
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
        const updatedNote = this.form.get('noteFromAdmin').value;
        const influencerToUpdate = this.influencerList.find(
            (influencer) => influencer.id === influencerId
        );

        console.log('Influenscer id:', influencerId);
        this.confrimEditionInfo = true;
        this.followersAmountInfo = false;
        // if (!influencerToUpdate) {
        //     console.log('Influenscer o podanym ID nie został znaleziony');
        //     return;
        // }

        if (this.selectedStatus == 'ACTIVE') {
            const shouldDisable = true;
            this.buttonStateService.setDisabledState(shouldDisable);
        }

        const influencerUpdate = {
            ...influencerToUpdate,
            instagramId: instagramId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            city: city,
            followersAmount: followersAmount,
            noteFromAdmin: updatedNote,
            status: this.selectedStatus,
            instagramAccountType: this.selectedTypeAccount,
        };

        if (followersAmount == null || followersAmount < 1) {
            console.log('followersAmount:', followersAmount);

            this.followersAmountInfo = true;
            this.confrimEditionInfo = false;
        }

        this._influencerService
            .updateNoteFromAdmin(influencerUpdate, influencerId)
            .subscribe((updatedInfluencer) => {
                const index = this.influencerList.findIndex(
                    (influencer) => influencer.id === influencerId
                );
                this.influencerList[index] = updatedInfluencer;

                console.log(
                    'Influenser po wysłaniu:',
                    this.influencerList[index]
                );
            });

        this.getStatus();

        const shouldDisable = true;
        this.buttonStateService.setDisabledState(shouldDisable);
    }

    onTypeAccountChange(event: MatSelectChange): void {
        this.selectedTypeAccount = event.value;

        // this.editInfluencerFormGroup.patchValue({
        //     instagramAccountType: this.selectedTypeAccount,
        // });
    }

    onStatusChange(event: MatSelectChange): void {
        console.log('ruch');

        console.log(event.value);
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
            // this.editInfluencerFormGroup.controls['date'].setValue(
            //     this.expandedInfluencer.date
            // );
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

            this.editInfluencerFormGroup.controls['status'].setValue(
                this.expandedInfluencer.status
            );
            this.editInfluencerFormGroup.controls['id'].disable();
        }
    }
}
