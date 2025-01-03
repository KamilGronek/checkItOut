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
    inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Company } from 'app/services/influencer/Company';
import { CompanyResponse } from 'app/services/influencer/Company';

import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';

import { CompanyService } from 'app/services/influencer/company.service';

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
import { InventoryCategory } from 'app/modules/admin/companies/inventory.types';
import { takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
// import { finalize } from 'rxjs/operators';
import { AngularFireModule } from '@angular/fire/compat';

@Component({
    selector: 'companies',
    standalone: true,
    templateUrl: './companies.component.html',
    styleUrl: './companies-list.styles.css',
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
export class CompaniesComponent implements OnInit, AfterViewInit, OnDestroy {
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
    confrimEditionInfo: boolean = false;
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
    // downloadURL: string | null = null;

    imageUrl: string | null = null;
    nameSelect = '';
    rows = [];
    imgDisplay = false;

    // private storage = inject(AngularFireStorage);

    constructor(
        // private _influencerService: InfluencerService,
        private _companyService: CompanyService,
        private _formBuilder: UntypedFormBuilder,
        private changeDetectorRefs: ChangeDetectorRef,
        private fb: FormBuilder,
        private http: HttpClient,
        private authService: AuthService
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
            imageUrl: [''],
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

                    console.log('data content:', this.dataSource.data);

                    // this.rows = this.dataSource.data.map(
                    //     (imageUrl) => imageUrl.imageUrl
                    // );

                    // this.imageUrl = this.rows[1];

                    // console.log('this.imageUrl:', this.imageUrl);
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
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    putOrPatchCompany(companyId: number): void {
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
        // const imageUrl = this.editInfluencerFormGroup.get('imageUrl').value;
        // const createdTime =
        //     this.editInfluencerFormGroup.get('createdTime').value;
        // const updater = this.editInfluencerFormGroup.get('updater').value;

        const companyToUpdate = this.companyList.find(
            (company) => company.id === companyId
        );

        this.confrimEditionInfo = true;
        // this.followersAmountInfo = false;

        const companyUpdate = {
            ...companyToUpdate,
            name: name,
            firstName: firstName,
            lastName: lastName,
            email: email,
            city: city,
            address: address,
            phoneNumber: phoneNumber,
            serviceType: serviceType.id,
            imageUrl: this.imageUrl,
            // createdTime: createdTime,
            // updater: updater,
            // noteFromAdmin: updatedNote,
        };

        console.log('companyUpdate:', companyUpdate);

        this._companyService
            .updateCompanyPut(companyUpdate, companyId)
            .subscribe({
                next: (updatedCompany) => {
                    console.log('updatedCompany:', updatedCompany);

                    const idToUpdate: number = this.dataSource.data.findIndex(
                        (company) => company.id === updatedCompany.id
                    );

                    console.log('idToUpdate:', idToUpdate);

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

        // if (influencer.selectedFile) {
        //     const formData = new FormData();
        //     formData.append('image', influencer.selectedFile);

        //     this.http
        //         .post(`/api/influencers/${influencer.id}/upload`, formData)
        //         .subscribe(
        //             (response: any) => {
        //                 console.log('Image uploaded:', response);

        //                 // Aktualizacja URL po zapisaniu na serwerze
        //                 influencer.imageUrl = response.imageUrl;
        //             },
        //             (error) => {
        //                 console.error('Error uploading image:', error);
        //             }
        //         );
        // }

        const shouldDisable = true;
        // this._companyService(shouldDisable);
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

        // console.log('companyId:', companyId);

        if (input?.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            // const selectedFile = input.files[0];

            this.imageUrl = URL.createObjectURL(this.selectedFile);

            // this.rows[i].imageUrl = this.imageUrl;

            // this.editInfluencerFormGroup.patchValue({
            //     imageUrl: this.imageUrl,
            // });
            // this.uploadImage(this.selectedFile).subscribe({
            //     next: (uploadedImageUrl) => {
            //         this.imageUrl = uploadedImageUrl;
            //         console.log('Image uploaded successfully:', this.imageUrl);
            //     },
            //     error: (error) => {
            //         console.error('Error uploading image:', error);
            //     },
            // });
        }
    }

    // uploadFile(event: Event): void {
    //     const file = (event.target as HTMLInputElement).files?.[0];
    //     if (file) {
    //         const filePath = `uploads/${Date.now()}_${file.name}`;
    //         const task = this.storage.upload(filePath, file);
    //         task.percentageChanges().subscribe((progress) =>
    //             console.log(progress)
    //         );
    //     }
    // }

    // uploadFile(): void {
    //     if (this.selectedFile) {
    //         console.log('Wysyłanie pliku:', this.selectedFile);
    //     } else {
    //         console.log('Nie wybrano pliku!');
    //     }

    //     //     const filePath = `images/${Date.now()}_${this.selectedFile.name}`;
    //     //     const fileRef = this.storage.ref(filePath);
    //     //     const task = this.storage.upload(filePath, this.selectedFile);

    //     //     task.snapshotChanges()
    //     //         .pipe(
    //     //             finalize(() => {
    //     //                 fileRef.getDownloadURL().subscribe((url) => {
    //     //                     this.downloadURL = url;
    //     //                     console.log('Download URL:', this.downloadURL);

    //     //                     this.saveImageUrlToDatabase(this.downloadURL);
    //     //                 });
    //     //             })
    //     //         )
    //     //         .subscribe();
    // }

    // saveImageUrlToDatabase(url: string): void {
    //     const apiUrl = 'https://twoja-api.com/images'; // Zmień na swój endpoint API
    //     this.http.post(apiUrl, { imageUrl: url }).subscribe(
    //         (response) => {
    //             console.log('Image URL saved to database:', response);
    //         },
    //         (error) => {
    //             console.error('Error saving image URL:', error);
    //         }
    //     );
    // }

    // uploadImage(influencer: any): void {
    //     if (influencer.selectedFile) {
    //         const formData = new FormData();
    //         formData.append('image', influencer.selectedFile);

    //         this.http
    //             .post(`/api/influencers/${influencer.id}/upload`, formData)
    //             .subscribe(
    //                 () => {
    //                     console.log(
    //                         `Image uploaded for influencer with ID: ${influencer.id}`
    //                     );
    //                 },
    //                 (error) => {
    //                     console.error('Error uploading image:', error);
    //                 }
    //             );
    //     }
    // }

    // clearPreview(): void {
    //     if (this.uploadedImageUrl) {
    //         URL.revokeObjectURL(this.uploadedImageUrl);
    //         this.uploadedImageUrl = null;
    //     }
    // }

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
                this.expandedInfluencer.serviceType
            );
            this.editInfluencerFormGroup.controls['imageUrl'].setValue(
                this.expandedInfluencer.imageUrl
            );
            this.editInfluencerFormGroup.controls['id'].disable();
        }
    }
}
