import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';

import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FuseCardComponent } from '@fuse/components/card';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

import { Collaboration, CollaborationResponse } from '../../services/collaboration.types';
import { CollaborationService } from '../../services/collaboration.service';
import { InfluencerService } from 'app/feature/influencers/services/influencer.service';
import { MatSelectModule } from '@angular/material/select';
import { City, Influencer } from 'app/feature/influencers/services/influencer.types';

import { AsyncPipe } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { OnInit } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoService } from '@ngneat/transloco';
import { CollaborationConfirmPopUpService } from './collaboration-details-pop-up.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CollaborationFormService } from 'app/feature/collaborations/components/collaboration-create/collaboration-create-form/collaboration-form.service';
import { InputComponent } from 'app/shared/components/ui/input/input.component';
import { SelectComponent } from 'app/shared/components/ui/select/select.component';
import { LookingUpEditDataService } from 'app/feature/collaborations/components/collaboration-details/collaboration-details-form/collaboration-details-lookup-data.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CollaborationEditService } from 'app/feature/collaborations/components/collaboration-details/collaboration-details-form/collaboration-edit.service';

@Component({
  selector: 'collaborationsId',
  standalone: true,
  templateUrl: './collaboration-details.component.html',

  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useFactory: (transloco: TranslocoService) => transloco.getActiveLang(),
      deps: [TranslocoService]
    },
    provideNativeDateAdapter()
  ],
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
    NgClass,
    MatProgressBarModule,
    CurrencyPipe,
    DatePipe,
    FuseCardComponent,
    MatDatepickerModule,
    JsonPipe,
    MatNativeDateModule,
    MatSelectModule,
    AsyncPipe,
    MatSliderModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTooltipModule,
    TranslocoModule,
    InputComponent,
    SelectComponent
  ],
  styleUrl: 'collaboration-details.styles.css'
})
export class CollaborationsDetailComponent implements OnInit {
  selectedItems: Set<string> = new Set();

  formFieldHelpers: string[] = [''];

  id: number;
  influencerList: Influencer[];
  collaboration = {};
  // serviceType = {};
  serviceType = '';

  card: any;
  cardForm: UntypedFormGroup;

  expandedInfluencer: Collaboration | null;

  editCollaborationFormGroup: UntypedFormGroup;

  collaborationList: Collaboration[] = [];

  isLoading: boolean = true;
  error: string | null = null;
  configForm: UntypedFormGroup;
  configFormUpdate: UntypedFormGroup;

  isInputActive: boolean = false;

  collaborationUser: Collaboration;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  isEditing: boolean = false;

  selectedCity: string = '';
  cityList: City[];

  disabled = true;
  max = 6;
  min = 1;

  compensationAmountMin = 0;
  compensationAmountMax = 0;

  prevAmountMin = 0;
  prevAmountMax = 0;

  compensationRead = true;

  markerValues: (string | number)[] = [250, 500, 1000, 2500, 5000, 10000];

  contentTypesList: { id: number; name: string }[] = [];
  platformsList: { id: number; name: string }[] = [];

  contentTypeSend: boolean = true;
  platformSend: boolean = true;

  amountFollowers: (string | number)[] = [250, 500, '1 000', '2 500', '5 000', '10 000+'];

  contentItems: string[] = [];
  isSliderDisabled = false;
  collaborationId!: number;
  compensationList: {};

  minDate = new Date();
  maxDate = new Date(2025, 11, 31);
  dateControl = new FormControl(null, [Validators.required]);
  startDateControl = new FormControl(null, Validators.required);
  endDateControl = new FormControl(null, Validators.required);

  cityControl = new FormControl('', [Validators.required]);
  cityList$ = this._lookingUpEditDataService.cityList$;

  compensationTypeControl = new FormControl('', [Validators.required]);
  compensationList$ = this._lookingUpEditDataService.compensationList$;

  collaboration$ = this._lookingUpEditDataService.collaboration$;
  // prevAmountMin$ = this._lookingUpEditDataService.prevAmountMin$;

  requirementsControl = new FormControl('', [Validators.required]);
  campaignDetailsControl = new FormControl('', [Validators.required]);
  nameControl = new FormControl('', [Validators.required]);

  collaborationList$ = this._lookingUpEditDataService.collaborationList$;
  imageControl = new FormControl('', [Validators.required]);

  imageUrl: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _collaborationService: CollaborationService,
    private _cdRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _influencerService: InfluencerService,
    private translocoService: TranslocoService,
    private _confirmPopUpService: CollaborationConfirmPopUpService,
    public _collaborationFormService: CollaborationFormService,
    public _lookingUpEditDataService: LookingUpEditDataService,
    private dateAdapter: DateAdapter<any>,
    private _collaborationEditService: CollaborationEditService
  ) {
    this.editCollaborationFormGroup = this._collaborationFormService.createForm();
    this.setDateLocale();
  }

  setDateLocale(): void {
    this.translocoService.langChanges$.subscribe(lang => {
      this.dateAdapter.setLocale(lang);
    });
  }

  /**
   *
   * @param dueDate
   * @returns true,
   */

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  ngOnInit(): void {
    this.cityControl.valueChanges.subscribe(value => {
      console.log('Wybrane miasto:', value);
    });

    // this._lookingUpEditDataService.getCollaborationList();
    this.getCollaborationList();

    this._lookingUpEditDataService.getCityList();
    this._lookingUpEditDataService.getCompensationType();

    this._confirmPopUpService.configForm$.subscribe(form => {
      this.configForm = form;
      this.configFormUpdate = form;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.collaborationId = +id;
        this.getCollaborationId(this.collaborationId);

        // this._lookingUpEditDataService.getCollaborationId(this.collaborationId);

        console.log('this.collaborationId:', this.collaborationId);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.imageUrl = params['imageUrl'];
      console.log('Odebrany imageUrl z queryParams:', this.imageUrl);
    });
  }

  ngAfterViewInit(): void {}

  getTooltipText(platform: any): string {
    return platform.disabled ? `${platform.name} - ${platform.title}` : `${platform.name}`;
  }

  compensationAmount(value: number) {
    const amount = this.markerValues[value - 1];

    return typeof amount === 'number' ? amount.toString() : amount ?? '';
  }

  getCollaborationId(id: number) {
    this._collaborationService.getCollaborationId(id).subscribe({
      next: (response: Collaboration) => {
        console.log('response id:', response);

        this.collaboration = response;

        this.prevAmountMin = response.compensationAmountMin;
        this.prevAmountMax = response.compensationAmountMax;

        this.startDateControl.setValue(response.startDate);
        this.endDateControl.setValue(response.endDate);

        this.requirementsControl.setValue(response.requirements);
        this.campaignDetailsControl.setValue(response.details);
        this.nameControl.setValue(response.name);
        this.cityControl.setValue(response.city);

        this.compensationTypeControl.setValue(response.compensationType);

        this.compensationAmountMin = response.compensationAmountMin;
        this.compensationAmountMax = response.compensationAmountMax;

        this.contentTypesList = Array.isArray(response.contentTypes)
          ? response.contentTypes
          : [response.contentTypes];

        this.platformsList = Array.isArray(response.platforms)
          ? response.platforms
          : [response.platforms];

        this.mapActiveItemsToForm('platforms', this.platformsList);
        // this._collaborationEditService.mapActiveItemsToForm(
        //   this.editCollaborationFormGroup,
        //   'platforms',
        //   this.platformsList
        // );

        this._cdRef.detectChanges();

        this.card = {
          startDate: response.startDate,
          endDate: response.endDate
        };
      },
      error: err => {
        console.error('Error fetching collaboration:', err);
        this.error = 'Failed to load collaboration.';
      }
    });
  }

  mapActiveItemsToForm(type: 'platforms' | 'contentTypes', list: any[]) {
    const activeIds: string[] = [];

    list.forEach(item => {
      if (item.active) {
        activeIds.push(item.id);
        item.active = false;
      }
    });

    this.editCollaborationFormGroup.patchValue({
      [type]: activeIds
    });

    console.log(`Mapped active ${type}:`, activeIds);
  }

  getCollaborationList() {
    this._collaborationService.getCollaborationList().subscribe({
      next: (response: CollaborationResponse) => {
        if (!response || !response.content || response.content.length === 0) {
          console.warn('Collaboration list is empty.');
          this.collaborationList = [];
          return;
        }

        this.collaborationList = response.content;
        console.log('collaborationList (po aktualizacji):', this.collaborationList);
      },

      error: err => {
        console.error('Error fetching collaboration:', err);
        this.error = 'Failed to load collaboration.';
      }
    });
  }

  getExpandedInfluencer(): Collaboration {
    return this.expandedInfluencer;
  }

  toggleChip(type: 'contentTypes' | 'platforms', item: any) {
    console.log('item:', item);

    item.active = !item.active;

    if (type === 'platforms') {
      this.platformSend = !this.platformSend;
    } else {
      this.contentTypeSend = !this.contentTypeSend;
    }

    let currentValues = this.editCollaborationFormGroup.get(type)?.value || [];

    if (item.active) {
      currentValues.push(item.id);
    } else {
      currentValues = currentValues.filter((id: string) => id !== item.id);
    }

    this.editCollaborationFormGroup.patchValue({
      [type]: currentValues
    });

    console.log(`Updated ${type}:`, currentValues);
  }

  editCollaboration(): void {
    this.isEditing = true;
    this.disabled = false;
  }

  private findCollaborationById(collaborationId: number) {
    if (!this.collaborationList || this.collaborationList.length === 0) {
      console.warn('Lista współprac jest pusta – pobieram nowe dane!');
      return null;
    }

    console.log('Szukam współpracy o ID:', collaborationId);
    console.log('Lista współprac:', this.collaborationList);

    return this.collaborationList.find(collaboration => collaboration.id === collaborationId);
  }

  saveCollaboration(collaborationId: number, resultMin: any, resultMax: any): void {
    this.isEditing = false;
    this.disabled = true;

    this.updatedCollaboration(collaborationId, resultMin, resultMax);
  }

  updatedCollaboration(collaborationId: number, resultMin: any, resultMax: any): void {
    const formValues = this._collaborationEditService.getUpdatedFormValues(
      this.editCollaborationFormGroup,
      this.contentTypesList,
      this.platformsList,
      this.contentTypeSend,
      this.platformSend,
      resultMin,
      resultMax
    );

    const collaborationToUpdate = this.findCollaborationById(collaborationId);
    if (!collaborationToUpdate) return;

    const collaborationUpdated = this._collaborationEditService.getUpdatedCollaborationObject(
      formValues,
      collaborationToUpdate,
      {
        name: this.nameControl,
        city: this.cityControl,
        details: this.campaignDetailsControl,
        requirements: this.requirementsControl,
        compensationType: this.compensationTypeControl,
        startDate: this.startDateControl,
        endDate: this.endDateControl
      },
      this.card
    );

    this.handleUpdateConfirmation(() => {
      this._collaborationEditService.sendUpdateRequest(
        collaborationUpdated,
        collaborationId,
        () => {
          this.getCollaborationList();
          this.getCollaborationId(collaborationId);
        },
        err => console.error('Błąd podczas aktualizacji:', err)
      );
    });
  }

  openConfirmationDeleteDialog(companyId: number): void {
    this._confirmPopUpService.popUpRemoval();

    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this.deleteItem(companyId);
      }
    });
  }

  private handleUpdateConfirmation(onConfirm: () => void): void {
    this.openConfirmationUpdateDialog()
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          onConfirm();
        }
      });
  }

  openConfirmationUpdateDialog(): MatDialogRef<any> {
    this._confirmPopUpService.popUpEdition();

    const dialogRef = this._fuseConfirmationService.open(this.configFormUpdate.value);

    setTimeout(() => {
      dialogRef.close();
    }, 3000);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
      }
    });
    return dialogRef;
  }

  deleteItem(companyId: number): void {
    this._collaborationService.deleteCollaboration(companyId).subscribe({
      next: () => {
        this.router.navigate(['/collaborations/list']);
      },
      error: err => {
        console.error('Error deleting company:', err);
      }
    });
  }

  goBackToMain(): void {
    this.router.navigate(['/collaborations']);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
