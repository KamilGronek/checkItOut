import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Influencer } from 'app/services/influencer/Influencer';
import { FinanceService } from 'app/mock-api/dashboards/finance/finance.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'comapanies',
    standalone: true,
    templateUrl: './companies.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe],
})
export class CompaniesComponent implements OnInit, AfterViewInit, OnDestroy
{
    ELEMENT_DATA: Influencer[] = [
        {id: 1, firstName: 'norbert', lastName: 'Marchewka', instagramId: '@caarrotek', apiKey: 'jakisKlucz'},
        {id: 2, firstName: 'jarek', lastName: 'Marchewka', instagramId: '@unnewewe', apiKey: 'jakisKlucz2'},
        {id: 3, firstName: 'jarek', lastName: 'Marchewka', instagramId: '@unnewewe', apiKey: 'jakisKlucz2'},
        {id: 4, firstName: 'jarek', lastName: 'Marchewka', instagramId: '@unnewewe', apiKey: 'jakisKlucz2'},
        {id: 5, firstName: 'jarek', lastName: 'Marchewka', instagramId: '@unnewewe', apiKey: 'jakisKlucz2'},
        {id: 6, firstName: 'jarek', lastName: 'Marchewka', instagramId: '@unnewewe', apiKey: 'jakisKlucz2'},
        {id: 7, firstName: 'jarek', lastName: 'Marchewka', instagramId: '@unnewewe', apiKey: 'jakisKlucz2'},
        {id: 8, firstName: 'jarek', lastName: 'Marchewka', instagramId: '@unnewewe', apiKey: 'jakisKlucz2'},
        {id: 9, firstName: 'jarek', lastName: 'Marchewka', instagramId: '@unnewewe', apiKey: 'jakisKlucz2'}
    ]

    @ViewChild('influencersTable', {read: MatSort}) influencersTableMatSort: MatSort;

    data: any;
    accountBalanceOptions: ApexOptions;
    dataSource: MatTableDataSource<Influencer> =  new MatTableDataSource<Influencer>(this.ELEMENT_DATA);
    influencersTableColumns: string[] = ['id', 'firstName', 'lastName', 'instagramId', 'apiKey'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(private _financeService: FinanceService)
    {

    }
    ngAfterViewInit(): void {
    }

    ngOnInit(): void
    {
        // Get
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
}
