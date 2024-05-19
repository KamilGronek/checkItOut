import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Influencer } from 'app/services/influencer/Influencer';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { InfluencerService } from 'app/services/influencer/influencer.service';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'influencer-list2',
    standalone: true,
    templateUrl: './posts.component.html',
    styleUrl: './posts.styles.css',
    animations: [
        trigger('detailExpand', [
          state('collapsed,void', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatIconModule, MatMenuModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,  MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe],
})
export class PostsComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('influencersTable', {read: MatSort}) influencersTableMatSort: MatSort;
    data: any;
    influencersDataSource: MatTableDataSource<any> = new MatTableDataSource();
    influencersTableColumns: string[] = ['id', 'firstName', 'lastName', 'instagramId', 'apiKey'];
    columnsToDisplayWithExpand: string[] = [...this.influencersTableColumns, 'expand'];
    expandedInfluencer: Influencer | null;
    formLaunched: boolean = false;
    editformLaunched: boolean = false;
    idOfEditedUser: number;
    flashMessage: 'success' | 'error' | null = null;
    influencerList: Influencer[];
    addInfluencerFormGroup: UntypedFormGroup;
    editInfluencerFormGroup: UntypedFormGroup;
    dataSource: MatTableDataSource<Influencer>;


    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _influencerService: InfluencerService,
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
    )
    {}

    ngOnInit(): void
    {
        this._influencerService.getInfluencerList()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(influencerList => {
            this.influencerList =  influencerList;
            this.influencersDataSource.data = influencerList;
            this.dataSource =  new MatTableDataSource<Influencer>(this.influencerList);
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
     * After view init
     */
    ngAfterViewInit(): void
    {
        this.influencersDataSource.sort = this.influencersTableMatSort;
        this.influencersDataSource._orderData.apply;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    addInfluencer(): void {
        if (this.addInfluencerFormGroup.valid) {
           const influencer: Influencer  = this.addInfluencerFormGroup.getRawValue();
           this._influencerService.addInfluencer(influencer).subscribe(influencer =>
            {
                this.influencerList.push(influencer);
                this.influencersDataSource._updateChangeSubscription();
            });
        }
    }

    updateInfluencer(): void {
        if (this.editInfluencerFormGroup.valid) {
            const influencer: Influencer  = this.editInfluencerFormGroup.getRawValue();
            this._influencerService.updateInfluencer(influencer).subscribe(e =>
             {
                var itemIndex = this.influencerList.findIndex(obj => obj['id'] === this.expandedInfluencer.id);
                this.influencerList[itemIndex] = influencer;
                this.influencersDataSource._updateChangeSubscription();
                this.expandedInfluencer = this.influencerList[itemIndex];
                this.fillEditForm();
             });
         }
    }

    deleteSelectedProduct(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete Influencer',
            message: 'Are you sure you want to remove this Influencer? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) =>
        {
            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // Delete the product on the server
                this._influencerService.deleteInfluencerById(this.expandedInfluencer.id).subscribe((e) =>
                {
                    const itemIndex = this.influencerList.findIndex(obj => obj['id'] === this.expandedInfluencer.id);
                    this.influencerList.splice(itemIndex, 1);
                    this.influencersDataSource._updateChangeSubscription();
                });
            }
        });
    }

    openAddInfluencerForm(): void
    {
        if (!this.formLaunched) {
            this.formLaunched = true;
        } else this.formLaunched = false;
    }

    fillEditForm(): void {
        if(this.expandedInfluencer != null) {
            this.editInfluencerFormGroup.controls['id'].setValue(this.expandedInfluencer.id);
            this.editInfluencerFormGroup.controls['firstName'].setValue(this.expandedInfluencer.firstName);
            this.editInfluencerFormGroup.controls['lastName'].setValue(this.expandedInfluencer.lastName);
            this.editInfluencerFormGroup.controls['instagramId'].setValue(this.expandedInfluencer.instagramId);
            this.editInfluencerFormGroup.controls['apiKey'].setValue(this.expandedInfluencer.apiKey);

            this.editInfluencerFormGroup.controls['id'].disable();
        }
    }
}
