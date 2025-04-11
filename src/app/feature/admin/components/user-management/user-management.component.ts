import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { CardComponent } from 'app/shared/components/ui/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import {
  AccountStatus,
  User,
  UserSearchParams,
  UserType
} from 'app/feature/users/services/user.types';
import { UserService } from 'app/feature/users/services/user.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SnackbarService } from 'app/core/services/custom-snackbar/custom-snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    TranslocoModule,
    SelectComponent,
    InputComponent,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './user-management.component.html'
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'userType', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  filterForm: FormGroup;

  // Pagination
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  pageIndex = 0;
  totalItems = 0;

  // Sorting
  sortField = 'id';
  sortDirection = 'asc';

  // User type options
  userTypeOptions = [
    { label: 'All Types', value: '' },
    { label: 'Admin', value: UserType.ADMIN },
    { label: 'Company', value: UserType.COMPANY },
    { label: 'Influencer', value: UserType.INFLUENCER }
  ];

  // Status options
  statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Active', value: AccountStatus.ACTIVE },
    { label: 'In Validation', value: AccountStatus.IN_VALIDATION },
    { label: 'Inactive', value: AccountStatus.INACTIVE },
    { label: 'To Be Deleted', value: AccountStatus.TO_BE_DELETED },
    { label: 'Deleted', value: AccountStatus.DELETED }
  ];

  isLoading = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _confirmationService: FuseConfirmationService,
    private _snackbarService: SnackbarService,
    private _dialog: MatDialog
  ) {
    this.filterForm = this._formBuilder.group({
      search: [''],
      userType: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    // Subscribe to filter changes
    this.filterForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.pageIndex = 0;
      this.loadUsers();
    });
  }

  ngAfterViewInit() {
    // Initialize sort
    this.dataSource.sort = this.sort;

    // Sort change
    this.sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(sort => {
      this.sortField = sort.active;
      this.sortDirection = sort.direction;
      this.pageIndex = 0;
      this.loadUsers();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   * Load users with current filters and pagination
   */
  loadUsers(): void {
    this.isLoading = true;

    const params: UserSearchParams = {
      page: this.pageIndex,
      size: this.pageSize,
      sort: `${this.sortField},${this.sortDirection || 'asc'}`
    };

    // Add filters if set
    const searchTerm = this.filterForm.get('search').value;
    if (searchTerm) {
      // Determine if search is likely an email
      if (searchTerm.includes('@')) {
        params.email = searchTerm;
      } else {
        // We don't know if it's first or last name, so use what the API supports
        params.firstName = searchTerm;
      }
    }

    if (this.filterForm.get('userType').value) {
      params.userType = this.filterForm.get('userType').value;
    }

    if (this.filterForm.get('status').value) {
      params.accountStatus = this.filterForm.get('status').value;
    }

    this._userService
      .getUsers(params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: response => {
          this.users = response.content;
          this.dataSource.data = this.users;
          this.totalItems = response.page.totalElements;
          this.isLoading = false;
        },
        error: error => {
          console.error('Error loading users:', error);
          this._snackbarService.showFailure('Failed to load users');
          this.isLoading = false;
        }
      });
  }

  /**
   * Handle page changes
   */
  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadUsers();
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      userType: '',
      status: ''
    });
    this.pageIndex = 0;
    this.loadUsers();
  }

  /**
   * Edit user
   */
  editUser(user: User): void {
    const dialogRef = this._dialog.open(UserEditDialogComponent, {
      width: '600px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._userService
          .updateUser(user.id, result)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next: () => {
              this.loadUsers();
            }
          });
      }
    });
  }

  /**
   * Change user status
   */
  changeStatus(user: User, status: AccountStatus): void {
    this._userService
      .updateUser(user.id, { accountStatus: status })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.loadUsers();
        }
      });
  }

  /**
   * Delete user
   */
  deleteUser(user: User): void {
    this._confirmationService
      .open({
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
        actions: {
          confirm: {
            label: 'Delete'
          }
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (result === 'confirmed') {
          this._userService
            .deleteUser(user.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: () => {
                this.loadUsers();
              }
            });
        }
      });
  }

  /**
   * View user details
   */
  viewUserDetails(user: User): void {
    // Navigate to user details page
    // this._router.navigate(['/admin/users', user.id]);
  }

  /**
   * Get user type badge class
   */
  getUserTypeBadgeClass(userType: UserType): string {
    switch (userType) {
      case UserType.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case UserType.COMPANY:
        return 'bg-blue-100 text-blue-800';
      case UserType.INFLUENCER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: AccountStatus): string {
    switch (status) {
      case AccountStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case AccountStatus.IN_VALIDATION:
        return 'bg-amber-100 text-amber-800';
      case AccountStatus.INACTIVE:
        return 'bg-red-100 text-red-800';
      case AccountStatus.TO_BE_DELETED:
        return 'bg-gray-100 text-gray-800';
      case AccountStatus.DELETED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
