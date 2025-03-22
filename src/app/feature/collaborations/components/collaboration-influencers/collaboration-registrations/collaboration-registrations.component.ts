import {Component, OnInit} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {FuseCardComponent} from '@fuse/components/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {InfluencerService} from 'app/feature/influencers/services/influencer.service';
import {CarouselModule} from 'primeng/carousel';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
    selector: 'app-collaboration-registrations',
    standalone: true,
    imports: [
        FuseCardComponent,
        CommonModule,
        CarouselModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        FormsModule
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './collaboration-registrations.component.html',
    styleUrls: ['./collaboration-registrations.component.scss']
})
export class CollaborationRegistrationsComponent implements OnInit {
    influencers: any[] = [];
    pagination: any = {};
    showFilters = false;
    acceptShow = null;
    first: number = 0;
    showCarousel: boolean = true;
    minPositiveRates: number;
    followersMin: number = null;
    followersMax: number = null;

    constructor(private _influencerService: InfluencerService) {
    }

    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    responsiveOptions = [
        {breakpoint: '1600px', numVisible: 3, numScroll: 1},
        {breakpoint: '1024px', numVisible: 2, numScroll: 1},
        {breakpoint: '680px', numVisible: 1, numScroll: 1}
    ];

    ngOnInit(): void {
        this.filterInfluencers();
    }

    filterInfluencers(): void {
        this.showCarousel = false;
        this._influencerService
            .getIfluencersToAccept(
                this.followersMin,
                this.followersMax,
                this.minPositiveRates
            )
            .subscribe({
                next: (response: any) => {
                    this.influencers = [...response.content];
                    setTimeout(() => {
                        this.showCarousel = true;
                    }, 0);
                },
                error: (err) => {
                    console.error('Błąd podczas pobierania influencerów:', err);
                }
            });
    }

    // Obsługa zdarzenia zmiany strony (przewinięcia carouselu)
    onPageChange(event: any): void {
        console.log('Page event:', event);
    }

    changeOpportunityStatus(id: number) {
        const updates = {opportunityStatus: this.acceptShow ? 'ACCEPTED' : 'REJECTED'};
        this._influencerService.updateAppliedOpportunityStatus(id, updates).subscribe({
            next: () => {
                this.filterInfluencers();
            },
            error: (err) => {
                console.error('Błąd podczas aktualizacji statusu:', err);
            }
        });
    }

}
