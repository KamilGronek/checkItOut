import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import {FooterComponent} from "./footer/footer.component";
import {HeaderComponent} from "./header/header.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {DatePipe, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {NgClass} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FuseCardComponent} from '@fuse/components/card';
import {CollaborationComponent} from "./collaboration/collaboration.component";

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [MatIcon, MatButtonModule,
        NgClass, MatIconModule, CollaborationComponent,
        MatExpansionModule, NgForOf, DatePipe, RouterLink,
        RouterOutlet, FooterComponent, HeaderComponent,
        FuseCardComponent, MatButton],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
    protected readonly Date = Date;
    yearlyBilling: boolean = true;

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

    faqs = [
        {
            id: 1,
            question: "W jaki sposób mogę sie zarejestrować?",
            answer: "Musisz dołączyć do naszej platformy, a następnie wybrać opcję rejestracji. np. Instagram"
        },
        {
            id: 2,
            question: "W jaki sposób influencer  rozlicza się z firmami?",
            answer: "Jest to niezależne od nas. Wszystko zależy w jaki sposób podpiszą między sobą umowę"
        },
        {
            id: 3,
            question: "Jak działa system współprac, czy jako inflencer mam dostęp do wszytskich?",
            answer: "Tak, każdy influencer ma dostęp do wszystkich współprac, które są dostępne na naszej platformie. Jendakże przy niektórych współpracach wymagane są pewne kryteria, które musisz spełnić."
        },
        {
            id: 4,
            question: "Czy po zgłoszeniu aplikacji na współpracę automatycznie dostanę ją?",
            answer: "Nie, firma sama wybiera kandydatów."
        },
        {id: 5, question: "Ile kosztuje założenie konta u nas?", answer: "Jest całkowicie darmowe."}]

}
