import { CommonModule } from '@angular/common';
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
  NgZone
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Company, CompanyResponse } from 'app/feature/companies/services/company.types';

import { NgApexchartsModule } from 'ng-apexcharts';
import { combineAll, Observable, Subject } from 'rxjs';

import { CompanyService } from 'app/feature/companies/services/company.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'app/core/services/authentication/auth.service';

import { ImageService } from 'app/core/services/image/image.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { Column } from '../../../../shared/components/ui/table/table.types';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { LookingUpCompanyDataService } from 'app/feature/companies/components/companies-list/details-looku-data.service';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'companies-list',
  standalone: true,
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.styles.css',
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
    SelectComponent,
    TableComponent,
    InputComponent,
    ButtonComponent,
    MatProgressSpinnerModule
  ]
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

  expandedInfluencer: Company | null;

  editInfluencerFormGroup: UntypedFormGroup;

  companyList: Company[] = [];
  dataSource: MatTableDataSource<Company>;

  fullTableColumns: Column[] = [
    { key: 'name', label: 'admin.companies.table_headers.name' },
    { key: 'cityDisplay', label: 'admin.companies.table_headers.city' },
    { key: 'addressDisplay', label: 'admin.companies.table_headers.address' },
    { key: 'email', label: 'admin.companies.table_headers.email' },
    { key: 'phoneNumber', label: 'admin.companies.table_headers.phone_number' }
  ];

  mobileTableColumns: Column[] = [
    { key: 'name', label: 'admin.companies.table_headers.name' },
    { key: 'email', label: 'admin.companies.table_headers.email' }
  ];

  tableColumns: Column[] = [];

  form: FormGroup;
  updatedNoteInfo: boolean = false;
  confirmEditionInfo: boolean = false;

  options: string[] = ['One', 'Two', 'Three'];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  length = 100;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20, 50];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  disabled = false;

  sortBy: string = 'id';
  direction: string = 'asc';
  statusInflu: string = '';
  firstName: string = '';
  lastName: string = '';

  selectedFile: File | null = null;

  companyNameControl = new FormControl('', [Validators.required]);
  emailControl = new FormControl('', [Validators.required]);
  addressControl = new FormControl('', [Validators.required]);
  firstNameControl = new FormControl('', [Validators.required]);
  lastNameControl = new FormControl('', [Validators.required]);
  cityControl = new FormControl('', [Validators.required]);
  phoneNumberControl = new FormControl('', [Validators.required]);
  textAreaControlTitle = new FormControl('', [Validators.required]);
  imageControl = new FormControl('', [Validators.required]);
  statusControl = new FormControl('', [Validators.required]);

  cityList$ = this._LookingUpCompanyDataService.cityList$;
  statusList$ = this._LookingUpCompanyDataService.statusList$;

  imageUrl: { [id: number]: string | null } = {};
  rows = [];
  userId = 0;
  flattened = [];

  isLoading = false;

  constructor(
    public _LookingUpCompanyDataService: LookingUpCompanyDataService,
    private _companyService: CompanyService,
    private _formBuilder: UntypedFormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private imageService: ImageService,
    private translocoService: TranslocoService,
    private snackbarService: SnackbarService,
    private ngZone: NgZone
  ) {
    this.editInfluencerFormGroup = this.fb.group({
      id: ['', [Validators.required]],
      lastUpdateTime: ['', [Validators.required]],
      name: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      addresses: this.fb.group({
        street: [''],
        city: [''],
        postalCode: [''],
        country: [''],
        state: [''],
        additionalInfo: [''],
        addressType: ['']
      }),
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: [''],

      serviceType: [, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    if (this.dataSource) this.dataSource.paginator = this.paginator;

    console.log(this.companyList);
    this.dataSource = new MatTableDataSource<Company>(this.companyList);
    console.log(this.dataSource);
  }

  private resizeListener!: () => void;
  isMobile = false;

  ngOnInit(): void {
    this.loadCompanies(this.pageIndex);
    this._LookingUpCompanyDataService.getStatus();

    this.isMobile = window.innerWidth < 640;
    this.tableColumns = this.isMobile ? this.mobileTableColumns : this.fullTableColumns;
  }

  onUserRowToggled(user: any): void {
    this.userId = user.id;

    console.log('user', user);
    this.companyNameControl.setValue(user.name);
    this.emailControl.setValue(user.email);
    this.addressControl.setValue(user.addresses[0].street);
    this.firstNameControl.setValue(user.firstName);
    this.lastNameControl.setValue(user.lastName);
    this.cityControl.setValue(user.addresses[0].city);
    this.phoneNumberControl.setValue(user.phoneNumber);
    this.textAreaControlTitle.setValue(user.noteFromAdmin);
    this.statusControl.setValue(user.accountStatus);
  }

  private async loadCompanies(pageIndex: number): Promise<void> {
    this.isLoading = true;

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
          this.length = response.totalElements;
          this.pageIndex = response.number;
          this.paginator.length = response.totalElements;
          this.paginator.pageIndex = response.number;
          this.paginator.pageSize = response.size;

          this.flattened = response.content.map(company => ({
            ...company,
            cityDisplay: company.addresses?.[0]?.city ?? '',
            addressDisplay: company.addresses?.[0]?.street ?? ''
          }));

          this.dataSource.data = this.flattened;

          console.log('response comany', this.flattened);

          for (let company of this.dataSource.data) {
            this.imageUrl[company.id] = company?.imageUrl || null;
          }

          const message = this.translocoService.translate(
            'admin.new_influencers.snackbarServiceTextLoaded'
          );
          this.snackbarService.showSuccess(message);
          this.isLoading = false;
        },
        error: error => {
          console.error('Error fetching influencer list', error);

          const message = this.translocoService.translate(
            'admin.new_influencers.snackbarServiceTextFailure'
          );
          this.snackbarService.showFailure(message);
          this.isLoading = false;
        }
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    window.removeEventListener('resize', this.resizeListener);

    Object.keys(this.imageUrl).forEach(key => {
      const url = this.imageUrl[key];

      if (typeof url === 'string' && url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  }

  async putOrPatchCompany(companyId: number): Promise<Company> {
    const company: Company = this.editInfluencerFormGroup.getRawValue();
    company.name = this.companyNameControl.value;
    company.firstName = this.firstNameControl.value;
    company.lastName = this.lastNameControl.value;
    company.email = this.emailControl.value;
    company.accountStatus = this.statusControl.value;

    const companyToUpdate = this.dataSource.data.find(company => company.id === companyId);

    company.addresses = [
      {
        ...companyToUpdate.addresses?.[0],
        street: this.addressControl.value,
        city: this.cityControl.value
      }
    ];

    company.phoneNumber = this.phoneNumberControl.value;

    const serviceType = this.editInfluencerFormGroup.get('serviceType').value;

    console.log('companyToUpdate', companyToUpdate.addresses[0].city);

    if (!companyToUpdate) {
      console.error(`Company with ID ${companyId} not found.`);
      return;
    }

    this.confirmEditionInfo = true;

    if (this.selectedFile) {
      try {
        await this.imageService.deleteAllFilesInFolder(`companies/${companyId.toString()}`);
        const url = await this.imageService.uploadImage(
          this.selectedFile,
          `companies/${companyId.toString()}`
        );
        this.updateCompany(companyId, {
          ...companyToUpdate,
          name: company.name,
          firstName: company.firstName,
          lastName: company.lastName,
          email: company.email,
          addresses: company.addresses,
          phoneNumber: company.phoneNumber,
          serviceType: serviceType,
          imageUrl: url
        });
      } catch (error) {
        console.error('Image upload failed:', error);
      }

      console.log('company send:', companyToUpdate);

      return company;
    } else {
      this.updateCompany(companyId, {
        ...companyToUpdate,
        name: company.name,
        firstName: company.firstName,
        lastName: company.lastName,
        email: company.email,
        addresses: company.addresses,
        phoneNumber: company.phoneNumber,
        serviceType: serviceType
      });
    }
  }

  private updateCompany(companyId: number, companyUpdate: any): void {
    this._companyService.updateCompanyPut(companyUpdate, companyId).subscribe({
      next: updatedCompany => {
        const idToUpdate: number = this.dataSource.data.findIndex(
          company => company.id === updatedCompany.id
        );

        const updatedCompanyWithDisplay = {
          ...updatedCompany,
          cityDisplay: updatedCompany.addresses?.[0]?.city ?? '',
          addressDisplay: updatedCompany.addresses?.[0]?.street ?? ''
        };

        this.dataSource.data[idToUpdate] = updatedCompanyWithDisplay;
        this.dataSource._updateChangeSubscription();
        this.changeDetectorRefs.detach();
        this.fillEditForm();
        this.changeDetectorRefs.markForCheck();
        this.changeDetectorRefs.reattach();
        const message = this.translocoService.translate(
          'admin.new_influencers.snackbarServiceTextAfterSave'
        );
        this.snackbarService.showSuccess(message);
      },
      error: err => {
        console.error('Błąd podczas aktualizacji:', err);
        const message = this.translocoService.translate(
          'admin.new_influencers.snackbarServiceTextFailure'
        );
        this.snackbarService.showFailure(message);
      }
    });
  }

  deleteImage(companyId: number) {
    const companyToUpdate = this.dataSource.data.find(company => company.id === companyId);

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
          serviceType: companyToUpdate.serviceType.id
        });
        this.imageUrl[companyId] = null;
      })
      .catch(error => console.log('Błąd podczas usuwania:', error));
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

      this.imageUrl[this.expandedInfluencer.id] = URL.createObjectURL(this.selectedFile);
    }
  }

  onInputClick(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = null;
  }

  delete(companyId: number): void {
    this._companyService.deleteCompany(companyId).subscribe({
      next: () => {
        console.log('Oszło');
        this.loadCompanies(0);
      },
      error: err => {
        console.error('Error deleting company:', err);
      }
    });
  }

  fillEditForm(): void {
    if (this.expandedInfluencer != null) {
      this.editInfluencerFormGroup.controls['id'].setValue(this.expandedInfluencer.id);
      this.editInfluencerFormGroup.controls['name'].setValue(this.expandedInfluencer.name);
      this.editInfluencerFormGroup.controls['firstName'].setValue(
        this.expandedInfluencer.firstName
      );
      this.editInfluencerFormGroup.controls['lastName'].setValue(this.expandedInfluencer.lastName);
      this.editInfluencerFormGroup.controls['email'].setValue(this.expandedInfluencer.email);

      this.editInfluencerFormGroup.controls['addresses'].setValue(
        this.expandedInfluencer.addresses
      );
      this.editInfluencerFormGroup.controls['phoneNumber'].setValue(
        this.expandedInfluencer.phoneNumber
      );
      this.editInfluencerFormGroup.controls['serviceType'].setValue(
        this.expandedInfluencer.serviceType?.id || null
      );
      this.editInfluencerFormGroup.controls['id'].disable();
    }
  }
}
