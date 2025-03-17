import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselComponent } from '../carousel/carousel.component';
import { CollaborationService } from 'app/feature/collaborations/services/collaboration.service';

@Component({
    selector: 'app-collaboration-ratings',
    standalone: true,
    imports: [FuseCardComponent, MatIconModule, MatButtonModule, CommonModule, MatSelectModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, CarouselComponent],
    providers: [provideNativeDateAdapter()],
    templateUrl: './collaboration-ratings.component.html',
    styleUrl: './collaboration-ratings.component.scss'
})
export class CollaborationRatingsComponent implements OnInit {
    collaborations: any[] = [];
    pagination: any = {};
    selectedRate: { rateStatus: string; appliedOpportunityId: number } | null = null;
    readonly dateRange = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });
    showCarousel: boolean = true;

    constructor(private _collaborationService: CollaborationService) {
    }

    responsiveOptions = [
        { breakpoint: '1600px', numVisible: 6, numScroll: 1 },
        { breakpoint: '1024px', numVisible: 4, numScroll: 1 },
        { breakpoint: '680px', numVisible: 2, numScroll: 1 }
    ]

    options = [
        { value: 'ALL', viewValue: 'Wszystkie' },
        { value: 'DEFAULT', viewValue: 'Nieocenione' },
        { value: 'POSITIVE', viewValue: 'Pozytywnie ocenione' },
        { value: 'NEGATIVE', viewValue: 'Negatywnie ocenione' },
    ];

    ngOnInit(): void {
        // Na starcie ładujemy domyślne dane bez żadnych filtrów:
        this.filterInfluencers(0, 12);
    }

    filterInfluencers(pageStart: number, pageEnd: number): void {
        this.showCarousel = false;
        this._collaborationService
            .getInfluencersToRate(
                "DEFAULT",
                pageStart,
                pageEnd
            )
            .subscribe({
                next: (response: any) => {
                    this.collaborations = [...response];
                    setTimeout(() => {
                        this.showCarousel = true;
                    }, 0);
                },
                error: (err) => {
                    console.error('Błąd podczas pobierania influencerów:', err);
                }
            });
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
        const updates = { rateStatus: this.selectedRate.rateStatus };
        if (this.selectedRate) {
            this._collaborationService.updateAppliedOpportunityStatus(this.selectedRate.appliedOpportunityId, updates).subscribe({
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

