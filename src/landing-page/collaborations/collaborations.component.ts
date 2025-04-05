import {Component, Input, OnInit} from '@angular/core';
import {
    CarouselComponent
} from "../../app/feature/collaborations/components/collaboration-influencers/carousel/carousel.component";
import {
    CollaborationCompaniesStepperComponent
} from "../../app/feature/collaborations/components/collaboration-companies/collaboration-companies-stepper.component";
import {FuseCardComponent} from "../../@fuse/components/card";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {Step, ViewType} from "../../@fuse/components/stepper/stepper";
import jsonData from "../../app/feature/collaborations/components/collaboration-companies/statuses.json";
import {ButtonComponent} from "../../app/shared/components/ui/button/button.component";

@Component({
    selector: 'app-collaborations',
    standalone: true,
    imports: [
        CarouselComponent,
        CollaborationCompaniesStepperComponent,
        FuseCardComponent,
        MatIcon,
        MatIconButton,
        NgIf,
        ButtonComponent
    ],
    templateUrl: './collaborations.component.html',
    styleUrl: './collaborations.component.scss'
})
export class CollaborationsComponent implements OnInit {
    @Input() collaborations: any[] = [];
    @Input() viewType: ViewType;
    public dataFromJson: any[] = jsonData;
    public stepsData: Step[];

    ngOnInit(): void {
        this.stepsData = this.dataFromJson.map((step: Step) => {
            if (step.questionType === this.viewType) {
                return {...step};
            } else {
                const {question, ...rest} = step;
                return rest;
            }
        });
        this.collaborations = this.collaborations.map((collab: any) => {
            const matchedStep = this.stepsData.find(step => step.code === collab.appliedOpportunityStatus
            );
            return {
                ...collab,
                title: matchedStep ? matchedStep.title : '',
                question: matchedStep ? matchedStep.question : null,
            };
        });
    }
}
