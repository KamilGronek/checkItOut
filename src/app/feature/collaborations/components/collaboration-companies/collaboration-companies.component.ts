import { Component, Input, OnInit } from '@angular/core';
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
import jsonData from './statuses.json';
import { Step, ViewType } from '@fuse/components/stepper/stepper';

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
    @Input() viewType: ViewType = ViewType.INFLUENCER;
    collaborations: any[] = [];
    pagination: any = {};
    showFilters = false;
    acceptShow = null;
    showCarousel: boolean = true;
    public dataFromJson: any[] = jsonData;
    public stepsData: Step[];

    // Możliwe statusy do wyboru
    statuses: any[];

    // Obiekt filtra
    filter = {
        opportunityStatusFilter: [] as string[],
    };

    constructor(private _collaborationService: CollaborationService) {
    }

    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    ngOnInit(): void {
        this.filterOpportunities();
        this.stepsData = this.dataFromJson.map((step: Step) => {
            if (step.questionType === this.viewType) {
                return { ...step };
            } else {
                const { question, ...rest } = step;
                return rest;
            }
        });

        this.statuses = this.stepsData
            .filter(step => step.statusNumber > 1)
            .map(step => ({
                name: step.title,
                value: step.code
            }));

    }

    isExpiringSoon(dateStr: string): boolean {
        const endDate = new Date(dateStr);
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        // Jeśli data zakończenia jest wcześniejsza lub równa dacie za tydzień, zwróć true
        return endDate.getTime() <= oneWeekFromNow.getTime();
    }


    filterOpportunities(): void {
        this.showCarousel = false;
        this.collaborations = [];
        this._collaborationService.getCollaborationsInProgress(this.filter).subscribe((companies: any) => {
            this.collaborations = companies;
            this.collaborations = this.collaborations.map((collab: any) => {
                const matchedStep = this.stepsData.find(step => step.code === collab.appliedOpportunityStatus
                );
                return {
                    ...collab,
                    title: matchedStep ? matchedStep.title : '',
                    question: matchedStep ? matchedStep.question : null,
                };
            });
            setTimeout(() => {
                this.showCarousel = true;
            }, 0);
        });
    }

    changeOpportunityStatus(id: number) {
        this._collaborationService.updateAppliedOpportunityStatus(id, this.acceptShow).subscribe({
            next: () => {
                this.filterOpportunities();
            },
            error: (err) => {
                console.error('Błąd podczas aktualizacji statusu:', err);
            }
        });
    }
}
