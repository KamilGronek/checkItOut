import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FuseCardComponent } from '@fuse/components/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CollaborationService } from '../../services/collaboration.service';
import { CollaborationCompaniesStepperComponent } from './collaboration-companies-stepper.component';
import { CardScrollDirective } from 'app/shared/directives/card-scroll/card-scroll.directive';
import jsonData from './statuses.json';
import { Step, ViewType } from '../stepper/stepper';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

/**
 * Component for displaying and managing collaborations between companies and influencers
 */
@Component({
    selector: 'app-collaboration-companies',
    standalone: true,
    imports: [
        FuseCardComponent,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        CollaborationCompaniesStepperComponent,
        CardScrollDirective,
        MatProgressBar,
        MatPaginatorModule
    ],
    templateUrl: './collaboration-companies.component.html',
    styleUrls: ['./collaboration-companies.component.scss']
})
export class CollaborationCompaniesComponent implements OnInit, AfterViewInit {
    /** View type (INFLUENCER or COMPANY) */
    @Input() viewType: ViewType = ViewType.INFLUENCER;

    /** Get all card components */
    @ViewChildren(FuseCardComponent) fuseCards!: QueryList<FuseCardComponent>;

    /** List of collaborations to display */
    collaborations: any[] = [];

    /** List of current page collaborations */
    pagedCollaborations: any[] = [];

    /** Pagination information */
    @ViewChild(MatPaginator) paginator: MatPaginator;
    length = 0;
    pageSize = 6;
    pageIndex = 0;
    pageSizeOptions = [3, 6, 12, 24];
    showFirstLastButtons = true;
    showPageSizeOptions = true;
    hidePageSize = false;
    disabled = false;

    /** Flag to show/hide filters */
    showFilters = false;

    /** Acceptance status for each collaboration (mapped by ID) */
    private collaborationStatusMap = new Map<number, boolean | null>();

    /** Flag to control carousel visibility */
    showCarousel: boolean = true;

    /** Search text for filtering collaborations */
    searchText: string = '';

    /** Data loaded from JSON file */
    public dataFromJson: any[] = jsonData;

    /** Processed steps data */
    public stepsData: Step[] = [];

    /** Available statuses for filtering */
    statuses: any[] = [];

    /** Filter configuration */
    filter = {
        opportunityStatusFilter: [] as string[],
    };

    /** Map to store collaboration IDs to their corresponding card indexes */
    private collabToCardMap = new Map<number, number>();

    /**
     * Constructor
     * @param _collaborationService Service for collaboration operations
     */
    constructor(private _collaborationService: CollaborationService) {}

    /**
     * Toggle visibility of filters section
     */
    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    /**
     * Initialize component
     */
    ngOnInit(): void {
        this.initializeStepsData();
        this.loadCollaborations();
    }

    /**
     * Initialize steps data from JSON
     */
    private initializeStepsData(): void {
        // Process steps based on view type
        this.stepsData = this.dataFromJson.map((step: Step) => {
            if (step.questionType === this.viewType) {
                return { ...step };
            } else {
                const { question, ...rest } = step;
                return rest;
            }
        });

        // Extract statuses from steps data
        this.statuses = this.stepsData
            .filter(step => step.statusNumber > 1)
            .map(step => ({
                name: step.title,
                value: step.code
            }));
    }

    /**
     * After view initialized, setup card tracking
     */
    ngAfterViewInit(): void {
        this.fixFuseCardScrolling();
        // Initialize the card mapping after view has been initialized and cards are rendered
        this.updateCardMapping();
    }

    /**
     * Updates the mapping between collaboration IDs and card indexes
     * Called after collaborations are loaded and after page changes
     */
    private updateCardMapping(): void {
        setTimeout(() => {
            this.collabToCardMap.clear();
            if (this.pagedCollaborations && this.fuseCards) {
                this.pagedCollaborations.forEach((collab, index) => {
                    this.collabToCardMap.set(collab.id, index);
                });
            }
        });
    }

    /**
     * Gets the FuseCardComponent for a specific collaboration
     * @param collab The collaboration object
     * @returns The FuseCardComponent for the collaboration, or undefined if not found
     */
    private getCardForCollab(collab: any): FuseCardComponent | undefined {
        if (!this.fuseCards || !collab) return undefined;

        const cardIndex = this.collabToCardMap.get(collab.id);
        if (cardIndex === undefined) return undefined;

        const cardsArray = this.fuseCards.toArray();
        return cardIndex < cardsArray.length ? cardsArray[cardIndex] : undefined;
    }

    /**
     * Console logs for debugging (to be removed in production)
     */
    logStatus(collabId: number): void {
        console.log('Status for collab', collabId, ':', this.collaborationStatusMap.get(collabId));
    }

    /**
     * Gets the acceptance status for a specific collaboration
     * @param collabId The collaboration ID
     * @returns The acceptance status (true, false, or null)
     */
    getAcceptStatus(collabId: number): boolean | null {
        return this.collaborationStatusMap.get(collabId) ?? null;
    }

    /**
     * Flips a specific card to back side and sets the acceptance status
     * @param collab The collaboration to flip
     * @param status The acceptance status (true, false, or null)
     */
    flipCardWithStatus(collab: any, status: boolean | null): void {
        const card = this.getCardForCollab(collab);
        if (card) {
            // Set the status first to ensure it's available when the card flips
            this.collaborationStatusMap.set(collab.id, status);

            // Short delay to ensure the status is set before flipping
            setTimeout(() => {
                card.face = 'back';
                console.log('Card flipped with status:', status, 'for collab:', collab.id);
            }, 10);
        }
    }

    /**
     * Flips a specific card back to front side
     * @param collab The collaboration to flip back
     */
    flipCardBack(collab: any): void {
        const card = this.getCardForCollab(collab);
        if (card) {
            // Important: set face to front first, then clear status to avoid
            // flickering between confirmation and stepper views
            card.face = 'front';

            // Delay clearing the status to prevent flickering
            setTimeout(() => {
                this.collaborationStatusMap.set(collab.id, null);
            }, 300); // Match this to the card flip animation duration
        }
    }

    /**
     * Check if a date is expiring soon (within one week)
     * @param dateStr Date string to check
     * @returns True if the date is within one week
     */
    isExpiringSoon(dateStr: string): boolean {
        const endDate = new Date(dateStr);
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return endDate.getTime() <= oneWeekFromNow.getTime();
    }

    /**
     * Load collaborations with applied filters
     */
    loadCollaborations(): void {
        this.filterOpportunities();
    }

    /**
     * Filter opportunities based on current filter settings
     */
    filterOpportunities(): void {
        this._collaborationService.getCollaborationsInProgress(this.filter).subscribe({
            next: (companies: any) => {
                this.processCollaborationsData(companies);
            },
            error: (error) => {
                console.error('Error loading collaborations:', error);
            }
        });
    }

    /**
     * Process raw collaborations data
     * @param rawData Raw collaborations data from API
     */
    private processCollaborationsData(rawData: any): void {
        // Parse the data based on view type
        let processedCollabs = this._collaborationService.parseCollaborationInProgressData(
            rawData,
            this.viewType
        );

        // Apply search filter if text exists
        if (this.searchText && this.searchText.trim() !== '') {
            const searchLower = this.searchText.toLowerCase();
            processedCollabs = processedCollabs.filter(collab =>
                (collab.name && collab.name.toLowerCase().includes(searchLower)) ||
                (collab.partnershipOpportunityTitle && collab.partnershipOpportunityTitle.toLowerCase().includes(searchLower))
            );
        }

        // Enhance data with title and question information
        this.collaborations = processedCollabs.map((collab: any) => {
            const matchedStep = this.stepsData.find(
                step => step.code === collab.appliedOpportunityStatus
            );

            return {
                ...collab,
                title: matchedStep ? matchedStep.title : '',
                question: matchedStep ? matchedStep.question : null,
            };
        });

        // Update length and reset to first page if necessary
        this.length = this.collaborations.length;
        if (this.paginator && this.pageIndex > 0 && this.pageIndex >= Math.ceil(this.length / this.pageSize)) {
            this.pageIndex = 0;
            this.paginator.pageIndex = 0;
        }

        // Update the paged data
        this.updatePagedData();

        // Update card mapping after collaborations are processed
        setTimeout(() => this.updateCardMapping(), 100);
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

        // Update card mapping after page change
        setTimeout(() => this.updateCardMapping(), 100);
    }

    /**
     * Change the status of an opportunity
     * @param id ID of the opportunity to update
     */
    changeOpportunityStatus(id: number): void {
        const status = this.collaborationStatusMap.get(id);
        if (status === undefined || status === null) {
            console.error('Accept status is not set for collaboration:', id);
            return;
        }

        // Find the collaboration by ID
        const collab = this.pagedCollaborations.find(c => c.id === id);
        if (!collab) {
            console.error('Collaboration not found:', id);
            return;
        }

        // Get the card first for later use
        const card = this.getCardForCollab(collab);

        this._collaborationService.updateAppliedOpportunityStatus(id, status).subscribe({
            next: () => {
                // Flip the card first to avoid flickering
                if (card) {
                    card.face = 'front';
                }

                // Only clear the status after the card is flipped
                setTimeout(() => {
                    this.collaborationStatusMap.delete(id);
                    this.filterOpportunities();
                }, 300);
            },
            error: (err) => {
                console.error('Error updating status:', err);
            }
        });
    }

    /**
     * Applies touch scrolling fix to fuse cards
     * This method implements the fix directly in the component
     * as a complement to the directive approach
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
