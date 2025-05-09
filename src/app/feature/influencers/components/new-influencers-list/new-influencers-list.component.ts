import { CommonModule, DatePipe } from '@angular/common';
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
  ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Influencer,
  InfluencerUser,
  InfluencerUserResponse
} from 'app/feature/influencers/services/influencer.types';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Observable, Subject } from 'rxjs';

import { InfluencerService } from 'app/feature/influencers/services/influencer.service';
import { LookingUpUserDataService } from 'app/feature/influencers/components/new-influencers-list/details-looku-data.service';
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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoService } from '@ngneat/transloco';

import { Column } from '../../../../shared/components/ui/table/table.types';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';

@Component({
  selector: 'new-influencers-list',
  standalone: true,
  templateUrl: './new-influencers-list.component.html',
  styleUrl: './new-influencers-list.styles.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
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
    TranslocoModule,
    TableComponent,
    SelectComponent
  ]
})
export class newInfluencersListComponent implements OnInit, AfterViewInit, OnDestroy {
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
    'accountStatus'
  ];
  columnsToDisplayWithExpand: string[] = [...this.influencersTableColumns, 'expand'];

  tableColumns: Column[] = [
    { key: 'id', label: 'admin.new_influencers.table_headers.id' },
    { key: 'firstName', label: 'admin.new_influencers.table_headers.first_name' },
    { key: 'lastName', label: 'admin.new_influencers.table_headers.last_name' },
    //l{ key: 'city', label: 'admin.new_influencers.table_headers.city' },
    { key: 'address', label: 'admin.new_influencers.table_headers.address' },
    { key: 'email', label: 'admin.new_influencers.table_headers.email' }
  ];

  expandedUser: InfluencerUser | null;

  formLaunched: boolean = false;
  editformLaunched: boolean = false;
  idOfEditedUser: number;
  flashMessage: 'success' | 'error' | null = null;

  editUserFormGroup: UntypedFormGroup;

  influencerList: InfluencerUser[] = [];
  InfluencerResponse: { Influencer: any };
  dataSource: MatTableDataSource<InfluencerUser>;

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

  typeAccountOptions: string[] = [];
  typeStatus: string[] = [];

  private _snackBar = inject(MatSnackBar);

  statusControl = new FormControl('', [Validators.required]);
  statusList$ = this._LookingUpUserDataService.statusList$;
  editingUserId!: number;

  typeControl = new FormControl('', [Validators.required]);
  typeList$ = this._LookingUpUserDataService.typeList$;

  constructor(
    private _influencerService: InfluencerService,
    private _formBuilder: UntypedFormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private translocoService: TranslocoService,
    public _LookingUpUserDataService: LookingUpUserDataService
  ) {
    this.editUserFormGroup = this.fb.group({
      id: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      instagramId: ['', [Validators.required]],
      followersAmount: ['1', [Validators.required]],
      accountStatus: ['', [Validators.required]],
      noteFromAdmin: [],
      userType: ['', [Validators.required]],
      instagramAccountType: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    if (this.dataSource) this.dataSource.paginator = this.paginator;

    this.dataSource = new MatTableDataSource<InfluencerUser>(this.influencerList);
  }

  ngOnInit(): void {
    this.loadInfluencers(this.pageIndex);
    this._LookingUpUserDataService.getAccountType();
    this._LookingUpUserDataService.getStatus();
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
        next: (response: InfluencerUserResponse) => {
          this.length = response.totalElements;
          this.pageIndex = response.number;
          this.paginator.length = response.totalElements;
          this.paginator.pageIndex = response.number;
          this.paginator.pageSize = response.size;

          this.dataSource.data = response.content;
          console.log('response.content:', response.content);

          this.snackbarService.showSuccess('Dane użytkowników pobrane');
        },
        error: error => {
          console.error('Error fetching influencer list', error);
          this.snackbarService.showFailure('Coś poszło nie tak');
        }
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  onUserRowToggled(user: any): void {
    this.editingUserId = user.id;
    this.typeControl.setValue(user.userType);
    this.statusControl.setValue(user.accountStatus);
  }

  sendToInfluencer(userId: number): void {
    console.log('getUserToUpdate:', this.getUserToUpdate(userId));

    this._influencerService.updateInfluencerUser(this.getUserToUpdate(userId), userId).subscribe({
      next: (updatedUser: InfluencerUser) => {
        const idToUpdate: number = this.dataSource.data.findIndex(
          user => user.id === updatedUser.id
        );
        console.log('updatedUser.id:', updatedUser.id);

        this.dataSource.data[idToUpdate].accountStatus = updatedUser.accountStatus;
        this.dataSource.data[idToUpdate].influencer = updatedUser.influencer;

        this.fillEditForm();
        const message = this.translocoService.translate(
          'admin.new_influencers.snackbarServiceText'
        );
        this.snackbarService.showSuccess(message);
      },
      error: error => {
        console.error('Error updating user', error);
        this.snackbarService.showFailure('Failed to update user');
      }
    });
  }

  getUserToUpdate(userId: number): InfluencerUser {
    const userToUpdate = this.dataSource.data.find(user => user.id === userId);

    console.log('userToUpdate,', userToUpdate);

    if (!userToUpdate) {
      this.snackbarService.showFailure('User not found in dataSource');
      return null;
    }

    console.log('firstName,', this.editUserFormGroup.get('firstName').value);

    const updatedUser: InfluencerUser = {
      ...userToUpdate,
      accountStatus: this.statusControl.value,
      userType: this.typeControl.value
    };

    return updatedUser;
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

  getExpandedUser(): InfluencerUser {
    return this.expandedUser;
  }

  fillEditForm(): void {
    if (this.expandedUser != null) {
      this.editUserFormGroup.controls['id'].setValue(this.expandedUser.influencer.id);
      this.editUserFormGroup.controls['firstName'].setValue(this.expandedUser.firstName);
      this.editUserFormGroup.controls['lastName'].setValue(this.expandedUser.lastName);
      this.editUserFormGroup.controls['email'].setValue(this.expandedUser.email);
      this.editUserFormGroup.controls['city'].setValue(this.expandedUser.influencer.city);
      this.editUserFormGroup.controls['instagramId'].setValue(
        this.expandedUser.influencer.instagramId
      );
      this.editUserFormGroup.controls['followersAmount'].setValue(
        this.expandedUser.influencer.followersAmount
      );
      this.editUserFormGroup.controls['instagramAccountType'].setValue(
        this.expandedUser.influencer.instagramAccountType
      );
      this.editUserFormGroup.controls['accountStatus'].setValue(this.expandedUser.accountStatus);
      this.editUserFormGroup.controls['noteFromAdmin'].setValue(
        this.expandedUser.influencer.noteFromAdmin
      );
      this.editUserFormGroup.controls['id'].disable();
    }
  }
}
