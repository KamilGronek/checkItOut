import { Component, OnInit } from '@angular/core';
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
        CarouselComponent
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './collaboration-registrations.component.html',
    styleUrls: ['./collaboration-registrations.component.scss']
})
export class CollaborationRegistrationsComponent implements OnInit {
    collaborations: any[] = [];
    pagination: any = {};
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
                    setTimeout(() => {
                        this.showCarousel = true;
                    }, 0);
                },
                error: (err) => {
                    console.error('Błąd podczas pobierania influencerów:', err);
                }
            });
    }

    changeOpportunityStatus(id: number) {
        const updates = { opportunityStatus: this.acceptShow ? 'ACCEPTED' : 'REJECTED' };
        this._collaborationService.updateAppliedOpportunityStatus(id, updates).subscribe({
            next: () => {
                this.filterInfluencers();
            },
            error: (err) => {
                console.error('Błąd podczas aktualizacji statusu:', err);
            }
        });
    }

}
