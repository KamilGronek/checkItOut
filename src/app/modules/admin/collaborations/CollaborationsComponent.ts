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
import { FuseCardComponent } from '@fuse/components/card';

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
        FuseCardComponent,
    ],
    styleUrl: 'collaborations-list.styles.css',
})
export class CollaborationsComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('influencersTable', { read: MatSort })
    // @ViewChildren(FuseCardComponent, { read: ElementRef })
    // private _fuseCards: QueryList<ElementRef>;
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
        private _fuseConfirmationService: FuseConfirmationService,
        private router: Router
    ) {}

    ngAfterViewInit(): void {}

    ngOnInit(): void {
        this._influencerService
            .getdataJson()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((influencerList) => {
                this.influencerList = influencerList;
            });

        // this._influencerService
        //     .getCollaborations()
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((influencerList: Influencer[]) => {
        //         this.influencerList = influencerList;
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    readonly dialog = inject(MatDialog);

    // openDescription(idCollabo: any) {
    //     const product = this.dataJson.find(
    //         (product) => product.id === idCollabo
    //     );
    //     if (product) {
    //         const dialogRef = this.dialog.open(DialogContentExampleDialog, {
    //             data: { firstName: product.firstName },
    //         });

    //         dialogRef.afterClosed().subscribe((result) => {
    //             console.log(`Dialog result: ${result}`);
    //         });
    //     } else {
    //         console.log('false');
    //     }
    // }

    // takePart(idCollabo: any) {
    //     const product = this.dataJson.find(
    //         (product) => product.id === idCollabo
    //     );
    //     if (product) {
    //         const dialogRef = this.dialog.open(LetsActiveAccount, {
    //             data: { firstName: product.firstName },
    //         });

    //         dialogRef.afterClosed().subscribe((result) => {
    //             console.log(`Dialog result: ${result}`);
    //         });
    //     } else {
    //         console.log('false');
    //     }
    // }

    goToDetails(id: number): void {
        this.router.navigate(['/collaborations', id]);
        console.log(`Navigating to /collaborations/${id}`);
    }
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
