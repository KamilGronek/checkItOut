import {CommonModule} from '@angular/common';
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
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Company, CompanyResponse} from 'app/feature/companies/services/company.types';

import {NgApexchartsModule} from 'ng-apexcharts';
import {Observable, Subject} from 'rxjs';

import {CompanyService} from 'app/feature/companies/services/company.service';

import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {animate, state, style, transition, trigger,} from '@angular/animations';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {HttpClient} from '@angular/common/http';
import {AuthService} from 'app/core/services/authentication/auth.service';

import {ImageService} from 'app/core/services/image/image.service';
import {TranslocoModule} from '@ngneat/transloco';

@Component({
    selector: 'companies-list',
    standalone: true,
    templateUrl: './companies-list.component.html',
    styleUrl: './companies-list.styles.css',
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
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
        MatSelectModule,
        MatPaginatorModule,
        TranslocoModule,
    ],
})
export class CompaniesComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('influencersTable', {read: MatSort})
    influencersTableMatSort: MatSort;
    @ViewChild('textItem')
    textInput: ElementRef;
    @ViewChild('selectItem')
    selectInput: any;
    data: any;

    influencersTableColumns: string[] = [
        'id',
        // 'name',
        'lastUpdateTime',
        'firstName',
        'lastName',
        'email',
        'city',
        // 'serviceType',
        // 'address',
    ];
    columnsToDisplayWithExpand: string[] = [
        ...this.influencersTableColumns,
        'expand',
    ];
    expandedInfluencer: Company | null;

    formLaunched: boolean = false;
    editformLaunched: boolean = false;
    idOfEditedUser: number;
    flashMessage: 'success' | 'error' | null = null;

    editInfluencerFormGroup: UntypedFormGroup;

    companyList: Company[] = [];
    CompanyResponse: { Company: any };
    dataSource: MatTableDataSource<Company>;

    resInput: any;
    form: FormGroup;
    selectedProduct: Company | null = null;
    isLoading: boolean = false;
    updatedNoteInfo: boolean = false;
    // followersAmountInfo: boolean = false;
    confirmEditionInfo: boolean = false;
    ascDescInfo: boolean = false;

    sortDirection: string = 'asc';

    myControl = new FormControl('');
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    categories: Company[];

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

    selectedProductForm: UntypedFormGroup;

    selectedFile: File | null = null;

    imageUrl: { [id: number]: string | null } = {};
    nameSelect = '';
    rows = [];
    imgDisplay = false;

    serviceTypeOptions = [
        {id: 1, label: 'Placeholder 1'},
        {id: 2, label: 'Placeholder 2'},
        {id: 3, label: 'Placeholder 3'},
        {id: 4, label: 'Placeholder 4'},
        {id: 5, label: 'Placeholder 5'},
        {id: 6, label: 'Placeholder 6'},
        {id: 7, label: 'Placeholder 7'},
        {id: 8, label: 'Placeholder 8'},
        {id: 9, label: 'Placeholder 9'},
        {id: 10, label: 'Placeholder 10'},
    ];

    constructor(
        // private _influencerService: InfluencerService,
        private _companyService: CompanyService,
        private _formBuilder: UntypedFormBuilder,
        private changeDetectorRefs: ChangeDetectorRef,
        private fb: FormBuilder,
        private http: HttpClient,
        private authService: AuthService,
        private imageService: ImageService
    ) {
        this.editInfluencerFormGroup = this.fb.group({
            id: ['', [Validators.required]],
            lastUpdateTime: ['', [Validators.required]],
            name: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required]],
            city: ['', [Validators.required]],
            address: ['', [Validators.required]],
            phoneNumber: [''],
            note: [''],
            serviceType: [, [Validators.required]],
        });
    }

    ngAfterViewInit(): void {
        if (this.dataSource) this.dataSource.paginator = this.paginator;

        this.dataSource = new MatTableDataSource<Company>(this.companyList);
    }

    ngOnInit(): void {
        this.loadCompanies(this.pageIndex);
    }

    private setSearchFiltersToEmptyStrings() {
        this.firstName = '';
        this.lastName = '';
        this.statusInflu = '';
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
        }
    }

    onSearchInputChange(searchInputValue: string): void {
        this.searchValue = searchInputValue;

        this.setSearchFiltersToEmptyStrings();
        this.setValueOfSelectedFilter(searchInputValue);
        this.loadCompanies(0);
    }

    onSearchSelectChange(event?: any): void {
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

    private async loadCompanies(pageIndex: number): Promise<void> {
        this._companyService
            .getCompanyPaged(
                pageIndex,
                this.pageSize,
                this.sortBy,
                this.direction,
                this.statusInflu,
                this.firstName,
                this.lastName
            )
            .subscribe({
                next: (response: CompanyResponse) => {
                    this.length = response.page.totalElements;
                    this.pageIndex = response.page.number;
                    this.paginator.length = response.page.totalElements;
                    this.paginator.pageIndex = response.page.number;
                    this.paginator.pageSize = response.page.size;
                    this.dataSource.data = response.content;

                    for (let company of this.dataSource.data) {
                        this.imageUrl[company.id] = company?.imageUrl || null;
                    }
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

        this.loadCompanies(0);
    }

    handlePageNavigationChange(e: PageEvent): void {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;

        this.loadCompanies(e.pageIndex);
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

        this.loadCompanies(0);
    }

    closeDetails(): void {
        this.selectedProduct = null;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        Object.keys(this.imageUrl).forEach((key) => {
            const url = this.imageUrl[key];

            if (typeof url === 'string' && url.startsWith('blob:'))
                URL.revokeObjectURL(url);
        });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    async putOrPatchCompany(companyId: number): Promise<void> {
        const firstName = this.editInfluencerFormGroup.get('firstName').value;
        const lastName = this.editInfluencerFormGroup.get('lastName').value;
        const name = this.editInfluencerFormGroup.get('name').value;

        const email = this.editInfluencerFormGroup.get('email').value;
        const city = this.editInfluencerFormGroup.get('city').value;
        const address = this.editInfluencerFormGroup.get('address').value;
        const phoneNumber =
            this.editInfluencerFormGroup.get('phoneNumber').value;
        const note = this.editInfluencerFormGroup.get('note').value;

        const serviceType =
            this.editInfluencerFormGroup.get('serviceType').value;

        const companyToUpdate = this.dataSource.data.find(
            (company) => company.id === companyId
        );

        if (!companyToUpdate) {
            console.error(`Company with ID ${companyId} not found.`);
            return;
        }

        this.confirmEditionInfo = true;

        if (this.selectedFile) {
            try {
                await this.imageService.deleteAllFilesInFolder(
                    `companies/${companyId.toString()}`
                );
                const url = await this.imageService.uploadImage(
                    this.selectedFile,
                    `companies/${companyId.toString()}`
                );
                this.updateCompany(companyId, {
                    ...companyToUpdate,
                    name: name,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    city: city,
                    address: address,
                    phoneNumber: phoneNumber,
                    serviceType: serviceType,
                    note: note,
                    imageUrl: url,
                });
            } catch (error) {
                console.error('Image upload failed:', error);
            }
        } else {
            this.updateCompany(companyId, {
                ...companyToUpdate,
                name: name,
                firstName: firstName,
                lastName: lastName,
                email: email,
                city: city,
                address: address,
                phoneNumber: phoneNumber,
                note: note,
                serviceType: serviceType,
            });
        }
    }

    private updateCompany(companyId: number, companyUpdate: any): void {
        this._companyService
            .updateCompanyPut(companyUpdate, companyId)
            .subscribe({
                next: (updatedCompany) => {
                    const idToUpdate: number = this.dataSource.data.findIndex(
                        (company) => company.id === updatedCompany.id
                    );

                    this.dataSource.data[idToUpdate] = updatedCompany;
                    this.dataSource._updateChangeSubscription();
                    this.changeDetectorRefs.detach();
                    this.fillEditForm();
                    this.changeDetectorRefs.markForCheck();
                    this.changeDetectorRefs.reattach();
                },
                error: (err) => {
                    console.error('Błąd podczas aktualizacji:', err);
                },
            });
    }

    deleteImage(companyId: number) {
        const companyToUpdate = this.dataSource.data.find(
            (company) => company.id === companyId
        );

        if (!companyToUpdate) {
            console.error(`Company with ID ${companyId} not found.`);
            return;
        }

        if (companyToUpdate.imageUrl === null) {
            this.imageUrl[companyId] = null;
            this.selectedFile = null;
            return;
        }

        this.imageService
            .deleteAllFilesInFolder(`companies/${companyId.toString()}`)
            .then(() => {
                this.updateCompany(companyId, {
                    ...companyToUpdate,
                    imageUrl: null,
                    serviceType: companyToUpdate.serviceType.id,
                });
                this.imageUrl[companyId] = null;
            })
            .catch((error) => console.log('Błąd podczas usuwania:', error));
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

    getExpandedInfluencer(): Company {
        return this.expandedInfluencer;
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input?.files && input.files.length > 0) {
            this.selectedFile = input.files[0];

            const url = this.imageUrl[this.expandedInfluencer.id];
            if (typeof url === 'string' && url.startsWith('blob:')) {
                URL.revokeObjectURL(this.imageUrl[this.expandedInfluencer.id]);
            }

            this.imageUrl[this.expandedInfluencer.id] = URL.createObjectURL(
                this.selectedFile
            );
        }
    }

    onInputClick(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = null;
    }

    delete(companyId: number): void {
        this._companyService.deleteCompany(companyId).subscribe({
            next: () => {
                this.loadCompanies(0);
            },
            error: (err) => {
                console.error('Error deleting company:', err);
            },
        });
    }

    fillEditForm(): void {
        if (this.expandedInfluencer != null) {
            this.editInfluencerFormGroup.controls['id'].setValue(
                this.expandedInfluencer.id
            );
            this.editInfluencerFormGroup.controls['name'].setValue(
                this.expandedInfluencer.name
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
            this.editInfluencerFormGroup.controls['address'].setValue(
                this.expandedInfluencer.address
            );
            this.editInfluencerFormGroup.controls['phoneNumber'].setValue(
                this.expandedInfluencer.phoneNumber
            );
            this.editInfluencerFormGroup.controls['note'].setValue(
                this.expandedInfluencer.note
            );
            this.editInfluencerFormGroup.controls['serviceType'].setValue(
                this.expandedInfluencer.serviceType?.id || null
            );
            this.editInfluencerFormGroup.controls['id'].disable();
        }
    }
}
