import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  NgClass,
  AsyncPipe,
  registerLocaleData
} from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  OnInit,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CompanyService } from '../../../companies/services/company.service';
import { InfluencerService } from 'app/feature/influencers/services/influencer.service';
import { CollaborationService } from '../../services/collaboration.service';
import { TypeService } from '../../../../core/services/service-type/service-type.service';
import { City } from 'app/feature/influencers/services/influencer.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FuseCardComponent } from '@fuse/components/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Observable, combineLatest, map, Subject } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import localePl from '@angular/common/locales/pl';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CollaborationConfirmPopUpService } from './collaboration-create-pop-up.service';
import { Collaboration, PhotoList } from '../../services/collaboration.types';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LookingUpDataService } from 'app/feature/collaborations/components/collaboration-create/collaboration-create-form/collaboration-form-lookup-data.service';
import { CollaborationValidationService } from 'app/feature/collaborations/components/collaboration-create/collaboration-create-form/collaboration-form-validation.service';
import { CollaborationFormService } from 'app/feature/collaborations/components/collaboration-create/collaboration-create-form/collaboration-form.service';
import { CollaborationCalendarService } from 'app/feature/collaborations/components/collaboration-create/collaboration-create-form/collaboration-calendar.service';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { CategorizedSelectComponent } from 'app/shared/components/ui/select/categorized-select.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { Storage } from '@angular/fire/storage';

import { ImageService } from 'app/core/services/image/image.service';

registerLocaleData(localePl);

@Component({
  selector: 'newCollaboration',
  standalone: true,
  templateUrl: './collaboration-create.component.html',
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useFactory: (transloco: TranslocoService) => transloco.getActiveLang(),
      deps: [TranslocoService]
    }
  ],
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
    TranslocoModule,
    InputComponent,
    SelectComponent,
    CategorizedSelectComponent,
    ButtonComponent
  ],
  styleUrl: 'collaboration-create.styles.css'
})
export class CollaborationCreateComponent implements OnInit {
  formFieldHelpers: string[] = [''];

  id: number;
  collaborations: string[];
  expandedInfluencer: Collaboration | null;
  editNewCollaborationFormGroup: UntypedFormGroup;
  card: any;
  cardForm: UntypedFormGroup;
  collaborationUser: Collaboration;

  list = {
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis placerat, odio nec pellentesque consectetur, libero ligula ultricies diam, a vehicula orci ipsum at ligula. Fusce vulputate, dolor in laoreet egestas, eros ex semper tortor, eu euismod arcu risus vitae urna. Donec porta, metus quis elementum elementum, augue diam mollis orci, nec bibendum quam nulla feugiat nisl. Nam dictum posuere turpis, at mattis nibh finibus vel. Donec consequat gravida leo non laoreet. Morbi placerat imperdiet tristique. Fusce ut arcu ac enim posuere aliquam. Sed sodales facilisis elementum. Integer sollicitudin ornare cursus. Mauris tempus, risus ut ultrices malesuada, arcu tortor congue ante, vel malesuada tellus ante sit amet velit. Phasellus feugiat fringilla vehicula. In at ultricies ante. Aenean euismod accumsan elementum. Vestibulum a nisi dui. Aliquam et nibh quam. Proin lacinia tincidunt turpis a lobortis. In vitae massa porttitor, accumsan metus non, efficitur tortor. Proin aliquam dapibus massa, a aliquet massa. Fusce maximus erat odio. Nulla dictum venenatis nisi, vitae suscipit lectus interdum ac. Etiam dolor sem, faucibus et odio ut, imperdiet fermentum lectus. Nunc porttitor, nisl et congue iaculis, sem leo lobortis enim, ut dignissim metus ipsum nec erat. Nulla pellentesque risus sit amet ante feugiat eleifend. Sed mollis eleifend lacus, nec tempus nibh ullamcorper a. Praesent elementum urna et nisl eleifend congue. Suspendisse quis hendrerit urna. Suspendisse rhoncus, ligula ut fermentum vulputate, quam justo pretium lorem, vitae dapibus urna dolor at magna. Donec viverra, magna ac facilisis ultricies, turpis mi faucibus lectus, sit amet tempus ipsum sem sit amet mauris. Proin ligula nisi, elementum pulvinar maximus eu, semper ac nisl. Etiam venenatis semper quam, vel pellentesque ex tincidunt ut. Donec non pretium sapien. Proin mi arcu, ultricies vitae arcu sed, vehicula laoreet arcu.'
  };

  cityList: City[];
  compensationList: {};

  companyOptions: string[] = [];
  selectedCity = '';
  selectedCompany = '';
  selectedserviceType = '';

  warning = false;
  warningText: 'Przed wysłaniem, proszę uzupełnić wszystkie dane';

  isDisabled = false;
  configForm: UntypedFormGroup;
  companyId = 0;
  searchTerm = '';

  options = ['One', 'Two', 'Three'];
  companyList = [];
  contentItems = [];
  platformList = [];

  filteredServiceTypes!: Observable<string[]>;

  isUploadButtonVisible = false;

  selectedItems: Set<string> = new Set();

  max = 6;
  min = 1;
  showTicks = false;
  thumbLabel = false;

  compensationAmountMin = 2;
  compensationAmountMax = 5;

  markerValues: (string | number)[] = [250, 500, 1000, 2500, 5000, 10000];
  amountFollowers: (string | number)[] = [250, 500, '1 000', '2 500', '5 000', '10 000+'];

  isSliderDisabled = false;
  isEditing: boolean = false;
  length = 100;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20, 50];
  selectedCompanyId!: number;
  selectedServiceTypeId!: number;
  content: false;

  configFormUpdate: UntypedFormGroup;
  photos: PhotoList[] = [];
  userList = [];
  serviceTypeList = [];
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return false;
  }

  contentTypes$ = this._lookingUpDataService.contentTypes$;
  platformList$ = this._lookingUpDataService.platformList$;

  @ViewChild('endDatePicker') endDatePicker: MatDatepicker<any>;

  minDate = new Date();
  maxDate = new Date(2025, 11, 31);
  dateControl = new FormControl(null, [Validators.required]);
  startDateControl = new FormControl(null, Validators.required);
  endDateControl = new FormControl(null, Validators.required);

  textAreaControlRequirements = new FormControl('', [Validators.required]);
  textAreaControlName = new FormControl('', [Validators.required]);
  textAreaControlDetails = new FormControl('', [Validators.required]);
  textAreaControlTitle = new FormControl('', [Validators.required]);

  selectControlcompensationType = new FormControl('', [Validators.required]);
  compensationList$ = this._lookingUpDataService.compensationList$;
  cityControl = new FormControl('', [Validators.required]);
  cityList$ = this._lookingUpDataService.cityList$;
  companyControl = new FormControl('', [Validators.required]);
  userList$ = this._lookingUpDataService.userList$;
  serviceTypeControl = new FormControl('', [Validators.required]);
  serviceType$ = this._lookingUpDataService.serviceType$;

  companyList$ = this._lookingUpDataService.companyList$;

  profilImageControl = new FormControl('', [Validators.required]);
  imageControl = new FormControl('', [Validators.required]);

  selectCurrenciesControl = new FormControl('PLN', [Validators.required]);
  selectCurrenciesBarter = new FormControl('', [Validators.required]);

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  imageUrl: string | null = null;
  // imageSrc: string = 'assets/detale_kampanii_v4_files/cover.jpg';

  selectedFile: File | null = null;

  @Input() acceptedFileTypes: string = 'image/*';
  @Input() control!: FormControl;
  @Output() change = new EventEmitter<any>();
  previewUrl: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _companyService: CompanyService,
    private _collaborationService: CollaborationService,
    private _influencerService: InfluencerService,
    private _typeService: TypeService,

    private _fuseConfirmationService: FuseConfirmationService,
    private _cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private _translocoService: TranslocoService,
    private _confirmPopUpService: CollaborationConfirmPopUpService,
    public _lookingUpDataService: LookingUpDataService,
    public _validateCollaborationData: CollaborationValidationService,
    public _collaborationFormService: CollaborationFormService,
    public _collaborationCalendarService: CollaborationCalendarService,
    private translocoService: TranslocoService,
    private dateAdapter: DateAdapter<any>,
    private _imageService: ImageService,
    private storage: Storage
  ) {
    this.editNewCollaborationFormGroup = this._collaborationFormService.createForm();
    this.setDateLocale();

    this.editNewCollaborationFormGroup = this.fb.group({
      imageUrl: [''],
      contentTypes: this.fb.array([]),
      platforms: this.fb.array([])
    });
  }

  setDateLocale(): void {
    this.translocoService.langChanges$.subscribe(lang => {
      this.dateAdapter.setLocale(lang);
    });
  }

  ngAfterViewInit(): void {}

  onImageUpload() {
    const imageUrl = this.editNewCollaborationFormGroup.get('imageUrl')?.value;
    console.log('URL przesłanego obrazu:', imageUrl);

    this.imageUrl = imageUrl;
  }

  ngOnInit(): void {
    this.getProfilPhoto();

    this.profilImageControl.disable();

    this._confirmPopUpService.configForm$.subscribe(form => {
      this.configFormUpdate = form;
    });
  }

    this._validateCollaborationData.warningChanged.subscribe(newWarningState => {
      this.warning = newWarningState;
    });

    this._lookingUpDataService.setFormGroup(this.editNewCollaborationFormGroup);
    this._lookingUpDataService.getServiceTypeList();
    this._lookingUpDataService.getContentType();
    this._lookingUpDataService.getPlatform();
    this._lookingUpDataService.getCityList();
    this._lookingUpDataService.getCompensationType();
    this._lookingUpDataService.getUserCompany();
    // this._lookingUpDataService.getCompany();
  }

  //=====================================

  currencies = [
    { label: 'PLN', value: 'PLN', symbol: 'zł' },
    { label: 'EUR', value: 'EUR', symbol: '€' },
    { label: 'USD', value: 'USD', symbol: '$' }
  ];

  categoryControl = new FormControl('');

  categoryOptions: string[] = [];

  isCategorySelected = false;

  onCategoryReset() {
    this.isCategorySelected = false;
    this.categoryOptions = [];
    this.categoryControl.reset();
  }

  showResultCash = false;
  showResultBarter = false;

  switchResult(event: any): void {
    switch (event) {
      case 'CASH':
        this.showResultCash = true;
        this.showResultBarter = false;
        break;
      case 'BARTER':
        this.showResultCash = false;
        this.showResultBarter = true;
      default:
        return;
    }
  }

  getProfilPhoto() {
    combineLatest([this.userList$, this.companyControl.valueChanges])
      .pipe(distinctUntilChanged())
      .subscribe(([userList, selectedValue]) => {
        const selectedUser = userList.find(user => user.value === selectedValue);

        console.log('userList:', userList);
        console.log('selectedValue:', selectedValue);

        console.log('selectedUser:', selectedUser);

        if (!selectedUser) {
          this.profilImageControl.setValue(null);
          return;
        }

        this.profilImageControl.reset();
        setTimeout(() => {
          this.profilImageControl.setValue(selectedUser.value);
        });
      });
  }

  result(value: number): string {
    const label = this.markerValues[value - 1];

    return typeof label === 'number' ? label.toString() : label ?? '';
  }

  onCompanyChange(company: any): void {
    this.selectedCompanyId = company.id;

    this.editNewCollaborationFormGroup.get('company')?.setValue(company?.company?.name);
  }

  onServiceTypeChange(serviceType: any): void {
    this.selectedServiceTypeId = serviceType.id;

    this.editNewCollaborationFormGroup.get('serviceType')?.setValue(serviceType.name);
  }

  createCollaboration(resultMin: any, resultMax: any) {
    const collaboration = this.getCollaborationFormData(resultMin, resultMax);

    this._validateCollaborationData.validateCollaborationData(collaboration);

    this._collaborationService.createCollaboration(collaboration).subscribe({
      next: collabo => this.handleSuccessfulCreation(collabo),
      error: error => console.error('Error with influencer update:', error.error.message)
    });
  }

  private getCollaborationFormData(resultMin: any, resultMax: any): Collaboration {
    const collaboration: Collaboration = this.editNewCollaborationFormGroup.getRawValue();

    const currentTime = this._collaborationCalendarService.setCurrentTime();
    collaboration.photos = [
      {
        url: this.imageUrl,
        orderNumber: 1,
        isCover: true
      }
    ];

    collaboration.compensationAmountMin = resultMin;
    collaboration.compensationAmountMax = resultMax;
    collaboration.compensationType = this.selectControlcompensationType.value;
    collaboration.city = this.cityControl.value;
    collaboration.requirements = this.textAreaControlRequirements.value;
    collaboration.name = this.textAreaControlName.value;
    collaboration.details = this.textAreaControlDetails.value;
    collaboration.title = this.textAreaControlTitle.value;
    collaboration.company = Number(this.companyControl.value);
    collaboration.serviceType = Number(this.serviceTypeControl.value);

    collaboration.contentTypes =
      this.editNewCollaborationFormGroup.get('contentTypes')?.value || [];
    collaboration.platforms = this.editNewCollaborationFormGroup.get('platforms')?.value || [];

    collaboration.startDate = this._collaborationCalendarService.formatDate(
      this.startDateControl.value,
      currentTime
    );
    collaboration.endDate = this._collaborationCalendarService.formatDate(
      this.endDateControl.value,
      currentTime
    );

    console.log('wysłanie collaboration:', collaboration);
    return collaboration;
  }

  private handleSuccessfulCreation(collabo: any): void {
    this.collaborationUser = collabo;
    this.warning = false;
    this.openConfirmationDialog();

    this._lookingUpDataService.getCityList();
    this._lookingUpDataService.getServiceTypeList();
    this._lookingUpDataService.getContentType();
    this._lookingUpDataService.getPlatform();
    this._cdRef.detectChanges();
  }

  openConfirmationDialog(): void {
    this._confirmPopUpService.popUpConfirmation();

    const dialogRef = this._fuseConfirmationService.open(this.configFormUpdate.value);

    setTimeout(() => {
      dialogRef.close();
    }, 3000);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  toggleChip(type: 'contentTypes' | 'platforms', item: any): void {
    this._lookingUpDataService.toggleChip(type, item);
  }

  getTooltipText(type: 'contentTypes' | 'platforms', item: any) {
    return this._lookingUpDataService.getTooltipText(type, item);
  }

  goBackToMain(): void {
    this.router.navigate(['/collaborations']);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
