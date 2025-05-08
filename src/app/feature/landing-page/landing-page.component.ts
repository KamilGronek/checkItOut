import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { TranslocoService } from '@ngneat/transloco';
import { SafeHtmlPipe } from 'app/shared/pipes/safe-html.pipe';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    imports: [CommonModule, RouterModule, SafeHtmlPipe, SharedComponentsModule],
    standalone: true
})
export class LandingPageComponent implements OnInit, OnDestroy {
    currentLang = 'en';
    currentLangFlag = 'assets/images/flags/uk.png';
    private langSubscription: Subscription;
    isScrolled = false;
    isMenuOpen = false;
    isLangDropdownOpen = false;
    cookiesAccepted = false;
    activeTab = 'influencers';
    isInViewport = false;

    // SVGs for dashboard preview
    brandSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#fafafa"></rect>
    <g>
      <circle cx="100" cy="100" r="90" fill="#e2e8f0" opacity="0.3"></circle>
      <g transform="translate(100, 100)">
        <rect x="-70" y="-70" width="140" height="140" fill="#64748b" rx="5"></rect>
        <rect x="-55" y="-55" width="40" height="30" fill="#f1f5f9" rx="2"></rect>
        <rect x="15" y="-55" width="40" height="30" fill="#f1f5f9" rx="2"></rect>
        <rect x="-55" y="-15" width="40" height="30" fill="#f1f5f9" rx="2"></rect>
        <rect x="15" y="-15" width="40" height="30" fill="#f1f5f9" rx="2"></rect>
        <rect x="-25" y="25" width="50" height="45" fill="#f1f5f9"></rect>
      </g>
    </g>
  </svg>`;

    influencerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#fafafa" rx="10" ry="10"></rect>
    <g>
      <circle cx="100" cy="100" r="95" fill="#bfdbfe" opacity="0.3"></circle>
      <g transform="translate(100, 100)">
        <circle cx="0" cy="-30" r="40" fill="#3b82f6"></circle>
        <rect x="-35" y="10" width="70" height="90" rx="20" fill="#3b82f6"></rect>
        <path d="M -16 -24 Q 0 -10 16 -24" stroke="#ffffff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.8"></path>
        <g>
          <path d="M -20 -42 Q -14 -46 -8 -42" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round"></path>
          <path d="M 8 -42 Q 14 -46 20 -42" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round"></path>
        </g>
      </g>
    </g>
  </svg>`;

    // Benefits Section Data
    benefitsList = [
        {
            title: {
                pl: 'Oszczędność czasu i pieniędzy',
                en: 'Save time and resources'
            },
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#F0F4FF"></circle>
        <circle cx="50" cy="50" r="25" fill="none" stroke="#4169E1" stroke-width="3"></circle>
        <line x1="50" y1="50" x2="50" y2="32" stroke="#4169E1" stroke-width="3" stroke-linecap="round"></line>
        <line x1="50" y1="50" x2="63" y2="50" stroke="#4169E1" stroke-width="3" stroke-linecap="round"></line>
      </svg>`,
            list: {
                pl: [
                    'Listy dopasowanych influencerów',
                    'Gotowe briefy i umowy',
                    'Automatyczny monitoring kampanii',
                    'Pełna obsługa kampanii przez platformę'
                ],
                en: [
                    'Lists of matched influencers',
                    'Ready-to-use briefs and contracts',
                    'Automatic campaign monitoring',
                    'Full campaign management via platform'
                ]
            }
        },
        {
            title: {
                pl: 'Skuteczniejsza współpraca',
                en: 'More effective collaboration'
            },
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#F0F4FF"></circle>
        <rect x="30" y="30" width="40" height="40" rx="4" ry="4" fill="none" stroke="#4169E1" stroke-width="3"></rect>
        <rect x="30" y="30" width="40" height="10" rx="4" ry="4" fill="#4169E1" fill-opacity="0.2" stroke="#4169E1" stroke-width="3"></rect>
        <line x1="40" y1="50" x2="40" y2="50" stroke="#4169E1" stroke-width="6" stroke-linecap="round"></line>
        <line x1="50" y1="50" x2="50" y2="50" stroke="#4169E1" stroke-width="6" stroke-linecap="round"></line>
        <line x1="60" y1="50" x2="60" y2="50" stroke="#4169E1" stroke-width="6" stroke-linecap="round"></line>
        <line x1="40" y1="60" x2="40" y2="60" stroke="#4169E1" stroke-width="6" stroke-linecap="round"></line>
        <line x1="50" y1="60" x2="50" y2="60" stroke="#4169E1" stroke-width="6" stroke-linecap="round"></line>
        <line x1="60" y1="60" x2="60" y2="60" stroke="#4169E1" stroke-width="6" stroke-linecap="round"></line>
      </svg>`,
            list: {
                pl: [
                    'Weryfikacja influencerów',
                    'Oceny i rekomendacje twórców',
                    'Ochrona przed fałszywymi kontami',
                    'Raport z wyników kampanii'
                ],
                en: [
                    'Influencer verification',
                    'Creator ratings and recommendations',
                    'Protection against fake accounts',
                    'Campaign results reports'
                ]
            }
        },
        {
            title: {
                pl: 'Lepsze targetowanie',
                en: 'Better targeting'
            },
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#F0F4FF"></circle>
        <path d="M50,25 C40,25 32,33 32,43 C32,58 50,75 50,75 C50,75 68,58 68,43 C68,33 60,25 50,25 Z" fill="#4169E1" fill-opacity="0.2" stroke="#4169E1" stroke-width="2.5"></path>
        <circle cx="50" cy="43" r="6" fill="#4169E1"></circle>
      </svg>`,
            list: {
                pl: [
                    'Dopasowanie do celów marki i grupy docelowej',
                    'Rekomendacje modelu współpracy',
                    'Transparentne rozliczenia i monitoring wydajności'
                ],
                en: [
                    'Matching brand goals and target audience',
                    'Collaboration model recommendations',
                    'Transparent settlements and performance monitoring'
                ]
            }
        }
    ];

    // How it works Section - Influencer Steps
    influencerSteps = [
        {
            title: {
                pl: 'Zarejestruj się',
                en: 'Sign up'
            },
            icon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="25.2" fill="#e7f0ff"></circle>
        <circle cx="100" cy="100" r="25.2" fill="none" stroke="#4263eb" stroke-width="2.5"></circle>
        <path d="M86 100 L97.2 111.2 L114 88.8" fill="none" stroke="#4263eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`,
            description: {
                pl: 'Załóż konto influencera w kilka sekund i pokaż markom swój profil.',
                en: 'Create an influencer account in seconds and showcase your profile to brands.'
            }
        },
        {
            title: {
                pl: 'Wypełnij profil',
                en: 'Complete profile'
            },
            icon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="58" y="42" width="84" height="112" rx="4.2" ry="4.2" fill="none" stroke="#4263eb" stroke-width="2.8"></rect>
        <circle cx="100" cy="72" r="16.8" fill="#e7f0ff" stroke="#4263eb" stroke-width="2.8"></circle>
        <path d="M90.2 74.8 Q100 83.2, 109.8 74.8" fill="none" stroke="#4263eb" stroke-width="2.1" stroke-linecap="round"></path>
        <circle cx="93" cy="67.8" r="2.1" fill="#4263eb"></circle>
        <circle cx="107" cy="67.8" r="2.1" fill="#4263eb"></circle>
        <rect x="72" y="114" width="56" height="5.6" rx="2.8" ry="2.8" fill="#dde1e6"></rect>
        <rect x="72" y="114" width="49" height="5.6" rx="2.8" ry="2.8" fill="#4263eb"></rect>
        <rect x="72" y="128" width="56" height="5.6" rx="2.8" ry="2.8" fill="#dde1e6"></rect>
        <rect x="72" y="128" width="35" height="5.6" rx="2.8" ry="2.8" fill="#4263eb"></rect>
        <rect x="72" y="142" width="56" height="5.6" rx="2.8" ry="2.8" fill="#dde1e6"></rect>
        <rect x="72" y="142" width="42" height="5.6" rx="2.8" ry="2.8" fill="#4263eb"></rect>
      </svg>`,
            description: {
                pl: 'Dodaj swoje statystyki, linki do social mediów i preferencje dotyczące współprac.',
                en: 'Add your stats, social media links and collaboration preferences.'
            }
        },
        {
            title: {
                pl: 'Otrzymuj oferty',
                en: 'Receive offers'
            },
            icon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="65" y="75" width="70" height="50" rx="5" ry="5" fill="#e7f0ff" stroke="#4263eb" stroke-width="2.5"></rect>
        <path d="M65 80 L100 111 L135 80" fill="none" stroke="#4263eb" stroke-width="2.5"></path>
        <circle cx="130" cy="70" r="11" fill="#4263eb"></circle>
        <circle cx="130" cy="70" r="8" fill="#4263eb" stroke="white" stroke-width="1"></circle>
        <text x="127" y="74" font-family="Arial" font-size="10" fill="white" font-weight="bold">3</text>
      </svg>`,
            description: {
                pl: 'Dopasujemy dla Ciebie najlepsze współprace z firmami.',
                en: 'We\'ll match you with the best company collaborations.'
            }
        },
        {
            title: {
                pl: 'Negocjuj warunki',
                en: 'Negotiate terms'
            },
            icon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M70 85 L130 85" stroke="#4263eb" stroke-width="2.5" stroke-linecap="round"></path>
        <path d="M120 75 L130 85 L120 95" fill="none" stroke="#4263eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M130 115 L70 115" stroke="#4263eb" stroke-width="2.5" stroke-linecap="round"></path>
        <path d="M80 105 L70 115 L80 125" fill="none" stroke="#4263eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <circle cx="50" cy="100" r="10" fill="#e7f0ff" stroke="#4263eb" stroke-width="1.5"></circle>
        <circle cx="150" cy="100" r="10" fill="#4263eb"></circle>
      </svg>`,
            description: {
                pl: 'Ustal szczegóły współpracy bezpośrednio przez platformę.',
                en: 'Set collaboration details directly through the platform.'
            }
        }
    ];

    // How it works Section - Brand Steps
    brandSteps = [
        {
            title: {
                pl: 'Załóż konto firmy',
                en: 'Create company account'
            },
            icon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="40" width="100" height="120" rx="5" fill="none" stroke="#6c8aff" stroke-width="2"></rect>
        <line x1="70" y1="70" x2="130" y2="70" stroke="#b0b9e5" stroke-width="3" stroke-linecap="round"></line>
        <line x1="70" y1="90" x2="110" y2="90" stroke="#b0b9e5" stroke-width="3" stroke-linecap="round"></line>
        <line x1="70" y1="110" x2="130" y2="110" stroke="#b0b9e5" stroke-width="3" stroke-linecap="round"></line>
        <circle cx="140" cy="140" r="20" fill="#6c8aff"></circle>
        <path d="M130,140 L138,148 L150,132" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`,
            description: {
                pl: 'Zarejestruj swoją firmę i uzyskaj dostęp do bazy zweryfikowanych influencerów.',
                en: 'Register your brand and gain access to a database of verified influencers.'
            }
        },
        {
            title: {
                pl: 'Stwórz kampanię',
                en: 'Create a campaign'
            },
            icon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="40" width="100" height="120" rx="5" fill="none" stroke="#6c8aff" stroke-width="2"></rect>
        <rect x="85" y="32" width="30" height="16" rx="5" fill="none" stroke="#6c8aff" stroke-width="2"></rect>
        <circle cx="75" cy="70" r="10" fill="none" stroke="#6c8aff" stroke-width="2"></circle>
        <circle cx="75" cy="70" r="3" fill="#6c8aff"></circle>
        <path d="M70,105 L80,105 M75,100 L75,110" stroke="#6c8aff" stroke-width="2" stroke-linecap="round"></path>
        <polyline points="70,145 75,138 80,142 85,135" stroke="#6c8aff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></polyline>
        <line x1="95" y1="70" x2="135" y2="70" stroke="#c8d1f6" stroke-width="2" stroke-linecap="round"></line>
        <line x1="95" y1="105" x2="135" y2="105" stroke="#c8d1f6" stroke-width="2" stroke-linecap="round"></line>
        <line x1="95" y1="140" x2="135" y2="140" stroke="#c8d1f6" stroke-width="2" stroke-linecap="round"></line>
      </svg>`,
            description: {
                pl: 'Określ cele, budżet i wymagania dla twojej kampanii marketingowej.',
                en: 'Define goals, budget and requirements for your marketing campaign.'
            }
        },
        {
            title: {
                pl: 'Wybierz influencerów',
                en: 'Select influencers'
            },
            icon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="85" cy="85" r="35" fill="none" stroke="#6c8aff" stroke-width="2"></circle>
        <line x1="110" y1="110" x2="130" y2="130" stroke="#6c8aff" stroke-width="3" stroke-linecap="round"></line>
        <circle cx="85" cy="80" r="10" fill="none" stroke="#c8d1f6" stroke-width="1.5"></circle>
        <path d="M70,100 C70,88 100,88 100,100" fill="none" stroke="#c8d1f6" stroke-width="1.5"></path>
        <circle cx="140" cy="70" r="15" fill="none" stroke="#6c8aff" stroke-width="2"></circle>
        <path d="M130,70 L138,78 L150,65" stroke="#6c8aff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`,
            description: {
                pl: 'Przeglądaj rekomendowanych influencerów lub wyszukuj według określonych kryteriów.',
                en: 'Browse recommended influencers or search by specific criteria.'
            }
        },
        {
            title: {
                pl: 'Śledź wyniki',
                en: 'Track results'
            },
            icon: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="50" width="100" height="100" rx="5" fill="none" stroke="#6c8aff" stroke-width="2"></rect>
        <line x1="70" y1="130" x2="70" y2="70" stroke="#c8d1f6" stroke-width="1.5" stroke-linecap="round"></line>
        <line x1="70" y1="130" x2="130" y2="130" stroke="#c8d1f6" stroke-width="1.5" stroke-linecap="round"></line>
        <rect x="75" y="110" width="10" height="20" fill="none" stroke="#6c8aff" stroke-width="1.5"></rect>
        <rect x="95" y="90" width="10" height="40" fill="none" stroke="#6c8aff" stroke-width="1.5"></rect>
        <rect x="115" y="75" width="10" height="55" fill="none" stroke="#6c8aff" stroke-width="1.5"></rect>
      </svg>`,
            description: {
                pl: 'Monitoruj przebieg kampanii i analizuj efekty współpracy w czasie rzeczywistym.',
                en: 'Monitor campaign progress and analyze collaboration effects in real-time.'
            }
        }
    ];

    // Stats Section Data
    statsList = [
        {
            value: '1 000+',
            label: {
                pl: 'zweryfikowanych influencerów',
                en: 'verified influencers'
            }
        },
        {
            value: '93%',
            label: {
                pl: 'kampanii zakończonych pełną realizacją briefu',
                en: 'campaigns completed with full brief execution'
            }
        },
        {
            value: '4.2 / 5',
            label: {
                pl: 'średnia ocena',
                en: 'average rating'
            }
        },
        {
            value: '100+',
            label: {
                pl: 'aktywnych firm na platformie',
                en: 'active brands on the platform'
            }
        }
    ];

    // Features Section Data
    featuresList = [
        {
            title: {
                pl: 'Wyszukiwanie i filtrowanie',
                en: 'Search and filtering'
            },
            icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M11 7V11H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`,
            description: {
                pl: 'Zaawansowane filtry pozwalające znaleźć idealnych partnerów do współpracy według lokalizacji, kategorii, zasięgów czy budżetu.',
                en: 'Advanced filters to find ideal collaboration partners by location, category, reach or budget.'
            }
        },
        {
            title: {
                pl: 'Analityka kampanii',
                en: 'Campaign analytics'
            },
            icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 21H3V14H10V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M21 21H14V14H21V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M21 10H14V3H21V10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M10 10H3V3H10V10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`,
            description: {
                pl: 'Szczegółowe raporty i statystyki dla każdej kampanii, umożliwiające ocenę skuteczności współpracy i ROI.',
                en: 'Detailed reports and statistics for each campaign, enabling effectiveness assessment and ROI evaluation.'
            }
        },
        {
            title: {
                pl: 'Automatyzacja umów',
                en: 'Contract automation'
            },
            icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3H14L18 7V21H6V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M14 3V7H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9 11H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9 14H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9 17H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`,
            description: {
                pl: 'Automatyczne generowanie profesjonalnych umów o współpracy z możliwością dostosowania do indywidualnych potrzeb.',
                en: 'Automatic generation of professional collaboration agreements with customization options for individual needs.'
            }
        }
    ];

    // Progress Steps Data
    progressSteps = [
        {
            title: {
                pl: 'Aplikacja',
                en: 'Application'
            },
            description: {
                pl: 'Zgłoszenie zostało wysłane',
                en: 'Application has been sent'
            },
            completed: true,
            active: false
        },
        {
            title: {
                pl: 'Akceptacja firmy',
                en: 'Brand acceptance'
            },
            description: {
                pl: 'Firma zaakceptowała Twoją aplikację',
                en: 'Brand has accepted your application'
            },
            completed: true,
            active: false
        },
        {
            title: {
                pl: 'Akceptacja influencera',
                en: 'Influencer acceptance'
            },
            description: {
                pl: 'Influencer zaakceptował Twoją aplikację',
                en: 'Influencer has accepted your application'
            },
            completed: false,
            active: true
        },
        {
            title: {
                pl: 'Akceptacja treści',
                en: 'Content approval'
            },
            description: {
                pl: 'Zatwierdzenie materiałów do publikacji',
                en: 'Approval of materials for publication'
            },
            completed: false,
            active: false
        },
        {
            title: {
                pl: 'Płatność w toku',
                en: 'Payment in progress'
            },
            description: {
                pl: 'Oczekiwanie na potwierdzenie płatności',
                en: 'Waiting for payment approval'
            },
            completed: false,
            active: false
        },
        {
            title: {
                pl: 'Zakończenie',
                en: 'Completion'
            },
            description: {
                pl: 'Współpraca została zakończona pomyślnie',
                en: 'Collaboration has been successfully completed'
            },
            completed: false,
            active: false
        }
    ];

    // Testimonials Data
    testimonialsList = [
        {
            quote: {
                pl: 'Dzięki Check It Out znaleźliśmy wiarygodnych influencerów, którzy naprawdę pasują do naszego biznesu. Proces współpracy jest przejrzysty i bezpieczny.',
                en: 'Thanks to Check It Out, we found trustworthy influencers who truly fit our business. The collaboration process is transparent and secure.'
            },
            author: 'ESCOBARBER',
            position: {
                pl: 'Barber shop, Kraków',
                en: 'Barber shop, Krakow'
            }
        },
        {
            quote: {
                pl: 'Platforma pomogła nam znaleźć idealnych influencerów do naszej kampanii. Oszczędziliśmy mnóstwo czasu i zwiększyliśmy rozpoznawalność wśród klientów.',
                en: 'The platform helped us find the perfect influencers for our campaign, saving us time and boosting recognition among our clients'
            },
            author: 'Nowa Prowincja',
            position: {
                pl: 'Kawiarnia, Kraków',
                en: 'Coffee house, Krakow'
            }
        },
        {
            quote: {
                pl: 'Check It Out to najlepsza platforma dla influencerów, z jaką pracowałam. Wszystko jest tutaj jasne i proste.',
                en: 'Check It Out is the best platform for influencers I\'ve worked with. Everything here is clear and simple.'
            },
            author: 'Trattoria da Antonio',
            position: {
                pl: 'Restauracja, Warszawa',
                en: 'Restaurant, Warsaw'
            }
        }
    ];

    // FAQ Data
    faqList = [
        {
            question: {
                pl: 'Ile to kosztuje?',
                en: 'How much does it cost?'
            },
            answer: {
                pl: 'Założenie konta na platformie Check It Out jest całkowicie bezpłatne zarówno dla marek, jak i dla influencerów. Na razie ogłoszenia są bezpłatne, jednak od 2026 roku będziemy pobierać opłatę od firm za wystawione ogłoszenia w wysokości 80 zł netto za ogłoszenie.',
                en: 'Creating an account on the Check It Out platform is completely free for both brands and influencers. Currently, collaboration announcements are free of charge, but starting in 2026, we will charge companies a fee of 80 PLN (net) per listing.'
            },
            isOpen: false
        },
        {
            question: {
                pl: 'W jaki sposób mogę się zarejestrować?',
                en: 'How can I register?'
            },
            answer: {
                pl: 'Rejestracja na platformie Check It Out jest prosta. Wystarczy kliknąć przycisk "Zarejestruj się" w prawym górnym rogu strony, wybrać typ konta (firma lub influencer), a następnie wypełnić formularz rejestracyjny. Po weryfikacji danych możesz korzystać z pełni funkcjonalności platformy.',
                en: 'Registration on the Check It Out platform is simple. Just click the "Sign up" button in the top right corner of the page, choose the account type (business or influencer), and then fill out the registration form. After data verification, you can use all the platform\'s features.'
            },
            isOpen: false
        },
        {
            question: {
                pl: 'W jaki sposób influencer rozlicza się z firmami?',
                en: 'How do influencers settle payments with companies?'
            },
            answer: {
                pl: 'Płatności odbywają się zgodnie z zasadami określonymi w danym ogłoszeniu. Check It Out nie pośredniczy w płatnościach, jednak nasza platforma monitoruje, czy strony wywiązały się z wcześniej zawartej umowy. W przypadku zgłoszonego oszustwa poszkodowana strona może liczyć na pełne wsparcie zespołu Check It Out.',
                en: 'Payments are made according to the terms outlined in the specific listing. Check It Out does not mediate payments; however, our platform monitors whether both parties have fulfilled the previously agreed terms. In the event of reported fraud, the affected party can rely on full support from the Check It Out team.'
            },
            isOpen: false
        },
        {
            question: {
                pl: 'Jak działa system współprac? Czy jako influencer mam dostęp do wszystkich ofert?',
                en: 'How does the collaboration system work? As an influencer, do I have access to all offers?'
            },
            answer: {
                pl: 'Jako influencer masz dostęp do wszystkich ofert, dla których Twoje konto spełnia określone wymagania (np. lokalizacja, liczba obserwujących).',
                en: 'As an influencer, you have access to all offers for which your account meets the requirements (e.g., location, number of followers).'
            },
            isOpen: false
        },
        {
            question: {
                pl: 'Czy zgłoszenie aplikacji do współpracy oznacza automatyczne jej przyjęcie?',
                en: 'Does submitting an application for collaboration automatically mean its acceptance?'
            },
            answer: {
                pl: 'Nie, Twoje zgłoszenie musi zostać zaakceptowane przez firmę, która je wystawia. Firma ma możliwość przejrzenia Twojego profilu, statystyk oraz wcześniejszych współprac, a następnie decyduje o akceptacji Twojej kandydatury. Po akceptacji przez firmę, Ty również musisz zatwierdzić warunki współpracy.',
                en: 'No, your application must be accepted by the company that posted it. The company has the option to review your profile, statistics, and previous collaborations, and then decides whether to accept your application. After the company accepts your application, you must also confirm the terms of the collaboration.'
            },
            isOpen: false
        }
    ];

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private translocoService: TranslocoService
    ) {}

    ngOnInit(): void {
        // Subscribe to language changes directly from TranslocoService
        this.langSubscription = this.translocoService.langChanges$.subscribe(lang => {
            this.currentLang = lang;
            this.updateLanguageFlag(lang);
        });

        // Check for cookie consent
        this.cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';

        // Scroll to fragment if present in URL
        this.route.fragment.subscribe(fragment => {
            if (fragment) {
                setTimeout(() => {
                    const element = document.getElementById(fragment);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        });

        // Initialize observer for animation on scroll
        this.setupScrollObserver();
    }

    @HostListener('window:scroll', [])
    onWindowScroll(): void {
        this.isScrolled = window.scrollY > 50;
        this.checkScrollAnimation();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        // Close language dropdown when clicking outside
        const langSwitcher = document.querySelector('.lang-switcher');
        if (langSwitcher && !langSwitcher.contains(event.target as Node) && this.isLangDropdownOpen) {
            this.isLangDropdownOpen = false;
        }

        // Close mobile menu when clicking outside
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navLinks && menuToggle &&
            this.isMenuOpen &&
            !navLinks.contains(event.target as Node) &&
            !menuToggle.contains(event.target as Node)) {
            this.isMenuOpen = false;
        }
    }

    updateLanguageFlag(lang: string): void {
        if (lang === 'pl') {
            this.currentLangFlag = 'assets/images/flags/poland.png';
        } else if (lang === 'en') {
            this.currentLangFlag = 'assets/images/flags/uk.png';
        }
    }

    switchLanguage(lang: string): void {
        this.translocoService.setActiveLang(lang);
        localStorage.setItem('preferredLanguage', lang);
        this.isLangDropdownOpen = false;
    }

    ngOnDestroy(): void {
        if (this.langSubscription) {
            this.langSubscription.unsubscribe();
        }
    }

    toggleLangDropdown(event: Event): void {
        event.stopPropagation();
        this.isLangDropdownOpen = !this.isLangDropdownOpen;
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu(): void {
        this.isMenuOpen = false;
    }

    setActiveTab(tabId: string): void {
        this.activeTab = tabId;
    }

    toggleFaq(index: number): void {
        // Close all other FAQs
        this.faqList.forEach((faq, i) => {
            if (i !== index) {
                faq.isOpen = false;
            }
        });

        // Toggle the clicked FAQ
        this.faqList[index].isOpen = !this.faqList[index].isOpen;
    }

    acceptCookies(): void {
        localStorage.setItem('cookiesAccepted', 'true');
        this.cookiesAccepted = true;
    }

    setupScrollObserver(): void {
        // Check for IntersectionObserver support
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appear');
                    }
                });
            }, observerOptions);

            // Observe all elements with 'slide-up' class
            document.querySelectorAll('.slide-up').forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            document.querySelectorAll('.slide-up').forEach(element => {
                element.classList.add('appear');
            });
        }
    }

    checkScrollAnimation(): void {
        const scrollElements = document.querySelectorAll('.slide-up');
        const windowHeight = window.innerHeight;

        scrollElements.forEach(element => {
            const position = element.getBoundingClientRect();

            // If element is in viewport
            if (position.top < windowHeight - 50) {
                element.classList.add('appear');
            }
        });
    }
}
