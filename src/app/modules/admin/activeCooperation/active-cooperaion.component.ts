import { Component } from '@angular/core';
import { CooperationRatesComponent } from './cooperation-rates/cooperation-rates.component';
import { PendingReportsComponent } from './pending-reports/pending-reports.component';

@Component({
  selector: 'app-active-cooperaion',
  standalone: true,
  imports: [CooperationRatesComponent, PendingReportsComponent],
  templateUrl: './active-cooperaion.component.html',
})
export class ActiveCooperaionComponent {}
