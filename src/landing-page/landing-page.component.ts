import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {DatePipe, NgForOf} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";
import {FooterComponent} from "./footer/footer.component";

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [MatIcon, MatExpansionModule, NgForOf, DatePipe, RouterLink, RouterOutlet, FooterComponent],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
    protected readonly Date = Date;

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
