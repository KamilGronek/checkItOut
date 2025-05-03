import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FuseCardComponent } from '@fuse/components/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { CollaborationService } from 'app/feature/collaborations/services/collaboration.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CardScrollDirective } from 'app/shared/directives/card-scroll/card-scroll.directive';

@Component({
    selector: 'app-collaboration-registrations',
    standalone: true,
    imports: [
        FuseCardComponent,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        CarouselComponent,
        MatPaginatorModule,
        CardScrollDirective
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './collaboration-registrations.component.html',
    styleUrls: ['./collaboration-registrations.component.scss', '../../collaboration-companies/collaboration-companies.component.scss']
})
export class CollaborationRegistrationsComponent implements OnInit, AfterViewInit {
    collaborations: any[] = [];
    pagedCollaborations: any[] = [];

    // Search text for filtering collaborations
    searchText: string = '';

    // Pagination properties
    @ViewChild(MatPaginator) paginator: MatPaginator;
    length = 0;
    pageSize = 6;
    pageIndex = 0;
    pageSizeOptions = [3, 6, 12, 24];
    showFirstLastButtons = true;
    showPageSizeOptions = true;
    hidePageSize = false;
    disabled = false;

    showFilters = false;
    acceptShow = null;
    first: number = 0;
    showCarousel: boolean = true;
    minPositiveRates: number;
    followersMin: number = null;
    followersMax: number = null;

    constructor(private _collaborationService: CollaborationService) {
    }

    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    ngOnInit(): void {
        this.filterInfluencers();
    }

    filterInfluencers(): void {
        this.showCarousel = false;
        this._collaborationService
            .getIfluencersToAccept(
                this.followersMin,
                this.followersMax,
                this.minPositiveRates
            )
            .subscribe({
                next: (response: any) => {
                    this.collaborations = [...response];
                    this.length = this.collaborations.length;
                    this.updatePagedData();

                    // We don't need carousel anymore since we're using pagination
                    this.showCarousel = false;
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
        if (this.searchText && this.searchText.trim() !== '') {
            const searchLower = this.searchText.toLowerCase();
            const filteredCollabs = this.collaborations.filter(collab =>
                (collab.influencerFirstName && collab.influencerFirstName.toLowerCase().includes(searchLower)) ||
                (collab.influencerLastName && collab.influencerLastName.toLowerCase().includes(searchLower)) ||
                (collab.email && collab.email.toLowerCase().includes(searchLower))
            );

            this.length = filteredCollabs.length;
            this.collaborations = filteredCollabs;

            // Reset to first page when filtering
            this.pageIndex = 0;
            if (this.paginator) {
                this.paginator.pageIndex = 0;
            }

            this.updatePagedData();
        } else {
            // If search is cleared, reload all influencers
            this.filterInfluencers();
        }
    }

    /**
     * Updates the data for the current page
     */
    private updatePagedData(): void {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.pagedCollaborations = this.collaborations.slice(startIndex, endIndex);
    }

    /**
     * Handles pagination events
     * @param event Pagination event
     */
    handlePageEvent(event: PageEvent): void {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.updatePagedData();
    }

    changeOpportunityStatus(id: number) {
        this._collaborationService.updateAppliedOpportunityStatus(id, this.acceptShow).subscribe({
            next: () => {
                this.filterInfluencers();
            },
            error: (err) => {
                console.error('Błąd podczas aktualizacji statusu:', err);
            }
        });
    }

    /**
     * Initialize the touch scrolling functionality after the view is initialized
     */
    ngAfterViewInit(): void {
        // Manual initialization for cards that might be loaded dynamically
        this.fixFuseCardScrolling();
    }

    /**
     * Applies touch scrolling fix to fuse cards
     */
    private fixFuseCardScrolling(): void {
        const checkAndFix = () => {
            // Get all fuse cards in the document
            const fuseCards = document.querySelectorAll('fuse-card');

            if (fuseCards.length === 0) {
                // If no cards found yet, try again in a moment
                setTimeout(checkAndFix, 1000);
                return;
            }

            fuseCards.forEach(card => {
                // Find the card back container within this card
                const cardBack = card.querySelector('.fuse-card-back');
                if (cardBack) {
                    // Prevent touchmove from being canceled
                    cardBack.addEventListener('touchmove', function(e) {
                        e.stopPropagation();
                    }, { passive: true });
                }
            });

            // Check periodically for new cards that might be added dynamically
            setTimeout(checkAndFix, 2000);
        };

        // Start the process
        checkAndFix();
    }
}
