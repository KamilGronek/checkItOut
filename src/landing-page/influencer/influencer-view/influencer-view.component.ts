import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FooterComponent} from "../../footer/footer.component";
import {CollaborationsComponent} from "../../collaborations/collaborations.component";
import {ViewType} from "../../../@fuse/components/stepper/stepper";

@Component({
    selector: 'app-influencer-view',
    standalone: true,
    imports: [
        NgForOf,
        FooterComponent,
        CollaborationsComponent
    ],
    templateUrl: './influencer-view.component.html',
    styleUrl: './influencer-view.component.scss'
})
export class InfluencerViewComponent {
    public viewType: ViewType = ViewType.INFLUENCER;
    public collaborations = [
        {
            name: "Google",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Google",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Google",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Google",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Google",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        },
        {
            name: "Google",
            partnershipOpportunityTitle: "Współpraca z marką odzieżową",
            title: "Współpraca z marką odzieżową",
            avatarUrl: "https://picsum.photos/200/300",
            appliedOpportunityStatus: "ACCEPTED_BY_INFLUENCER",
        }
    ]

    steps = [
        {
            title: 'Zarejestruj się',
            description: 'Załóż konto influencera w kilka sekund i pokaż markom swój profil.'
        },
        {
            title: 'Wypełnij profil',
            description: 'Dodaj swoje statystyki, linki do social mediów i preferencje dotyczące współprac.'
        },
        {
            title: 'Otrzymuj oferty',
            description: 'Dopasujemy dla Ciebie najlepsze współprace z firmami.'
        }
    ];

    onRegisterClick() {
        console.log('Przekierowanie do formularza rejestracji...');
    }
}
