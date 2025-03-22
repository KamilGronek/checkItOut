import {Component, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {FuseCardComponent} from '@fuse/components/card';
import {CommonModule} from '@angular/common';
import {InfluencerService} from 'app/feature/influencers/services/influencer.service';
import {CarouselModule} from 'primeng/carousel';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-collaboration-ratings',
    standalone: true,
    imports: [FuseCardComponent, MatIconModule, MatButtonModule, CommonModule, CarouselModule, MatSelectModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule],
    providers: [provideNativeDateAdapter()],
    templateUrl: './collaboration-ratings.component.html',
    styleUrl: './collaboration-ratings.component.scss'
})
export class CollaborationRatingsComponent implements OnInit {
    influencers: any[] = [];
    pagination: any = {};
    selectedRate: { rateStatus: string; appliedOpportunityId: number } | null = null;
    showFilters = false;
    selectedOption: string = 'ALL';
    readonly dateRange = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });
    showCarousel: boolean = true;
    first: number = 0;

    constructor(private _influencerService: InfluencerService) {
    }

    options = [
        {value: 'ALL', viewValue: 'Wszystkie'},
        {value: 'DEFAULT', viewValue: 'Nieocenione'},
        {value: 'POSITIVE', viewValue: 'Pozytywnie ocenione'},
        {value: 'NEGATIVE', viewValue: 'Negatywnie ocenione'},
    ];

    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    responsiveOptions = [
        {
            breakpoint: '1600px', // Ekrany do 1600px
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '1024px', // Ekrany do 1024px
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '680px', // Ekrany do 480px (telefony)
            numVisible: 1,
            numScroll: 1
        }
    ];

    ngOnInit(): void {
        // Na starcie ładujemy domyślne dane bez żadnych filtrów:
        this.filterInfluencers(0, 12);
    }

    filterInfluencers(pageStart: number, pageEnd: number): void {
        this.showCarousel = false;
        this._influencerService
            .getInfluencersToRate(
                this.selectedOption,
                "DONE",
                this.dateRange.value.start ? this.formatDateToISOString(this.dateRange.value.start) : null,
                this.dateRange.value.end ? this.formatDateToISOString(this.dateRange.value.end) : null,
                pageStart,
                pageEnd
            )
            .subscribe({
                next: (response: any) => {
                    this.influencers = [...response.content];
                    this.first = 0;
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

    private formatDateToISOString(date: Date): string {
        return date.toISOString();
    }

    /**
     * Ustawia wartość rateStatus i ID współpracy
     */
    setRateStatus(rateStatus: string, influencerId: number): void {
        this.resetRateStatus();
        this.selectedRate = {
            rateStatus,
            appliedOpportunityId: influencerId
        };
    }

    /**
     * Wysyła ocenę do serwisu po potwierdzeniu
     */
    confirmRateStatus(): void {
        const updates = {rateStatus: this.selectedRate.rateStatus};
        if (this.selectedRate) {
            this._influencerService.updateAppliedOpportunityStatus(this.selectedRate.appliedOpportunityId, updates).subscribe({
                next: () => {
                    console.log('Status zaktualizowany!');
                    //zmiana statusu influencera
                    this.filterInfluencers(0, 12);
                    this.resetRateStatus();
                },
                error: (err) => {
                    console.error('Błąd podczas aktualizacji statusu:', err);
                }
            });
        }
    }

    resetRateStatus(): void {
        this.selectedRate = null;
    }

}

