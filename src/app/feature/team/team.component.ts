import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from 'app/shared/pipes/safe-html.pipe';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SafeHtmlPipe, SharedComponentsModule]
})
export class TeamComponent implements OnInit, OnDestroy {
  currentLang = 'en';
  private langSubscription: Subscription;

  teamMembers = [
    {
      name: 'Norbert Marchewka',
      position: {
        en: 'Cofounder, CEO & Tech Lead',
        pl: 'Współzałożyciel, CEO i Tech Lead'
      },
      bio: {
        en: 'Driving the vision and technical direction of Check It Out with innovative solutions and leadership.',
        pl: 'Realizuje wizję i kierunek techniczny Check It Out poprzez innowacyjne rozwiązania i przywództwo.'
      },
      initials: 'NM',
      socialLinks: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Jakub Sadowski',
      position: {
        en: 'Cofounder, Backend Developer',
        pl: 'Współzałożyciel, Backend Developer'
      },
      bio: {
        en: 'Building robust server-side architecture that powers our platform\'s functionality and performance.',
        pl: 'Buduje solidną architekturę serwerową, która napędza funkcjonalność i wydajność naszej platformy.'
      },
      initials: 'JS',
      socialLinks: {
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Piotr Żmudzki',
      position: {
        en: 'Cofounder, Full Stack Developer',
        pl: 'Współzałożyciel, Full Stack Developer'
      },
      bio: {
        en: 'Creating seamless experiences across the entire application stack, from user interface to database management.',
        pl: 'Tworzy płynne doświadczenia w całym stosie aplikacji, od interfejsu użytkownika po zarządzanie bazą danych.'
      },
      initials: 'PŻ',
      socialLinks: {
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Oliwier Kurkowski',
      position: {
        en: 'Frontend Developer',
        pl: 'Frontend Developer'
      },
      bio: {
        en: 'Crafting beautiful and intuitive user interfaces that make our platform a pleasure to use.',
        pl: 'Tworzy piękne i intuicyjne interfejsy użytkownika, które sprawiają, że korzystanie z naszej platformy jest przyjemnością.'
      },
      initials: 'OK',
      socialLinks: {
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Kacper Kustra',
      position: {
        en: 'Full Stack Developer',
        pl: 'Full Stack Developer'
      },
      bio: {
        en: 'Developing comprehensive solutions that bridge front-end and back-end systems for optimal functionality.',
        pl: 'Rozwija kompleksowe rozwiązania łączące systemy front-end i back-end dla optymalnej funkcjonalności.'
      },
      initials: 'KK',
      socialLinks: {
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Kamil Gronek',
      position: {
        en: 'Frontend Developer',
        pl: 'Frontend Developer'
      },
      bio: {
        en: 'Designing responsive and engaging user interfaces that deliver exceptional user experiences.',
        pl: 'Projektuje responsywne i angażujące interfejsy użytkownika, które zapewniają wyjątkowe doświadczenia użytkownika.'
      },
      initials: 'KG',
      socialLinks: {
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Wojciech Fokczyński',
      position: {
        en: 'Head of Sales',
        pl: 'Kierownik ds. Sprzedaży'
      },
      bio: {
        en: 'Growing our user base and fostering valuable relationships with brands and influencers alike.',
        pl: 'Rozwija naszą bazę użytkowników i buduje wartościowe relacje zarówno z markami, jak i influencerami.'
      },
      initials: 'WF',
      socialLinks: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Adam Sobczyk',
      position: {
        en: 'Angel Investor',
        pl: 'Angel Investor'
      },
      bio: {
        en: 'I support growth by providing access to my network and hands-on guidance tailored to each team member\'s unique challenges. My focus is on long-term value creation — I invest not just in idea, but above all in the people behind it, offering mentorship and the resources needed to turn vision into tangible results.',
        pl: 'Współpracuję z założycielami we wczesnej fazie rozwoju, wspierając ich wzrost poprzez dostęp do mojego networku oraz praktyczne wsparcie dostosowane do ich indywidualnych wyzwań. Skupiam się na długoterminowym budowaniu wartości — inwestuję nie tylko w pomysł, ale przede wszystkim w ludzi, oferując mentoring i zasoby potrzebne do przełożenia wizji na realne wyniki.'
      },
      photoUrl: './assets/images/avatars/adam-sobczyk.jpg',
      initials: 'AS',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/adam-sobczyk-pwr/'
      }
    }
  ];

  constructor(
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    // Subscribe to language changes directly from TranslocoService
    this.langSubscription = this.translocoService.langChanges$.subscribe(lang => {
      this.currentLang = lang;
    });

    // Check for saved language preference and set it if needed
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pl')) {
      this.translocoService.setActiveLang(savedLanguage);
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  changeLanguage(lang: string): void {
    if (lang === 'en' || lang === 'pl') {
      this.translocoService.setActiveLang(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
  }
}
