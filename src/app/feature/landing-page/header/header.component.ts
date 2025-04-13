import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ButtonComponent} from "../../../shared/components/ui/button/button.component";
import {LinkComponent} from "../../../shared/components/ui/link/link.component";
@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        NgForOf,
        NgIf,
        ButtonComponent,
        LinkComponent
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    isMenuOpen: boolean = false;

    navLinks = [
        { name: 'About', sectionId: 'about' },
        { name: 'Collaborations', sectionId: 'collaborations' },
        { name: 'Contact', sectionId: 'contact' }
    ];

    scrollTo(sectionId: string): void {
        // Jeśli korzystamy z widoku mobilnego, zamykamy menu po kliknięciu
        this.isMenuOpen = false;
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }

    loginRedirect(): void {

    }
}
