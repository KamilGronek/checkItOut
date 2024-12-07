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
    ViewEncapsulation,
    HostListener,
    ElementRef,
} from '@angular/core';

import { FormControl } from '@angular/forms';

import { Inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Influencer } from 'app/services/influencer/Influencer';
import { City } from 'app/services/influencer/Influencer';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { InfluencerService } from 'app/services/influencer/influencer.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    FormGroup,
    FormBuilder,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'app/core/auth/auth.service';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'profile',
    standalone: true,
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatGridListModule,
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
        MatSelectModule,
    ],
    styleUrl: 'profile-list.styles.css',
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
    formFieldHelpers: string[] = [''];
    fixedSubscriptInput: FormControl = new FormControl('', [
        Validators.required,
    ]);

    @ViewChild('send') send: ElementRef;
    data: any;
    influencersDataSource: MatTableDataSource<any> = new MatTableDataSource();
    influencersTableColumns: string[] = [
        'id',
        'firstName',
        'lastName',
        'instagramId',
        'apiKey',
    ];
    columnsToDisplayWithExpand: string[] = [
        ...this.influencersTableColumns,
        'expand',
    ];
    expandedInfluencer: Influencer | null;
    formLaunched: boolean = false;
    editformLaunched: boolean = false;
    idOfEditedUser: number;
    flashMessage: 'success' | 'error' | null = null;

    influencerList: Influencer[];
    influencerUser: Influencer;
    cityList: City[];
    typeAccountList: any;
    cityOptions: string[] = [];

    typeAccountOptions: any;
    typeStatus: any;

    selectedCity: string = '';
    selectedTypeAccount: string = '';
    influencerId: number;
    addInfluencerFormGroup: UntypedFormGroup;
    editInfluencerFormGroup: UntypedFormGroup;
    dataSource: MatTableDataSource<Influencer>;

    res = '';

    user: any;
    dataToken: any;
    welcomeText: string =
        'Witamy, proszę uzupełnij swoje dane a następnie wyślij je do walidacji, żeby aktywować konto';

    cols: number = 2;
    rowHeight: string = '2:1';

    textWarning: 'Przed wysłaniem, proszę uzupełnić dane';
    form: FormGroup;

    confirmedRejestration: boolean = false;
    warning: boolean = false;
    warningEmail: boolean = false;
    nameAuth = '';
    emailAuth = '';
    nameSurArr = [];
    error500 = false;
    errorMessage = '';
    isButtonDisabled = false;
    statusUser: string = '';
    switchStatusInfo: boolean = true;
    confirmedStatusInfo: boolean = false;
    userLength: number = 0;
    isInputVisible = true;
    isDisabled = false;

    chartNewVsReturning: ApexOptions;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _influencerService: InfluencerService,
        private _formBuilder: UntypedFormBuilder,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            city: ['', Validators.required],
        });
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    ngAfterViewInit(): void {}

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.adjustGrid(event.target.innerWidth);
    }

    ngOnInit(): void {
        this.editInfluencerFormGroup = this._formBuilder.group({
            instagramId: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required]],
            city: ['', [Validators.required]],
            instagramAccountType: ['', [Validators.required]],
            noteFromAdmin: ['', [Validators.required]],
        });

        this.welcomeText;
        //this.setStatusOfUser("IN_ACTIVE");

        this.getCityList()
            .then(() => {
                this.getTypeAccount();
            })
            .then(() => {
                this.loadInfluencer();
            });

        this.getStatus();
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

    private async getTypeAccount(): Promise<void> {
        this._influencerService.getInfluencerTypeAccount().subscribe({
            next: (response) => {
                this.typeAccountOptions = response;
            },
            error: (error) => {
                console.error('Error fetching influencer list', error);
            },
        });
    }

    getStatus() {
        this._influencerService.getInfluencerStatus().subscribe({
            next: (response) => {
                this.typeStatus = response;
            },
            error: (error) => {
                console.error('Error fetching influencer list', error);
            },
        });
    }

    onCityChange(event: MatSelectChange): void {
        this.selectedCity = event.value;
        this.editInfluencerFormGroup.patchValue({
            city: this.selectedCity,
        });
    }

    onTypeAccountChange(event: MatSelectChange): void {
        this.selectedTypeAccount = event.value;
        this.editInfluencerFormGroup.patchValue({
            instagramAccountType: this.selectedTypeAccount,
        });
    }

    influencerCondition(userData: any) {
        return (
            userData.instagramId === '' ||
            userData.firstName === '' ||
            userData.lastName === '' ||
            userData.email === '' ||
            userData.city === '' ||
            userData.instagramAccountType === ''
        );
    }

    updateInfluencer() {
        const influencer: Influencer =
            this.editInfluencerFormGroup.getRawValue();

        this._influencerService
            .updateInfluencer(influencer, this.influencerUser.id)
            .subscribe({
                next: (influencer) => {
                    this.influencerUser = influencer;
                    this.switchStatusInfo = false;
                    this.confirmedRejestration = true;
                    this.isInputVisible = false;
                    this.confirmedStatusInfo = true;

                    this.editInfluencerFormGroup.patchValue({
                        instagramId: this.influencerUser.instagramId,
                        firstName: this.influencerUser.firstName,
                        lastName: this.influencerUser.lastName,
                        email: this.influencerUser.email,
                        city: this.influencerUser.city,
                        instagramAccountType:
                            this.influencerUser.instagramAccountType,
                        noteFromAdmin: this.influencerUser.noteFromAdmin,
                    });

                    this.setStatusOfUser(this.influencerUser.status);
                },
                error: (error) => {
                    console.error(
                        'Error fetching influencer list:',
                        error.error.message
                    );

                    this.errorMessage = 'Coś poszło nie tak';
                    this.error500 = true;
                },
            });
    }

    private async loadInfluencer(): Promise<void> {
        this._influencerService.getInfluencerUser().subscribe({
            next: (influencer: Influencer) => {
                this.influencerUser = influencer;
                this.switchStatusInfo = false;
                this.confirmedRejestration = true;
                this.isInputVisible = false;
                this.confirmedStatusInfo = true;

                this.editInfluencerFormGroup.patchValue({
                    instagramId: this.influencerUser.instagramId,
                    firstName: this.influencerUser.firstName,
                    lastName: this.influencerUser.lastName,
                    email: this.influencerUser.email,
                    city: this.influencerUser.city,
                    instagramAccountType:
                        this.influencerUser.instagramAccountType,
                    noteFromAdmin: this.influencerUser.noteFromAdmin,
                });

                this.setStatusOfUser(this.influencerUser.status);
            },
            error: (error) => {
                console.error(error);
                this.setStatusOfUser('IN_ACTIVE');
                this.switchStatusInfo = true;
                this.confirmedRejestration = false;
                this.isInputVisible = true;
            },
        });
    }

    private setStatusOfUser(rawStatusUser: string) {
        switch (rawStatusUser) {
            case 'ACTIVE':
                this.statusUser = 'Aktywne';
                this.isDisabled = false;
                break;
            case 'IN_ACTIVE':
                this.statusUser = 'Nieaktywne';
                break;
            case 'IN_VALIDATION':
                this.statusUser = 'W walidacji';
                break;
            default:
                this.statusUser = 'Nieaktywne';
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    readonly dialog = inject(MatDialog);

    adjustGrid(width: number): void {
        if (width <= 600) {
            this.cols = 1;
            this.rowHeight = '1:1';
        } else if (width <= 960) {
            this.cols = 2;
            this.rowHeight = '2:1';
        }
    }

    fillEditForm(): void {
        if (this.expandedInfluencer != null) {
            this.editInfluencerFormGroup.controls['instagramId'].setValue(
                this.expandedInfluencer.instagramId
            );

            this.editInfluencerFormGroup.controls['firstName'].setValue(
                this.expandedInfluencer.firstName
            );
            this.editInfluencerFormGroup.controls['lastName'].setValue(
                this.expandedInfluencer.lastName
            );
            this.editInfluencerFormGroup.controls['email'].setValue(
                this.expandedInfluencer.email
            );
            this.editInfluencerFormGroup.controls['city'].setValue(
                this.expandedInfluencer.city
            );
            this.editInfluencerFormGroup.controls['noteFromAdmin'].setValue(
                this.expandedInfluencer.noteFromAdmin
            );
            this.editInfluencerFormGroup.controls[
                'instagramAccountType'
            ].setValue(this.expandedInfluencer.city);
            this.editInfluencerFormGroup.controls['id'].disable();
        }
    }
}
