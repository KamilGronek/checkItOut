import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
    ElementRef,
    QueryList,
} from '@angular/core';

import { Router } from '@angular/router';

import { Inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { Influencer } from 'app/services/influencer/Influencer';
import { CompanyService } from '../../../services/company/company.service';

import { InfluencerService } from 'app/services/influencer/influencer.service';
import { CollaborationService } from '../../../services/collaboration/collaboration.service';
import { Collaboration } from '../../../services/collaboration/Collaboration';

import { City } from 'app/services/influencer/Influencer';
import { Company } from 'app/services/company/Company';

import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DateTime } from 'luxon';

import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FuseCardComponent } from '@fuse/components/card';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatSelectModule, MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'newCollaboration',
    standalone: true,
    templateUrl: './newCollaboration.component.html',
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
    ],
    styleUrl: 'newCollaboration-list.styles.css',
})
export class NewCollaborationComponent {
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
    companyList: Company[];
    cityOptions: string[] = [];

    companyOptions: string[] = [];

    // companyOptions = [1, 2, 3, 4, 5, 6];
    serviceTypeOptions = [1, 2, 3, 4, 5, 6];

    selectedCity: string = '';
    selectedCompany: string = '';
    selectedserviceType: string = '';

    // companyOptions = [
    //     { id: 1, name: 'Firma A' },
    //     { id: 2, name: 'Firma B' },
    //     { id: 3, name: 'Firma C' },
    //     { id: 4, name: 'Firma D' },
    //     { id: 5, name: 'Firma E' },
    //     { id: 6, name: 'Firma F' },
    // ];

    warning: boolean = false;
    isDisabled = false;
    configForm: UntypedFormGroup;
    companyId: number = 0;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private _companyService: CompanyService,
        private _collaborationService: CollaborationService,
        private _influencerService: InfluencerService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService
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
        });
        // this.cardForm = this.fb.group({
        //     startDate: [null],
        //     endDate: [null],
        // });
        // this.card = {
        //     startDate: null,
        // };
    }

    ngAfterViewInit(): void {}

    ngOnInit(): void {
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
        // this.editNewCollaborationFormGroup = this.fb.group({
        //     startDate: [null],
        // });
        this.card = {
            startDate: null,
            endDate: null,
        };

        console.log(this.companyList);

        this.getCityList();
        this.getCompanyList();
    }

    createCollaboration() {
        let collaboration: Collaboration =
            this.editNewCollaborationFormGroup.getRawValue();

        console.log('collaboration:', collaboration);

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
            .substring(0, 19);

        collaboration.endDate = collaboration.endDate
            .toString()
            .substring(0, 19);

        console.log('collaborationUser :', this.collaborationUser);

        this.editNewCollaborationFormGroup.patchValue({
            name: [''],
            city: [''],
            details: [''],
            requirements: [''],
            compensation: [''],
            company: [''],
            serviceType: [''],
            startDate: [''],
            endDate: [''],
        });

        this._collaborationService
            .createCollaboration(collaboration)
            .subscribe({
                next: (collabo) => {
                    this.collaborationUser = collabo;
                    this.warning = false;
                    this.openConfirmationDialog();
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

    onCompanyChange(event: MatSelectChange): void {
        this.selectedCompany = event.value;
    }

    onCityChange(event: MatSelectChange): void {
        this.selectedCity = event.value;
    }

    onserviceTypeChange(event: MatSelectChange): void {
        this.selectedserviceType = event.value;

        this.editNewCollaborationFormGroup.patchValue({
            serviceType: this.selectedserviceType,
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input?.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            // const selectedFile = input.files[0];

            this.imageUrl = URL.createObjectURL(this.selectedFile);
        }
    }

    goBackToMain(): void {
        this.router.navigate(['/collaborations']);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Focus on the given element to start editing the list title
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

        // If the title is empty...
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

    onDateSelected(): void {
        const selectedDate =
            this.editNewCollaborationFormGroup.get('startDate')?.value;
        this.card.startDate = selectedDate;
        console.log('Selected startdate:', this.card.startDate);

        // if (this.card.startDate !== '') {
        //     setTimeout(() => {
        //         this.selectInput.open();
        //     }, 0);
        // }
    }

    onDateSelected2(): void {
        const selectedDate2 =
            this.editNewCollaborationFormGroup.get('endDate')?.value;
        this.card.endDate = selectedDate2;
        console.log('Selected enddate:', this.card.endDate);
    }

    clearDueDate(): void {
        this.editNewCollaborationFormGroup.get('startDate')?.setValue(null);
        this.card.startDate = null;
        console.log('Date cleared');
    }

    clearDueDate2(): void {
        this.editNewCollaborationFormGroup.get('endDate')?.setValue(null);
        this.card.endDate = null;
        console.log('Date cleared');
    }

    // fillEditForm(): void {
    //     if (this.expandedInfluencer != null) {
    //         this.editNewCollaborationFormGroup.controls['requirements'].setValue(
    //             this.expandedInfluencer.requirements
    //         );
    //         this.editNewCollaborationFormGroup.controls['compensation'].setValue(
    //             this.expandedInfluencer.compensation
    //         );

    //         this.editNewCollaborationFormGroup.controls['company'].setValue(
    //             this.expandedInfluencer.company
    //         );

    //         this.editNewCollaborationFormGroup.controls['startDate'].setValue(
    //             this.expandedInfluencer.startDate
    //         );
    //         this.editNewCollaborationFormGroup.controls['endDate'].setValue(
    //             this.expandedInfluencer.endDate
    //         );
    //         this.editNewCollaborationFormGroup.controls['id'].disable();
    //     }
    // }
}
