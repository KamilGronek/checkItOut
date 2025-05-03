import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-collaboration-ratings',
    standalone: true,
    imports: [
        FuseCardComponent,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        CarouselComponent,
        MatPaginatorModule,
        MatInputModule
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './collaboration-ratings.component.html',
    styleUrls: ['./collaboration-ratings.component.scss', '../../collaboration-companies/collaboration-companies.component.scss']
})
export class CollaborationRatingsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;

    collaborations: any[] = [];
    filteredCollaborations: any[] = []; // Collaborations after filtering
    displayedCollaborations: any[] = []; // Collaborations for current page
    pagination: any = {};
    selectedRate: { rateStatus: string; appliedOpportunityId: number } | null = null;
    readonly dateRange = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });
    showCarousel: boolean = true;

    // Search property
    searchText: string = '';

    // Pagination properties
    pageSize: number = 8;
    pageIndex: number = 0;

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
        // Store the current state of ratings
        const currentRatings = new Map();
        this.collaborations.forEach(collab => {
            if (collab.selectedRating) {
                currentRatings.set(collab.id, collab.selectedRating);
            }
        });

        this._collaborationService
            .getInfluencersToRate(
                "DEFAULT",
                pageStart,
                pageEnd
            )
            .subscribe({
                next: (response: any) => {
                    // Apply the stored ratings to the new data
                    const updatedResponse = response.map(collab => {
                        if (currentRatings.has(collab.id)) {
                            collab.selectedRating = currentRatings.get(collab.id);
                        }
                        return collab;
                    });

                    this.collaborations = [...updatedResponse];
                    this.filteredCollaborations = [...this.collaborations];
                    // Set displayed collaborations based on current page
                    this.updateDisplayedCollaborations();
                },
                error: (err) => {
                    console.error('Błąd podczas pobierania influencerów:', err);
                }
            });
    }

    /**
     * Filter opportunities based on search text
     */
    filterOpportunities(): void {
        if (!this.searchText || this.searchText.trim() === '') {
            this.filteredCollaborations = [...this.collaborations];
        } else {
            const searchTextLower = this.searchText.toLowerCase();
            this.filteredCollaborations = this.collaborations.filter(collab =>
                (collab.influencerFirstName?.toLowerCase().includes(searchTextLower) ||
                collab.influencerLastName?.toLowerCase().includes(searchTextLower))
            );
        }

        // Reset to first page when filtering
        this.pageIndex = 0;
        if (this.paginator) {
            this.paginator.pageIndex = 0;
        }

        this.updateDisplayedCollaborations();
    }

    /**
     * Update the displayed collaborations based on the current page
     */
    updateDisplayedCollaborations(): void {
        const start = this.pageIndex * this.pageSize;
        const end = start + this.pageSize;
        this.displayedCollaborations = this.filteredCollaborations.slice(start, end);
    }

    /**
     * Handle paginator events
     */
    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.updateDisplayedCollaborations();
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

        // Find the collaboration and set its selected rating
        const collaboration = this.collaborations.find(collab => collab.id === influencerId);
        if (collaboration) {
            collaboration.selectedRating = rateStatus;
        }
    }

    /**
     * Sets the rate status and flips the card
     */
    setRateStatusAndFlip(rateStatus: string, influencerId: number, card: any): void {
        this.setRateStatus(rateStatus, influencerId);
        card.face = 'back';
    }

    /**
     * Wysyła ocenę do serwisu po potwierdzeniu
     */
    confirmRateStatus(): void {
        if (this.selectedRate) {
            const updates = { rateStatus: this.selectedRate.rateStatus };
            const ratedCollaboration = this.collaborations.find(
                collab => collab.id === this.selectedRate.appliedOpportunityId
            );
            const selectedRating = this.selectedRate.rateStatus;

            this._collaborationService.updateAppliedOpportunityRate(this.selectedRate.appliedOpportunityId, updates).subscribe({
                next: () => {
                    console.log('Status zaktualizowany!');
                    // Get fresh data but preserve the rating UI state
                    const currentAppliedOpportunityId = this.selectedRate?.appliedOpportunityId;
                    const currentRateStatus = this.selectedRate?.rateStatus;

                    // Reload data with the same page index
                    this.filterInfluencers(0, 12);

                    // Show a success message
                    this.showSuccessMessage(ratedCollaboration, selectedRating);
                },
                error: (err) => {
                    console.error('Błąd podczas aktualizacji statusu:', err);
                }
            });
        }
    }

    /**
     * Shows a success message after rating
     */
    showSuccessMessage(collaboration: any, rating: string): void {
        // Here you could implement a toast or snackbar notification
        // For now, we'll just log to console
        console.log(`Successfully rated ${collaboration.influencerFirstName} ${collaboration.influencerLastName} as ${rating}`);
    }

    resetRateStatus(): void {
        // If there's a selected collaboration, clear its selectedRating
        if (this.selectedRate) {
            const collaboration = this.collaborations.find(
                collab => collab.id === this.selectedRate.appliedOpportunityId
            );
            if (collaboration) {
                collaboration.selectedRating = null;
            }
        }
        this.selectedRate = null;
    }
}
