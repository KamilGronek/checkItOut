import { Component, Input } from '@angular/core';
import { StepperComponent, Step } from '@fuse/components/stepper/stepper';
import jsonData from './statuses.json';

@Component({
    selector: 'app-collaboration-companies-stepper',
    standalone: true,
    imports: [StepperComponent],
    template: `<app-stepper [steps]="stepsData" [currentStep]="currentStep"></app-stepper>`,
})
export class CollaborationCompaniesStepperComponent {
    @Input() currentStatus: string;
    public stepsData: Step[] = jsonData;

    get currentStep(): Step {
        return this.stepsData.find(step => step.code === this.currentStatus);
    }
}