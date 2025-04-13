import {NgClass, NgIf} from '@angular/common';
import {
    Component,
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FuseCardComponent} from '@fuse/components/card';
import {
    CollaborationCompaniesStepperComponent
} from "../../collaborations/components/collaboration-companies/collaboration-companies-stepper.component";
import {ButtonComponent} from "../../../shared/components/ui/button/button.component";

@Component({
    selector: 'app-collaboration',
    standalone: true,
    imports: [MatButtonModule, NgClass, FuseCardComponent, MatIconModule, CollaborationCompaniesStepperComponent, ButtonComponent, NgIf],
    templateUrl: './collaboration.component.html',
    styleUrl: './collaboration.component.scss'
})
export class CollaborationComponent {
    collab_company = {
        name: "Google",
        partnershipOpportunityTitle: "Współpraca z marką odzieżową",
        title: "Współpraca z marką odzieżową",
        avatarUrl: "https://picsum.photos/200/300",
        appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        question: "Jakie są wymagania dotyczące współpracy?",
    }

    collab_influ = {
        name: "Test Test",
        partnershipOpportunityTitle: "Współpraca z marką odzieżową",
        title: "Współpraca z marką odzieżową",
        avatarUrl: "https://picsum.photos/200/300",
        appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        question: null
    }

    doNothing(): void {

    }
}
