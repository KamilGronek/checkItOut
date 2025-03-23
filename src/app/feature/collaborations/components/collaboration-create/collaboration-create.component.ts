import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangeDetectorRef, Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { Router } from '@angular/router';

import { Inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { InfluencerService } from 'app/feature/influencers/services/influencer.service';
import { CollaborationService } from '../../services/collaboration.service';
import { Collaboration } from '../../services/collaboration.types';
import { TypeService } from '../../../../core/services/service-type/service-type.service';
import { City } from 'app/feature/influencers/services/influencer.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FuseCardComponent } from '@fuse/components/card';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

import { ErrorStateMatcher } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { response } from 'express';

import { User, UserContent } from 'app/feature/collaborations/services/collaboration.types';

registerLocaleData(localePl);

@Component({
  selector: 'newCollaboration',
  standalone: true,
  templateUrl: './collaboration-create.component.html',
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
    NgClass,
    MatProgressBarModule,
    CurrencyPipe,
    DatePipe,
    FuseCardComponent,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatSliderModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatPaginator,
    TranslocoModule
  ],
  styleUrls: ['collaboration-create.styles.css']
})
export class CollaborationCreateComponent implements OnInit {
  formFieldHelpers: string[] = [''];

  id: number;
  collaborations: string[];
  selectedFile: File | null = null;
  imageUrl: string | null = null;

  expandedInfluencer: Collaboration | null;
  editNewCollaborationFormGroup: FormGroup;

  card: any;
  cardForm: FormGroup;
  collaborationUser: Collaboration;

  list = {
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis placerat, odio nec pellentesque consectetur, libero ligula ultricies diam, a vehicula orci ipsum at ligula. Fusce vulputate, dolor in laoreet egestas, eros ex semper tortor, eu euismod arcu risus vitae urna. Donec porta, metus quis elementum elementum, augue diam mollis orci, nec bibendum quam nulla feugiat nisl. Nam dictum posuere turpis, at mattis nibh finibus vel. Donec consequat gravida leo non laoreet. Morbi placerat imperdiet tristique. Fusce ut arcu ac enim posuere aliquam. Sed sodales facilisis elementum. Integer sollicitudin ornare cursus. Mauris tempus, risus ut ultrices malesuada, arcu tortor congue ante, vel malesuada tellus ante sit amet velit. Phasellus feugiat fringilla vehicula. In at ultricies ante. Aenean euismod accumsan elementum. Vestibulum a nisi dui. Aliquam et nibh quam. Proin lacinia tincidunt turpis a lobortis. In vitae massa porttitor, accumsan metus non, efficitur tortor. Proin aliquam dapibus massa, a aliquet massa. Fusce maximus erat odio. Nulla dictum venenatis nisi, vitae suscipit lectus interdum ac. Etiam dolor sem, faucibus et odio ut, imperdiet fermentum lectus. Nunc porttitor, nisl et congue iaculis, sem leo lobortis enim, ut dignissim metus ipsum nec erat. Nulla pellentesque risus sit amet ante feugiat eleifend. Sed mollis eleifend lacus, nec tempus nibh ullamcorper a. Praesent elementum urna et nisl eleifend congue. Suspendisse quis hendrerit urna. Suspendisse rhoncus, ligula ut fermentum vulputate, quam justo pretium lorem, vitae dapibus urna dolor at magna. Donec viverra, magna ac facilisis ultricies, turpis mi faucibus lectus, sit amet tempus ipsum sem sit amet mauris. Proin ligula nisi, elementum pulvinar maximus eu, semper ac nisl. Etiam venenatis semper quam, vel pellentesque ex tincidunt ut. Donec non pretium sapien. Proin mi arcu, ultricies vitae arcu sed, vehicula laoreet arcu.'
  };

  cityList: City[];
  cityOptions: string[] = [];

  companyOptions: string[] = [];

  selectedCity = '';
  selectedCompany = '';
  selectedserviceType = '';

  warning = false;
  warningText: 'Przed wysłaniem, proszę uzupełnić wszystkie dane';

  isDisabled = false;
  configForm: FormGroup;
  companyId = 0;
  searchTerm = '';

  options = ['One', 'Two', 'Three'];
  companyList = [];
  serviceTypeList = [];
  contentItems = [];
  platformList = [];

  filteredCompanies!: Observable<string[]>;
  filteredServiceTypes!: Observable<string[]>;

  isUploadButtonVisible = false;

  selectedItems: Set<string> = new Set();

  disabled = true;
  max = 6;
  min = 1;
  showTicks = false;
  thumbLabel = false;

  compensationAmountMin = 2;
  compensationAmountMax = 5;

  markerValues: (string | number)[] = [250, 500, 1000, 2500, 5000, 10000];

  amountFollowers: (string | number)[] = [250, 500, '1 000', '2 500', '5 000', '10 000+'];

  isEditing: boolean = false;

  length = 100;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20, 50];
  selectedCompanyId!: number;
  selectedServiceTypeId!: number;

  userList = [];

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return false;
  }

  @ViewChild('endDatePicker') endDatePicker: MatDatepicker<any>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _collaborationService: CollaborationService,
    private _influencerService: InfluencerService,
    private _typeService: TypeService,

    private _fuseConfirmationService: FuseConfirmationService,
    private _cdRef: ChangeDetectorRef
  ) {
    this.editNewCollaborationFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      details: ['', [Validators.required]],
      title: ['', [Validators.required]],
      requirements: ['', [Validators.required]],
      compensationType: ['', [Validators.required]],
      compensationAmountMin: ['', [Validators.required]],
      compensationAmountMax: ['', [Validators.required]],
      company: ['', [Validators.required]],
      platforms: ['', [Validators.required]],
      contentTypes: ['', [Validators.required]],
      serviceType: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.editNewCollaborationFormGroup.get('company')?.valueChanges.subscribe(value => {
      console.log('Company field value changed:', value);
    });

    this.editNewCollaborationFormGroup.get('serviceType')?.valueChanges.subscribe(value => {
      console.log('serviceType field value changed:', value);
    });

    this.configForm = this.fb.group({
      title: 'Dodałeś nową wspołpracę',
      message: 'Nowa współpraca jest widoczna na głównej stronie<span class="font-medium"></span>',
      icon: this.fb.group({
        show: true,
        name: 'heroicons_outline:bell-alert',
        color: 'success'
      }),
      actions: this.fb.group({
        confirm: this.fb.group({
          show: true,
          label: 'Ok',
          color: 'primary'
        }),
        cancel: this.fb.group({
          show: true,
          label: 'Powrót'
        })
      }),
      dismissible: true
    });

    this.card = {
      startDate: null,
      endDate: null
    };

    this.getCityList();
    this.getServiceTypeList();
    this.getContentType();
    this.getPlatform();
    this.getUser();

    this.filteredCompanies = this.editNewCollaborationFormGroup.get('company')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCompanies(value || ''))
    );

    this.filteredServiceTypes = this.editNewCollaborationFormGroup
      .get('serviceType')!
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filterServiceTypes(value || ''))
      );
  }

  getTooltipText(platform: any): string {
    return ` ${platform.name}`;
  }

  toggleChip(type: 'contentTypes' | 'platforms', item: any) {
    console.log('item:', item);

    item.active = !item.active;

    let currentValues = this.editNewCollaborationFormGroup.get(type)?.value || [];

    if (item.active) {
      currentValues.push(item.id);
    } else {
      currentValues = currentValues.filter((id: string) => id !== item.id);
    }

    this.editNewCollaborationFormGroup.patchValue({
      [type]: currentValues
    });

    console.log(`Updated ${type}:`, currentValues);
  }

  onStartSliderChange(event: any) {
    console.log('Start value changed to:', event.target.value);
    this.compensationAmountMin = event.target.value;
  }

  onEndSliderChange(event: any) {
    console.log('End value changed to:', event.target.value);
    this.compensationAmountMax = event.target.value;
  }

  result(value: number): string {
    const label = this.markerValues[value - 1];

    return typeof label === 'number' ? label.toString() : label ?? '';
  }

  private _filterCompanies(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.userList.filter(
      user => user?.company?.name?.toLowerCase().includes(filterValue) ?? false
    );
  }

  private _filterServiceTypes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.serviceTypeList.filter(serviceType =>
      serviceType.name.toLowerCase().includes(filterValue)
    );
  }

  onCompanyChange(company: any): void {
    console.log('company:', company.id);

    this.selectedCompanyId = company.id;

    this.editNewCollaborationFormGroup.get('company')?.setValue(company.company?.name);
  }

  onServiceTypeChange(serviceType: any): void {
    this.selectedServiceTypeId = serviceType.id;

    this.editNewCollaborationFormGroup.get('serviceType')?.setValue(serviceType.name);
  }

  createCollaboration(resultMin: any, resultMax: any) {
    const collaboration = this.getCollaborationFormData(resultMin, resultMax);

    if (!this.validateCollaborationData(collaboration)) {
      this.warning = true;
      return;
    }

    this._collaborationService.createCollaboration(collaboration).subscribe({
      next: collabo => {
        this.resetCollaborationForm();
        this.handleSuccessfulCreation(collabo);
      },
      error: error => console.error('Error with influencer update:', error.error.message)
    });
  }

  private getCollaborationFormData(resultMin: any, resultMax: any): Collaboration {
    const collaboration: Collaboration = this.editNewCollaborationFormGroup.getRawValue();

    collaboration.compensationAmountMin = resultMin;
    collaboration.compensationAmountMax = resultMax;

    collaboration.company = this.selectedCompanyId;
    collaboration.serviceType = this.selectedServiceTypeId;

    collaboration.startDate = collaboration.startDate?.toString()?.substring(0, 19);
    collaboration.endDate = collaboration.endDate?.toString()?.substring(0, 19);

    console.log('wysłanie collaboration:', collaboration);

    return collaboration;
  }

  private validateCollaborationData(collaboration: Collaboration): boolean {
    const requiredFields = ['name', 'requirements', 'compensationType', 'startDate', 'endDate'];

    const isMissingField = requiredFields.some(field => !collaboration[field]);

    if (isMissingField) {
      this.warning = true;
      console.warn('Niektóre wymagane pola są puste.');
      return false;
    }

    return true;
  }

  private resetCollaborationForm(): void {
    this.editNewCollaborationFormGroup.patchValue({
      name: '',
      city: '',
      details: '',
      title: '',
      requirements: '',
      compensationType: '',
      company: '',
      serviceType: '',
      startDate: '',
      endDate: ''
    });
  }

  private handleSuccessfulCreation(collabo: any): void {
    this.collaborationUser = collabo;
    this.warning = false;
    this.openConfirmationDialog();
    this.clearStartDate();
    this.clearEndDate();

    this.getCityList();
    this.getServiceTypeList();
    this.getContentType();
    this.getPlatform();
    this.getUser();

    this._cdRef.detectChanges();
  }

  openConfirmationDialog(): void {
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    setTimeout(() => {
      dialogRef.close();
    }, 3000);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  private async getCityList(): Promise<void> {
    this._influencerService.getInfluencerCityList().subscribe({
      next: response => {
        this.cityList = response;
        this.cityOptions = this.cityList.map(city => city.name);
      },
      error: error => {
        console.error('Error fetching influencer list', error);
      }
    });
  }

  private async getUser(): Promise<void> {
    this._collaborationService.getUser().subscribe({
      next: (response: User) => {
        this.userList = response.content;
        console.log('User list:', this.userList);
      },
      error: error => {
        console.error('Error fetching user list:', error);
      }
    });
  }

  private async getServiceTypeList(): Promise<void> {
    this._typeService.getServiceTypeList().subscribe({
      next: response => {
        this.serviceTypeList = response;
      },
      error: error => {
        console.error('Error fetching influencer list', error);
      }
    });
  }

  private getContentType(): void {
    this._collaborationService.getCollaborationContentType().subscribe({
      next: response => {
        this.contentItems = response.content;
      },
      error: error => {
        console.error('Error fetching content type:', error);
      }
    });
  }

  private getPlatform(): void {
    this._collaborationService.getCollaborationPlatform().subscribe({
      next: response => {
        this.platformList = response.content;

        console.log('platformList:', this.platformList);
      },
      error: error => {
        console.error('Error fetching content type:', error);
      }
    });
  }

  onCityChange(event: MatSelectChange): void {
    this.selectedCity = event.value;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // const selectedFile = input.files[0];

      this.imageUrl = URL.createObjectURL(this.selectedFile);
    }

    this.isUploadButtonVisible = true;
  }

  goBackToMain(): void {
    this.router.navigate(['/collaborations']);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   *
   * @param listTitleInput
   */
  renameList(listTitleInput: HTMLElement): void {
    setTimeout(() => {
      listTitleInput.focus();
    });
  }

  updateListTitle(event: any): void {
    const element: HTMLInputElement = event.target;
    const newTitle = element.value;
    if (!newTitle || newTitle.trim() === '') {
      return;
    }
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  isOverdue(date: string): boolean {
    return DateTime.fromISO(date).startOf('day') < DateTime.now().startOf('day');
  }

  startDateSelected(): void {
    const selectedDate = this.editNewCollaborationFormGroup.get('startDate')?.value;
    this.card.startDate = selectedDate;

    this.endDatePicker.open();
  }

  endDateSelected(): void {
    const selectedDate2 = this.editNewCollaborationFormGroup.get('endDate')?.value;
    this.card.endDate = selectedDate2;
  }

  clearStartDate(): void {
    this.editNewCollaborationFormGroup.get('startDate')?.setValue(null);
    this.card.startDate = null;
  }

  clearEndDate(): void {
    this.editNewCollaborationFormGroup.get('endDate')?.setValue(null);
    this.card.endDate = null;
  }
}
