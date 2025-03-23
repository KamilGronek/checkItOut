import {CommonModule, NgClass} from '@angular/common';
import {TranslocoModule} from '@ngneat/transloco';

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';

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

import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';

import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {City, Influencer, InfluencerUser,} from 'app/feature/influencers/services/influencer.types';
import {ApexOptions, NgApexchartsModule} from 'ng-apexcharts';
import {InfluencerService} from 'app/feature/influencers/services/influencer.service';

import {MatDialogModule} from '@angular/material/dialog';
import {NavigationEnd, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from 'app/core/services/authentication/auth.service';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {HttpResponse} from '@angular/common/http';
import {AdvertisementPopUpService} from 'app/core/services/advertisement-pop-up/advertisement-pop-up.service';

import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarService} from 'app/core/services/custom-snackbar/custom-snackbar.service';

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Subject, Subscription} from 'rxjs';

import {filter} from 'rxjs/operators';
import {getAuth, onAuthStateChanged} from "@angular/fire/auth";

@Component({
    selector: 'user-profile',
    standalone: true,
    templateUrl: './user-profile.component.html',
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
        MatTooltipModule,
        MatTableModule,
        MatSortModule,
        NgClass,
        MatProgressBarModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        TranslocoModule,
    ],
    styleUrl: 'user-profile.styles.css',
})
export class UserProfileComponent implements OnInit, OnDestroy {
    @Input() config: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

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
    expandedInfluencer: InfluencerUser | null;
    formLaunched: boolean = false;
    editformLaunched: boolean = false;
    idOfEditedUser: number;
    flashMessage: 'success' | 'error' | null = null;

    influencerList: Influencer[];
    influencerUser: InfluencerUser;
    cityList: City[];
    typeAccountList: any;
    cityOptions: string[] = [];

    selectedCity: string = '';
    selectedTypeAccount: string = '';
    influencerId: number;
    addInfluencerFormGroup: UntypedFormGroup;
    editInfluencerFormGroup: UntypedFormGroup;

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
    eror404: boolean = false;

    chartNewVsReturning: ApexOptions;

    typeStatus: string[] = ['Walidowany', 'Aktywny', 'Nieaktywny'];
    typeAccountOptions: string[] = ['Publiczne', 'Niepubliczne', 'NA'];

    private _snackBar = inject(MatSnackBar);

    constructor(
        private _influencerService: InfluencerService,
        private _popUpService: AdvertisementPopUpService,
        private _formBuilder: UntypedFormBuilder,
        private authService: AuthService,
        private fb: FormBuilder,
        private snackbarService: SnackbarService,
        private router: Router
    ) {
        this.form = this.fb.group({
            city: ['', Validators.required],
        });
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    private subscription!: Subscription;

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.adjustGrid(event.target.innerWidth);
    }

    ngOnInit(): void {
        if (this.router.url.includes('/profile')) {
            this._popUpService.setPopUpState(true);
        } else {
            this._popUpService.setPopUpState(false);
        }

        this.subscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                if (event.url.includes('/profile')) {
                    this._popUpService.setPopUpState(true);
                } else {
                    this._popUpService.setPopUpState(false);
                }
            });

        this.editInfluencerFormGroup = this._formBuilder.group({
            instagramId: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required]],
            city: ['', [Validators.required]],
            instagramAccountType: ['', [Validators.required]],
            noteFromAdmin: [],
        });

        this.getCityList().then(() => {
            this.loadInfluencer();
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

    updateOrCreateInfluencer() {
        if (this.eror404) {
            this.createNewInfluencer();
        } else {
            this.updateInfluencer();
        }
    }

    updateInfluencer() {
        const userToUpdate = this.influencerUser;
        userToUpdate.email = this.editInfluencerFormGroup.get('email').value;
        userToUpdate.firstName =
            this.editInfluencerFormGroup.get('firstName').value;
        userToUpdate.lastName =
            this.editInfluencerFormGroup.get('lastName').value;
        userToUpdate.influencer.instagramId =
            this.editInfluencerFormGroup.get('instagramId').value;
        userToUpdate.influencer.city =
            this.editInfluencerFormGroup.get('city').value;
        userToUpdate.influencer.instagramAccountType =
            this.editInfluencerFormGroup.get('instagramAccountType').value;

        this._influencerService
            .updateInfluencerUser(userToUpdate, userToUpdate.id)
            .subscribe({
                next: (user) => {
                    this.setStatusOfUser(user.accountStatus);
                    this.snackbarService.showSuccess(
                        'Edycja danych użytkownika zakończona powodzeniem!'
                    );
                },
                error: (error) => {
                    console.error(
                        'Error with influencer update:',
                        error.error.message
                    );
                    this.snackbarService.showFailure('Coś poszło nie tak');
                    this.error500 = true;
                },
            });
    }

    createNewInfluencer() {
        let influencerToUpdate = {
            instagramId: this.editInfluencerFormGroup.get('instagramId').value,
            city: this.editInfluencerFormGroup.get('city').value,
            instagramAccountType: this.editInfluencerFormGroup.get(
                'instagramAccountType'
            ).value,
        };

        const userToUpdate: any = {
            email: this.editInfluencerFormGroup.get('email').value,
            firstName: this.editInfluencerFormGroup.get('firstName').value,
            lastName: this.editInfluencerFormGroup.get('lastName').value,
            influencer: influencerToUpdate,
            accountStatus: 'Nieaktywny',
            userType: 'INFLUENCER',
        };

        this._influencerService.createInfluencerUser(userToUpdate).subscribe({
            next: (influencer) => {
                this.influencerUser = influencer;
                this.switchStatusInfo = false;
                this.confirmedRejestration = true;
                this.isInputVisible = false;
                this.confirmedStatusInfo = true;
                this.eror404 = false;

                this.editInfluencerFormGroup.patchValue({
                    instagramId: this.influencerUser.influencer.instagramId,
                    firstName: this.influencerUser.firstName,
                    lastName: this.influencerUser.lastName,
                    email: this.influencerUser.email,
                    city: this.influencerUser.influencer.city,
                    instagramAccountType:
                    this.influencerUser.influencer.instagramAccountType,
                    noteFromAdmin: this.influencerUser.influencer.noteFromAdmin,
                    accountStatus: 'Aktywny',
                });

                this.setStatusOfUser(this.influencerUser.accountStatus);
                this.snackbarService.showSuccess('Udało się utworzyć konto!');
            },
            error: (error) => {
                console.error(
                    'Error with influencer create:',
                    error.error.message
                );

                this.snackbarService.showFailure('Coś poszło nie tak');
                this.error500 = true;
            },
        });
    }

    resetPopUp() {
        this._popUpService.setHidePopUpPermanently(false);
    }

    private async loadInfluencer(): Promise<void> {
        this._influencerService.getInfluencerUser().subscribe({
            next: (influencer: InfluencerUser) => {
                this.influencerUser = influencer;
                this.switchStatusInfo = false;
                this.confirmedRejestration = true;
                this.isInputVisible = false;
                this.confirmedStatusInfo = true;
                this.eror404 = false;

                this.editInfluencerFormGroup.patchValue({
                    instagramId: this.influencerUser.influencer.instagramId,
                    firstName: this.influencerUser.firstName,
                    lastName: this.influencerUser.lastName,
                    email: this.influencerUser.email,
                    city: this.influencerUser.influencer.city,
                    instagramAccountType:
                    this.influencerUser.influencer.instagramAccountType,
                    noteFromAdmin: this.influencerUser.influencer.noteFromAdmin,
                });

                this.setStatusOfUser(this.influencerUser.accountStatus);
                this.snackbarService.showSuccess('Jesteś zalogowany!');
            },
            error: (error: HttpResponse<InfluencerUser>) => {
                console.error(error);
                if (error.status == 404) this.eror404 = true;
                this.setStatusOfUser('IN_ACTIVE');
                this.switchStatusInfo = true;
                this.confirmedRejestration = false;
                this.isInputVisible = true;
                this.editInfluencerFormGroup.patchValue({
                    email: this.authService.getUserFromToken().email,
                });
                this.snackbarService.showFailure('Coś poszło nie tak');
            },
        });
    }

    private setStatusOfUser(rawStatusUser: string) {
        switch (rawStatusUser) {
            case 'Aktywny':
                this.statusUser = 'Aktywny';
                this.isDisabled = false;
                break;
            case 'Nieaktywny':
                this.statusUser = 'Nieaktywny';
                break;
            case 'Walidowany':
                this.statusUser = 'Walidowany';
                break;
            default:
                this.statusUser = 'Nieaktywny';
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

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
                this.expandedInfluencer.influencer.instagramId
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
                this.expandedInfluencer.influencer.city
            );
            this.editInfluencerFormGroup.controls['noteFromAdmin'].setValue(
                this.expandedInfluencer.influencer.noteFromAdmin
            );
            this.editInfluencerFormGroup.controls[
                'instagramAccountType'
                ].setValue(this.expandedInfluencer.influencer.instagramAccountType);

            this.editInfluencerFormGroup.controls['id'].disable();
        }
    }
}
