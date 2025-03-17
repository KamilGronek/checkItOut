import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FuseCardComponent } from '@fuse/components/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from '../collaboration-influencers/carousel/carousel.component';
import { CollaborationService } from '../../services/collaboration.service';
import { CollaborationCompaniesStepperComponent } from './collaboration-companies-stepper.component';

@Component({
    selector: 'app-collaboration-companies',
    standalone: true,
    imports: [FuseCardComponent,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        CarouselComponent, CollaborationCompaniesStepperComponent],
    templateUrl: './collaboration-companies.component.html',
    styleUrls: ['./collaboration-companies.component..scss']
})
export class CollaborationCompaniesComponent implements OnInit {
    collaborations: any[] = [];
    pagination: any = {};
    showFilters = false;
    acceptShow = null;
    showCarousel: boolean = true;
    constructor(private _collaborationService: CollaborationService) {
    }

    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    ngOnInit(): void {
        this.filterCompanies();
    }

    isExpiringSoon(dateStr: string): boolean {
        const endDate = new Date(dateStr);
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        // Jeśli data zakończenia jest wcześniejsza lub równa dacie za tydzień, zwróć true
        return endDate.getTime() <= oneWeekFromNow.getTime();
    }
    // TODO: przerobić na odpowiedniego scrolla aby przewijało do odpowiedniego statusu na tyle karty
    scrollToBottom(): void {
        setTimeout(() => {
            const fuseCardBack = document.querySelector('.fuse-card-back') as HTMLElement;
            if (!fuseCardBack) {
                console.error('Element fuse-card-back nie został znaleziony.');
                return;
            }
            fuseCardBack.scrollTop = fuseCardBack.scrollHeight;
        }, 10);
    }

    filterCompanies(): void {
        this._collaborationService.getCollaborationsInProgress().subscribe((companies: any) => {
            this.collaborations = companies;
            // this.pagination = {
            //     total: companies.length,
            //     page: 1,
            //     perPage: 5
            // };
            this.collaborations = [...this.collaborations,  {
                "id": 3,
                "influencerFirstName": "Krystyna",
                "influencerLastName": "Nowakowska",
                "companyName": "EcoGay",
                "influencerEmail": "krystynanowakowska34@wp.pl",
                "influencerInstagramId": "KN",
                "followersAmount": 4343,
                "influencerAvatarUrl": "data:image/png;base64,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",
                "companyAvatarUrl": "https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/Color-Pride-Flag?qlt=82&wid=1024&ts=1670909834760&dpr=off&fit=constrain&fmt=png-alpha",
                "appliedOpportunityId": 2,
                "appliedOpportunityStatus": "REJECTED_BY_COMPANY",
                "partnershipOpportunityTitle": "Sustainability Showcase",
                "appliedOpportunityNote": "Excited to collaborate on sustainability projects.",
                "rateStatus": "DEFAULT",
                "positiveRatesAmount": 0,
                "negativeRatesAmount": 0
            },];
        });
    }
}
