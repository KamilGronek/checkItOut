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
import { ActivatedRoute } from '@angular/router';

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
    ],
    styleUrl: 'newCollaboration-list.styles.css',
})
export class NewCollaborationComponent {
    formFieldHelpers: string[] = [''];

    id: number;
    influencerList: Influencer[];
    collaborationData = {};

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _influencerService: InfluencerService
    ) {}

    ngAfterViewInit(): void {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.id = +params.get('id');

            console.log('id:', this.id);

            this._influencerService
                .getdataJson()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((influencerList) => {
                    this.influencerList = influencerList;

                    this.collaborationData = this.influencerList.find(
                        (item) => item.id === this.id
                    );

                    console.log(this.collaborationData);
                });
        });

        // this._influencerService
        //     .getCollaborationId(this.id)
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((collaborationData: any) => {
        //         this.collaborationData = this.id;
        //     });
    }

    goBackToMain(): void {
        this.router.navigate(['/collaborations']);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
