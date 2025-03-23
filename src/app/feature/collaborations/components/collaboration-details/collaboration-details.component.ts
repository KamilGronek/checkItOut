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
import { DateTime } from 'luxon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

import {
  Collaboration,
  CompanyCollaboration,
  ServiceTypeCollaboration
} from '../../services/collaboration.types';

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

@Component({
  selector: 'collaborationsId',
  standalone: true,
  templateUrl: './collaboration-details.component.html',
  providers: [provideNativeDateAdapter()],
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
    TranslocoModule
  ],
  styleUrl: 'collaboration-details.styles.css'
})
export class CollaborationsDetailComponent implements OnInit {
  selectedItems: Set<string> = new Set();

  formFieldHelpers: string[] = [''];

  id: number;
  influencerList: Influencer[];
  collaboration = {};
  serviceType = {};

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
  cityOptions: string[] = [];

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _collaborationService: CollaborationService,
    private _cdRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _influencerService: InfluencerService
  ) {
    this.editCollaborationFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      details: ['', [Validators.required]],
      title: ['', [Validators.required]],
      requirements: ['', [Validators.required]],
      compensationType: ['', [Validators.required]],
      compensationAmountMin: ['', [Validators.required]],
      compensationAmountMax: ['', [Validators.required]],
      company: [, [Validators.required]],
      platforms: ['', [Validators.required]],
      contentTypes: ['', [Validators.required]],
      serviceType: [, [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  /**
   *
   * @param dueDate
   * @returns true,
   */

  ngAfterViewInit(): void {}

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  ngOnInit(): void {
    this.configForm = this.fb.group({
      title: 'Usuń pozycję',
      message: 'Czy jesteś pewien że chcesz usunąć pozycje? <span class="font-medium"></span>',
      icon: this.fb.group({
        show: true,
        name: 'heroicons_outline:exclamation-triangle',
        color: 'warn'
      }),
      actions: this.fb.group({
        confirm: this.fb.group({
          show: true,
          label: 'Usuń',
          color: 'warn'
        }),
        cancel: this.fb.group({
          show: true,
          label: 'Anuluj'
        })
      }),
      dismissible: true
    });

    this.configFormUpdate = this.fb.group({
      title: 'Edycja współpracy',
      message: 'Współpraca została pomyślnie edytowana<span class="font-medium"></span>',
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

    this.getCollaborationList();
    this.getCityList();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.collaborationId = +id;
        this.getCollaborationId(this.collaborationId);

        console.log('this.collaborationId:', this.collaborationId);
      }
    });
  }

  getTooltipText(platform: any): string {
    return platform.disabled ? `${platform.name} - ${platform.title}` : `${platform.name}`;
  }

  onStartSliderChange(event: any) {
    this.compensationAmountMin = event.target.value;
  }

  onEndSliderChange(event: any) {
    this.compensationAmountMax = event.target.value;
  }

  compensationAmount(value: number) {
    const amount = this.markerValues[value - 1];

    return typeof amount === 'number' ? amount.toString() : amount ?? '';
  }

  getCollaborationId(id: number) {
    console.log('Collaboration Id:', id);

    this._collaborationService.getCollaborationId(id).subscribe({
      next: (response: Collaboration) => {
        this.collaboration = response;

        this.prevAmountMin = response.compensationAmountMin;
        this.prevAmountMax = response.compensationAmountMax;

        this.compensationAmountMin = response.compensationAmountMin;
        this.compensationAmountMax = response.compensationAmountMax;

        this.contentTypesList = Array.isArray(response.contentTypes)
          ? response.contentTypes
          : [response.contentTypes];

        this.platformsList = Array.isArray(response.platforms)
          ? response.platforms
          : [response.platforms];

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

  getCollaborationList() {
    this._collaborationService.getCollaborationList().subscribe({
      next: (response: Collaboration[]) => {
        this.collaborationList = response;
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

  onCityChange(event): void {
    this.selectedCity = event.value;
  }

  toggleChip(type: 'contentTypes' | 'platforms', item: any) {
    console.log('item:', item);

    item.active = !item.active;

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

  saveCollaboration(collaborationId: number, resultMin: any, resultMax: any): void {
    this.isEditing = false;
    this.disabled = true;

    this.updatedCollaboration(collaborationId, resultMin, resultMax);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.disabled = true;
  }

  updatedCollaboration(collaborationId: number, resultMin: any, resultMax: any) {
    const formValues = this.getUpdatedFormValues(resultMin, resultMax);
    const collaborationToUpdate = this.findCollaborationById(collaborationId);

    const collaborationUpdated = this.getUpdatedCollaborationObject(
      formValues,
      collaborationToUpdate
    );

    console.log('Zaktualizowany obiekt:', collaborationUpdated);

    this.openConfirmationUpdateDialog();
    this.sendUpdateRequest(collaborationUpdated, collaborationId);
  }

  private getUpdatedFormValues(resultMin: any, resultMax: any) {
    const formValues = this.editCollaborationFormGroup.getRawValue();

    if (this.contentTypeSend) {
      formValues.contentTypes = this.contentTypesList.map(item => item.id);
    }

    if (this.platformSend) {
      formValues.platforms = this.platformsList.map(item => item.id);
    }

    formValues.compensationAmountMin = resultMin;
    formValues.compensationAmountMax = resultMax;

    return formValues;
  }

  private findCollaborationById(collaborationId: number) {
    return this.collaborationList.find(collaboration => collaboration.id === collaborationId);
  }

  private getUpdatedCollaborationObject(formValues: any, collaborationToUpdate: any) {
    const companyId = (collaborationToUpdate.company as CompanyCollaboration).id;
    const serviceTypeId = (collaborationToUpdate.serviceType as ServiceTypeCollaboration).id;

    return {
      ...collaborationToUpdate,
      ...Object.keys(formValues).reduce((result, key) => {
        result[key] = formValues[key] !== '' ? formValues[key] : collaborationToUpdate[key];
        return result;
      }, {}),
      company: companyId,
      serviceType: serviceTypeId
    };
  }

  private sendUpdateRequest(collaborationUpdated: any, collaborationId: number) {
    this._collaborationService
      .updateCollaboration(collaborationUpdated, collaborationId)
      .subscribe({
        next: updatedCollaboration => {
          console.log('Zaktualizowany obiekt z serwera:', updatedCollaboration);

          const index = this.collaborationList.findIndex(collab => collab.id === collaborationId);
          if (index !== -1) {
            this.collaborationList[index] = updatedCollaboration;
          }

          this.getCollaborationList();
          this.getCollaborationId(collaborationId);
        },
        error: err => {
          console.error('Błąd podczas aktualizacji:', err);
        }
      });
  }

  openConfirmationDeleteDialog(collaborationId: number): void {
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this.delete(collaborationId);
      }
    });
  }

  openConfirmationUpdateDialog(): void {
    const dialogRef = this._fuseConfirmationService.open(this.configFormUpdate.value);

    setTimeout(() => {
      dialogRef.close();
    }, 3000);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
      }
    });
  }

  delete(collaborationId: number): void {
    this._collaborationService.deleteCollaboration(collaborationId).subscribe({
      next: () => {
        this.router.navigate(['/collaborations']);
      },
      error: err => {
        console.error('Error deleting company:', err);
      }
    });
  }

  /**
   *
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

  goBackToMain(): void {
    this.router.navigate(['/collaborations']);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  //=============================================

  isOverdue(date: string): boolean {
    return DateTime.fromISO(date).startOf('day') < DateTime.now().startOf('day');
  }

  startDateSelected(): void {
    const selectedStartDate = this.editCollaborationFormGroup.get('startDate')?.value;

    this.card.startDate = selectedStartDate;
  }

  endDateSelected(): void {
    const selectedEndDate = this.editCollaborationFormGroup.get('endDate')?.value;

    this.card.endDate = selectedEndDate;
  }

  clearStartDate(): void {
    this.editCollaborationFormGroup.get('startDate')?.setValue(null);
    this.card.startDate = null;
  }

  clearEndDate(): void {
    this.editCollaborationFormGroup.get('endDate')?.setValue(null);
    this.card.endDate = null;
  }

  fillEditForm(): void {
    if (this.expandedInfluencer != null) {
      this.editCollaborationFormGroup.controls['id'].setValue(this.expandedInfluencer.id);
      this.editCollaborationFormGroup.controls['name'].setValue(this.expandedInfluencer.name);
      this.editCollaborationFormGroup.controls['city'].setValue(this.expandedInfluencer.city);
      this.editCollaborationFormGroup.controls['title'].setValue(this.expandedInfluencer.title);
      this.editCollaborationFormGroup.controls['details'].setValue(this.expandedInfluencer.details);
      this.editCollaborationFormGroup.controls['requirements'].setValue(
        this.expandedInfluencer.requirements
      );
      this.editCollaborationFormGroup.controls['compensationType'].setValue(
        this.expandedInfluencer.compensationType
      );

      this.editCollaborationFormGroup.controls['compensationAmountMin'].setValue(
        this.expandedInfluencer.compensationAmountMin
      );

      this.editCollaborationFormGroup.controls['compensationAmountMax'].setValue(
        this.expandedInfluencer.compensationAmountMax
      );

      this.editCollaborationFormGroup.controls['company'].setValue(this.expandedInfluencer.company);

      this.editCollaborationFormGroup.controls['contentTypes'].setValue(
        this.expandedInfluencer.contentTypes
      );

      this.editCollaborationFormGroup.controls['platforms'].setValue(
        this.expandedInfluencer.platforms
      );

      this.editCollaborationFormGroup.controls['serviceType'].setValue(
        this.expandedInfluencer.serviceType
      );
      this.editCollaborationFormGroup.controls['startDate'].setValue(
        this.expandedInfluencer.startDate
      );
      this.editCollaborationFormGroup.controls['endDate'].setValue(this.expandedInfluencer.endDate);
      this.editCollaborationFormGroup.controls['id'].disable();
    }
  }
}
