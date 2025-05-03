import {Component} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {
    CollaborationCompaniesStepperComponent
} from "../../../app/feature/collaborations/components/collaboration-companies/collaboration-companies-stepper.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {FuseCardComponent} from '@fuse/components/card';
import {ViewType } from '../../../app/feature/collaborations/components/stepper/stepper';
import {
    CarouselComponent
} from "../../../app/feature/collaborations/components/collaboration-influencers/carousel/carousel.component";
import {FooterComponent} from "../../footer/footer.component";
import {CollaborationsComponent} from "../../collaborations/collaborations.component";

@Component({
    selector: 'app-company-view',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        FuseCardComponent,
        CollaborationCompaniesStepperComponent,
        MatIcon,
        MatIconButton,
        CarouselComponent,
        FooterComponent,
        CollaborationsComponent
    ],
    templateUrl: './company-view.component.html',
    styleUrl: './company-view.component.scss'
})
export class CompanyViewComponent {
    public viewType: ViewType = ViewType.COMPANY;
    public collaborations = [
        {
            name: "Rezigiusz",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Rezigiusz",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Rezigiusz",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Rezigiusz",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Rezigiusz",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Rezigiusz",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        }
    ]

// Przykładowe teksty marketingowe:
    heroTitle = 'Rozwiń swój biznes dzięki współpracy z topowymi influencerami';
    heroSubtitle = 'Połącz się z twórcami, którzy pomogą rozpromować Twoją firmę na ogromną skalę.';

    benefits = [
        {
            title: 'Darmowe konto',
            description: 'Założenie konta jest całkowicie darmowe – zacznij już dziś bez dodatkowych kosztów.',
        },
        {
            title: 'Szybki dostęp do influencerów',
            description: 'Wybieraj spośród tysięcy twórców w różnych branżach i skaluj zasięg marketingowy.',
        },
        {
            title: 'Intuicyjny panel współprac',
            description: 'Twórz i zarządzaj wszystkimi kampaniami w jednym miejscu dzięki prostemu w obsłudze panelowi.',
        },
        {
            title: 'Skalowalne rozwiązanie',
            description: 'Rozwijaj swoją strategię marketingową, współpracując z wieloma influencerami jednocześnie.',
        },
    ];

    finalCTA = 'Załóż darmowe konto i rozpocznij współpracę już teraz!';


}
