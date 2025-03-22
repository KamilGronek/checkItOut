import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface Step {
    code: string;
    statusNumber: number;
    title: string;
    description: string;
    statusType: string;
    question?: string;
    questionType?: ViewType;
}

export enum ViewType {
    COMPANY = "COMPANY",
   INFLUENCER = "INFLUENCER"
}

@Component({
    selector: 'app-stepper',
    standalone: true,
    imports: [MatIcon, CommonModule],
    templateUrl: './stepper.html',
})
export class StepperComponent implements AfterViewInit {
    // Lista kroków do wyświetlenia
    @Input() steps: Step[] = [];
    // Indeks aktualnego etapu (0-indexowany)
    @Input() currentStep: Step;
    // Ewentualna funkcja do przewijania do odpowiedniego kroku
    @Input() componentFunction?: () => void;

    public displaySteps: Step[] = [];

    ngAfterViewInit(): void {
        if (this.componentFunction) {
            this.componentFunction();
        }
        this.updateDisplaySteps();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateDisplaySteps();
    }

    private updateDisplaySteps(): void {
        // Filtrujemy statusy: wyświetlamy te, które mają statusType 'info'
        this.displaySteps = this.steps.filter(step => step.statusType === 'info');
        // Jeśli aktualny status ma typ 'error' i nie znajduje się w displaySteps, dodajemy go
        if (this.currentStep && this.currentStep.statusType === 'error') {
            const currentStepIndex = this.currentStep.statusNumber
            const exists = this.displaySteps.find(step => step.code === this.currentStep.code && step.statusType === 'error');
            if (!exists) {
                this.displaySteps.push(this.currentStep);
                if (this.currentStep.statusNumber === 2 || this.currentStep.statusNumber === 3) {
                    this.displaySteps = this.displaySteps.filter(
                        step => !(step.statusNumber >= currentStepIndex && step.statusType === 'info')
                    );
                } else {
                    this.displaySteps = this.displaySteps.filter(
                        step => !(step.statusNumber === currentStepIndex && step.statusType === 'info')
                    );
                }
            }
        }
        this.displaySteps.sort((a, b) => a.statusNumber - b.statusNumber);
    }
}