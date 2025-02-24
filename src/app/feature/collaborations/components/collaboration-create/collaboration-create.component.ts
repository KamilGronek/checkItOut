import {AsyncPipe, CommonModule, DatePipe, NgClass} from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {CompanyService} from '../../../companies/services/company.service';

import {InfluencerService} from 'app/feature/influencers/services/influencer.service';
import {CollaborationService} from '../../services/collaboration.service';
import {Collaboration} from '../../services/collaboration.types';

import {TypeService} from '../../../../core/services/service-type/service-type.service';

import {City} from 'app/feature/influencers/services/influencer.types';

import {FuseConfirmationService} from '@fuse/services/confirmation';
import {NgApexchartsModule} from 'ng-apexcharts';
import {Observable, Subject} from 'rxjs';

import {MatDialogModule} from '@angular/material/dialog';
import {DateTime} from 'luxon';

import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FuseCardComponent} from '@fuse/components/card';
import {MatDatepicker, MatDatepickerModule,} from '@angular/material/datepicker';

import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@Component({
    selector: 'collaboration-create',
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
        DatePipe,
        FuseCardComponent,
        MatDatepickerModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        AsyncPipe,
    ],
    styleUrl: 'collaboration-create.styles.css',
})
export class CollaborationCreateComponent {
    formFieldHelpers: string[] = [''];

    id: number;
    // influencerList: Influencer[];
    collaborations: string[];
    selectedFile: File | null = null;
    imageUrl: string | null = null;

    expandedInfluencer: Collaboration | null;
    editNewCollaborationFormGroup: UntypedFormGroup;

    card: any;
    cardForm: UntypedFormGroup;
    collaborationUser: Collaboration;

    list = {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis placerat, odio nec pellentesque consectetur, libero ligula ultricies diam, a vehicula orci ipsum at ligula. Fusce vulputate, dolor in laoreet egestas, eros ex semper tortor, eu euismod arcu risus vitae urna. Donec porta, metus quis elementum elementum, augue diam mollis orci, nec bibendum quam nulla feugiat nisl. Nam dictum posuere turpis, at mattis nibh finibus vel. Donec consequat gravida leo non laoreet. Morbi placerat imperdiet tristique. Fusce ut arcu ac enim posuere aliquam. Sed sodales facilisis elementum. Integer sollicitudin ornare cursus. Mauris tempus, risus ut ultrices malesuada, arcu tortor congue ante, vel malesuada tellus ante sit amet velit. Phasellus feugiat fringilla vehicula. In at ultricies ante. Aenean euismod accumsan elementum. Vestibulum a nisi dui. Aliquam et nibh quam. Proin lacinia tincidunt turpis a lobortis. In vitae massa porttitor, accumsan metus non, efficitur tortor. Proin aliquam dapibus massa, a aliquet massa. Fusce maximus erat odio. Nulla dictum venenatis nisi, vitae suscipit lectus interdum ac. Etiam dolor sem, faucibus et odio ut, imperdiet fermentum lectus. Nunc porttitor, nisl et congue iaculis, sem leo lobortis enim, ut dignissim metus ipsum nec erat. Nulla pellentesque risus sit amet ante feugiat eleifend. Sed mollis eleifend lacus, nec tempus nibh ullamcorper a. Praesent elementum urna et nisl eleifend congue. Suspendisse quis hendrerit urna. Suspendisse rhoncus, ligula ut fermentum vulputate, quam justo pretium lorem, vitae dapibus urna dolor at magna. Donec viverra, magna ac facilisis ultricies, turpis mi faucibus lectus, sit amet tempus ipsum sem sit amet mauris. Proin ligula nisi, elementum pulvinar maximus eu, semper ac nisl. Etiam venenatis semper quam, vel pellentesque ex tincidunt ut. Donec non pretium sapien. Proin mi arcu, ultricies vitae arcu sed, vehicula laoreet arcu.',
    };

    cityList: City[];
    cityOptions: string[] = [];

    companyOptions: string[] = [];

    // companyOptions = [1, 2, 3, 4, 5, 6];
    serviceTypeOptions = [1, 2, 3, 4, 5, 6];

    selectedCity = '';
    selectedCompany = '';
    selectedserviceType = '';

    warning = false;
    warningText: 'Przed wysłaniem, proszę uzupełnić wszystkie dane';

    isDisabled = false;
    configForm: UntypedFormGroup;
    companyId = 0;
    // filteredCompanies = [];
    searchTerm = '';

    // form: FormGroup;

    options = ['One', 'Two', 'Three'];
    companyList = [];
    serviceTypeList = [];

    filteredCompanies!: Observable<string[]>;
    filteredServiceTypes!: Observable<string[]>;

    btnVisible = false;

    @ViewChild('endDatePicker') endDatePicker: MatDatepicker<any>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private _companyService: CompanyService,
        private _collaborationService: CollaborationService,
        private _influencerService: InfluencerService,
        private _typeService: TypeService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _cdRef: ChangeDetectorRef
    ) {
        this.editNewCollaborationFormGroup = this._formBuilder.group({
            name: ['', [Validators.required]],
            city: ['', [Validators.required]],
            details: ['', [Validators.required]],
            requirements: ['', [Validators.required]],
            compensation: ['', [Validators.required]],
            company: ['', [Validators.required]],
            serviceType: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            imageUrl: ['', [Validators.required]],
        });
    }

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
        this.editNewCollaborationFormGroup
            .get('company')
            ?.valueChanges.subscribe((value) => {
            console.log('Company field value changed:', value);
        });

        this.editNewCollaborationFormGroup
            .get('serviceType')
            ?.valueChanges.subscribe((value) => {
            console.log('Company field value changed:', value);
        });

        this.configForm = this._formBuilder.group({
            title: 'Dodałeś nową wspołpracę',
            message:
                'Nowa współpraca jest widoczna na głównej stronie<span class="font-medium"></span>',
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

        this.card = {
            startDate: null,
            endDate: null,
        };

        console.log('companyList:', this.companyList);

        this.getCityList();
        this.getCompanyList();
        this.getServiceTypeList();

        this.filteredCompanies = this.editNewCollaborationFormGroup
            .get('company')!
            .valueChanges.pipe(
                startWith(''),
                map((value) => this._filterCompanies(value || ''))
            );

        this.filteredServiceTypes = this.editNewCollaborationFormGroup
            .get('serviceType')!
            .valueChanges.pipe(
                startWith(''),
                map((value) => this._filterServiceTypes(value || ''))
            );
    }

    private _filterCompanies(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.companyList.filter((company) =>
            company.name.toLowerCase().includes(filterValue)
        );
    }

    private _filterServiceTypes(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.serviceTypeList.filter((serviceType) =>
            serviceType.name.toLowerCase().includes(filterValue)
        );
    }

    onCompanyChange(company: any): void {
        this.editNewCollaborationFormGroup.get('company')?.setValue(company.id);
    }

    onServiceTypeChange(serviceType: any): void {
        this.editNewCollaborationFormGroup
            .get('serviceType')
            ?.setValue(serviceType.id);
    }

    // trackCompany(index: number, company: any): any {
    //     return company.id;
    // }

    // trackServiceType(index: number, serviceType: any): any {
    //     return serviceType.id;
    // }

    createCollaboration() {
        let collaboration: Collaboration =
            this.editNewCollaborationFormGroup.getRawValue();

        console.log('get collaboration:', collaboration);

        collaboration.imageUrl = this.imageUrl?.substring(5);

        if (
            collaboration.name == '' ||
            collaboration.requirements == '' ||
            collaboration.compensation == '' ||
            collaboration.startDate == '' ||
            collaboration.endDate == ''
        ) {
            this.warning = true;
            console.warn('Nazwa nie może być pusta');
            return;
        }

        if (
            collaboration.city == '' ||
            collaboration.details == '' ||
            this.selectedCompany == '' ||
            this.selectedserviceType == ''
        ) {
            this.warning = true;
        }

        collaboration.startDate = collaboration.startDate
            .toString()
            ?.substring(0, 19);

        collaboration.endDate = collaboration.endDate
            .toString()
            ?.substring(0, 19);

        console.log('collaborationUser :', this.collaborationUser);

        this.editNewCollaborationFormGroup.patchValue({
            name: '',
            city: '',
            details: '',
            requirements: '',
            compensation: '',
            company: '',
            serviceType: '',
            startDate: '',
            endDate: '',
            imageUrl: '',
        });

        this._collaborationService
            .createCollaboration(collaboration)
            .subscribe({
                next: (collabo) => {
                    this.collaborationUser = collabo;
                    this.warning = false;
                    this.openConfirmationDialog();
                    this.clearStartDate();
                    this.clearEndDate();
                },
                error: (error) => {
                    console.error(
                        'Error with influencer update:',
                        error.error.message
                    );
                },
            });
    }

    openConfirmationDialog(): void {
        const dialogRef = this._fuseConfirmationService.open(
            this.configForm.value
        );

        setTimeout(() => {
            dialogRef.close();
        }, 3000);

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
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

    private async getCompanyList(): Promise<void> {
        this._companyService.getCompanyList().subscribe({
            next: (response) => {
                this.companyList = response;
            },
            error: (error) => {
                console.error('Error fetching influencer list', error);
            },
        });
    }

    private async getServiceTypeList(): Promise<void> {
        this._typeService.getServiceTypeList().subscribe({
            next: (response) => {
                this.serviceTypeList = response;

                console.log(this.serviceTypeList);
            },
            error: (error) => {
                console.error('Error fetching influencer list', error);
            },
        });
    }

    onCityChange(event: MatSelectChange): void {
        this.selectedCity = event.value;
    }

    // onserviceTypeChange(event: MatSelectChange): void {
    //     this.selectedserviceType = event.value;

    //     this.editNewCollaborationFormGroup.patchValue({
    //         serviceType: this.selectedserviceType,
    //     });
    // }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input?.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            // const selectedFile = input.files[0];

            this.imageUrl = URL.createObjectURL(this.selectedFile);
        }

        this.btnVisible = true;
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
        return (
            DateTime.fromISO(date).startOf('day') <
            DateTime.now().startOf('day')
        );
    }

    startDateSelected(): void {
        const selectedDate =
            this.editNewCollaborationFormGroup.get('startDate')?.value;
        this.card.startDate = selectedDate;

        this.endDatePicker.open();
    }

    endDateSelected(): void {
        const selectedDate2 =
            this.editNewCollaborationFormGroup.get('endDate')?.value;
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
