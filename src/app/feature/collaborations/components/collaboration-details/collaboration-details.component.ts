import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component,} from '@angular/core';
import {MatNativeDateModule, provideNativeDateAdapter,} from '@angular/material/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {City, Influencer,} from 'app/feature/influencers/services/influencer.types';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {NgApexchartsModule} from 'ng-apexcharts';
import {Subject} from 'rxjs';
import {MatDialogModule} from '@angular/material/dialog';
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateTime} from 'luxon';
import {CollaborationService} from '../../services/collaboration.service';
import {Collaboration, CompanyCollaboration, ServiceTypeCollaboration,} from '../../services/collaboration.types';
import {MatSelectModule} from '@angular/material/select';
import {InfluencerService} from 'app/feature/influencers/services/influencer.service';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TranslocoModule} from '@ngneat/transloco';

@Component({
    selector: 'collaboration-details',
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
        MatProgressBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSliderModule,
        MatCheckboxModule,
        TranslocoModule,
    ],
    styleUrl: 'collaboration-details.styles.css',
})
export class CollaborationsDetailComponent {
    // @ViewChild('editDetail') editDetail: ElementRef<HTMLInputElement>;

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

    disabled = false;
    max = 100;
    min = 0;
    showTicks = false;
    step = 1;
    thumbLabel = false;
    value = 0;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _formBuilder: UntypedFormBuilder,
        private fb: FormBuilder,
        private _collaborationService: CollaborationService,
        private _cdRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _influencerService: InfluencerService
    ) {
        this.editCollaborationFormGroup = this.fb.group({
            id: ['', [Validators.required]],
            name: ['', [Validators.required]],
            city: ['', [Validators.required]],
            details: ['', [Validators.required]],
            requirements: ['', [Validators.required]],
            compensation: ['', [Validators.required]],
            company: [, [Validators.required]],
            serviceType: [, [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            createdTime: ['', [Validators.required]],
            lastUpdateTime: ['', [Validators.required]],
            updater: ['', [Validators.required]],
        });
    }

    /**
     *
     * @param dueDate
     * @returns true,
     */

    ngAfterViewInit(): void {
    }

    readonly range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    ngOnInit(): void {
        this.configForm = this._formBuilder.group({
            title: 'Usuń pozycję',
            message:
                'Czy jesteś pewien że chcesz usunąć pozycje? <span class="font-medium"></span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation-triangle',
                color: 'warn',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Usuń',
                    color: 'warn',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Anuluj',
                }),
            }),
            dismissible: true,
        });

        this.configFormUpdate = this._formBuilder.group({
            title: 'Edycja wspołpracy',
            message:
                'Współpraca została pomyślnie edytowana<span class="font-medium"></span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:bell-alert',
                color: 'success',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Ok',
                    color: 'primary',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Powrót',
                }),
            }),
            dismissible: true,
        });

        this.getCollaborationList();
        this.getCityList();
        this.route.paramMap.subscribe((params) => {
            this.id = +params.get('id');
        });
    }

    getCollaborationList(): void {
        this._collaborationService.getCollaborationList().subscribe({
            next: (response: Collaboration[]) => {
                this.collaborationList = response;
                this.isLoading = false;

                this.collaboration = this.collaborationList.find(
                    (item) => item.id === this.id
                );

                const collaborationDate = this.collaborationList.find(
                    (item) => item.id === this.id
                );

                this.card = {
                    startDate: collaborationDate.startDate,
                    endDate: collaborationDate.endDate,
                };

                this._cdRef.detectChanges();

                console.log('collaborationList:', this.collaborationList);
            },
            error: (err) => {
                console.error('Error fetching collaborations:', err);
                this.error = 'Failed to load collaborations.';
                this.isLoading = false;
            },
        });
    }

    getExpandedInfluencer(): Collaboration {
        return this.expandedInfluencer;
    }

    private async getCityList(): Promise<void> {
        this._influencerService.getInfluencerCityList().subscribe({
            next: (response) => {
                this.cityList = response;
                this.cityOptions = this.cityList.map((city) => city.name);
            },
            error: (error) => {
                console.error('Error fetching influencer list', error);
            },
        });
    }

    onCityChange(event): void {
        this.selectedCity = event.value;
    }

    editCollaboration(collaborationId: number): void {
        this.isEditing = !this.isEditing;

        if (!this.isEditing) {
            this.updatedCollaboration(collaborationId);
        }
    }

    updatedCollaboration(collaborationId: number) {
        const formValues = this.editCollaborationFormGroup.getRawValue();

        const collaborationToUpdate = this.collaborationList.find(
            (collaboration) => collaboration.id === collaborationId
        );

        const companyId = (
            collaborationToUpdate.company as CompanyCollaboration
        ).id;

        const serviceTypeId = (
            collaborationToUpdate.serviceType as ServiceTypeCollaboration
        ).id;

        const collaborationUpdated = {
            ...collaborationToUpdate,
            ...Object.keys(formValues).reduce((result, key) => {
                result[key] =
                    formValues[key] !== ''
                        ? formValues[key]
                        : collaborationToUpdate[key];
                return result;
            }, {}),
            company: companyId,
            serviceType: serviceTypeId,
        };

        console.log('Zaktualizowany obiekt:', collaborationUpdated);

        this.openConfirmationUpdateDialog();

        this._collaborationService
            .updateCollaboration(collaborationUpdated, collaborationId)
            .subscribe({
                next: (updatedCollaboration) => {
                    console.log(
                        'Zaktualizowany obiekt z serwera:',
                        updatedCollaboration
                    );

                    const index = this.collaborationList.findIndex(
                        (collab) => collab.id === collaborationId
                    );
                    if (index !== -1) {
                        this.collaborationList[index] = updatedCollaboration;
                    }

                    this.getCollaborationList();
                },
                error: (err) => {
                    console.error('Błąd podczas aktualizacji:', err);
                },
            });
    }

    openConfirmationDeleteDialog(companyId: number): void {
        const dialogRef = this._fuseConfirmationService.open(
            this.configForm.value
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.delete(companyId);
            }
        });
    }

    openConfirmationUpdateDialog(): void {
        const dialogRef = this._fuseConfirmationService.open(
            this.configFormUpdate.value
        );

        setTimeout(() => {
            dialogRef.close();
        }, 3000);

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
            }
        });
    }

    delete(companyId: number): void {
        this._collaborationService.deleteCollaboration(companyId).subscribe({
            next: () => {
                this.router.navigate(['/collaborations']);
            },
            error: (err) => {
                console.error('Error deleting company:', err);
            },
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
        return (
            DateTime.fromISO(date).startOf('day') <
            DateTime.now().startOf('day')
        );
    }

    startDateSelected(): void {
        const selectedStartDate =
            this.editCollaborationFormGroup.get('startDate')?.value;

        this.card.startDate = selectedStartDate;
    }

    endDateSelected(): void {
        const selectedEndDate =
            this.editCollaborationFormGroup.get('endDate')?.value;

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

    //=============================================

    fillEditForm(): void {
        if (this.expandedInfluencer != null) {
            this.editCollaborationFormGroup.controls['id'].setValue(
                this.expandedInfluencer.id
            );
            this.editCollaborationFormGroup.controls['name'].setValue(
                this.expandedInfluencer.name
            );
            this.editCollaborationFormGroup.controls['city'].setValue(
                this.expandedInfluencer.city
            );
            this.editCollaborationFormGroup.controls['title'].setValue(
                this.expandedInfluencer.title
            );
            this.editCollaborationFormGroup.controls['details'].setValue(
                this.expandedInfluencer.details
            );
            this.editCollaborationFormGroup.controls['requirements'].setValue(
                this.expandedInfluencer.requirements
            );
            this.editCollaborationFormGroup.controls['compensation'].setValue(
                this.expandedInfluencer.compensation
            );
            this.editCollaborationFormGroup.controls['company'].setValue(
                this.expandedInfluencer.company
            );
            this.editCollaborationFormGroup.controls['serviceType'].setValue(
                this.expandedInfluencer.serviceType
            );
            this.editCollaborationFormGroup.controls['startDate'].setValue(
                this.expandedInfluencer.startDate
            );
            this.editCollaborationFormGroup.controls['endDate'].setValue(
                this.expandedInfluencer.endDate
            );
            this.editCollaborationFormGroup.controls['createdTime'].setValue(
                this.expandedInfluencer.createdTime
            );
            this.editCollaborationFormGroup.controls['lastUpdateTime'].setValue(
                this.expandedInfluencer.lastUpdateTime
            );
            this.editCollaborationFormGroup.controls['updater'].setValue(
                this.expandedInfluencer.updater
            );
            this.editCollaborationFormGroup.controls['id'].disable();
        }
    }
}
