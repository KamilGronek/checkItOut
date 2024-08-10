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
} from '@angular/core';

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
// import { Influencer } from '../../../services/influencer/Influencer';
import { Influencer } from 'app/services/influencer/Influencer';

import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
// import { InfluencerService } from '../../../services/influencer/collaborations.service';
import { InfluencerService } from 'app/services/influencer/influencer.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { animate, state, style, transition, trigger } from '@angular/animations';

// import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import {MatCardModule} from '@angular/material/card';
// import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'collaborations',
    standalone: true,
    templateUrl: './collaborations.component.html',
    encapsulation: ViewEncapsulation.None,
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
    ],
    styleUrl: 'collaborations-list.styles.css',
})
export class CollaborationsComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('influencersTable', { read: MatSort })
    influencersTableMatSort: MatSort;
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
    addInfluencerFormGroup: UntypedFormGroup;
    editInfluencerFormGroup: UntypedFormGroup;
    dataSource: MatTableDataSource<Influencer>;

    res = '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _influencerService: InfluencerService,
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngAfterViewInit(): void {}

    ngOnInit(): void {
        this._influencerService
            .getInfluencerList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((influencerList) => {
                this.influencerList = influencerList;
                this.influencersDataSource.data = influencerList;
                // this.dataSource = new MatTableDataSource<Influencer>(
                //     this.influencerList
                // );
            });

        // Create the selected product form
        this.addInfluencerFormGroup = this._formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            instagramId: ['', [Validators.required]],
            apiKey: ['', [Validators.required]],
        });

        this.editInfluencerFormGroup = this._formBuilder.group({
            id: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            instagramId: ['', [Validators.required]],
            apiKey: ['', [Validators.required]],
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    readonly dialog = inject(MatDialog);

    openDescription(idCollabo: any) {
        const product = this.dataJson.find(
            (product) => product.id === idCollabo
        );
        if (product) {
            const dialogRef = this.dialog.open(DialogContentExampleDialog, {
                data: { firstName: product.firstName },
            });

            dialogRef.afterClosed().subscribe((result) => {
                console.log(`Dialog result: ${result}`);
            });
        } else {
            console.log('false');
        }
    }

    takePart(idCollabo: any) {
        const product = this.dataJson.find(
            (product) => product.id === idCollabo
        );
        if (product) {
            const dialogRef = this.dialog.open(LetsActiveAccount, {
                data: { firstName: product.firstName },
            });

            dialogRef.afterClosed().subscribe((result) => {
                console.log(`Dialog result: ${result}`);
            });
        } else {
            console.log('false');
        }
    }

    dataJson = [
        {
            id: '1',
            firstName: 'Salon Fryzjerksi',
            lastName: 'Wrocław',
            instagramId: '@fastCat',
            images: 'https://i.pinimg.com/736x/90/0d/4b/900d4b106c5484f0765396d0e69ab850.jpg',
        },
        {
            id: '2',
            firstName: 'Restauracja Galeon',
            lastName: 'Warszawa',
            instagramId: '@gessler',
            images: 'https://i.pinimg.com/736x/b8/3c/92/b83c92b2bfa0e34179de0954c2e1acf9.jpg',
        },
        {
            id: '3',
            firstName: 'Cukiernia u Jagody',
            lastName: 'Poznań',
            instagramId: '@jagodzianka',
            images: 'https://i.pinimg.com/736x/79/e8/16/79e81634cbd224b9feb85646384240ce.jpg',
        },
        {
            id: '4',
            firstName: 'Smart Kids Planet',
            lastName: 'Warszawa',
            instagramId: '@fso',
            images: 'https://i.pinimg.com/736x/0c/8e/f1/0c8ef1e0828fe50c2bf0d4459c516c46.jpg',
        },
        {
            id: '5',
            firstName: 'Escape Room',
            lastName: 'Wrocław',
            instagramId: '@escapeRoom',
            images: 'https://i.pinimg.com/736x/9d/c1/2f/9dc12fec4a03efe8217763c8919ba997.jpg',
        },
        {
            id: '6',
            firstName: 'Kwiaciarnia u Gabrieli',
            lastName: 'Łeba',
            instagramId: '@gabriela_kwiaty',
            images: 'https://i.pinimg.com/236x/3c/4f/b9/3c4fb9fe635381f36fe18f9fbb49ee2d.jpg',
        },
        {
            id: '7',
            firstName: 'Sexblowsion',
            lastName: 'Warszawa',
            instagramId: '@sexblowsion',
            images: 'https://i.pinimg.com/236x/54/a1/8e/54a18e4d96c3a867b9bf0cd23991f1b8.jpg',
        },
        {
            id: '8',
            firstName: 'Coffee shop Amnezja',
            lastName: 'Radom',
            instagramId: '@amnezja',
            images: 'https://i.pinimg.com/736x/77/28/67/772867c683ee3e149edb327297b86e61.jpg',
        },
        {
            id: '9',
            firstName: 'Przedszkole "Mały Diabełek"',
            lastName: 'Łysa Góra',
            instagramId: '@spij_kochanie_spij',
            images: 'https://i.pinimg.com/736x/da/bf/c8/dabfc884b236cd9703590c54a5faef79.jpg',
        },
    ];
}

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-content-example-dialog.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentExampleDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { firstName: string }) {}
}

@Component({
    selector: 'letsActiveAccountModal',
    templateUrl: 'letsActiveAccountModal.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetsActiveAccount {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { firstName: string }) {}
}
