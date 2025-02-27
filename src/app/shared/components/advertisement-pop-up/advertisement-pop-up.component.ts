import {NgClass} from '@angular/common';
import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FuseDrawerComponent} from '@fuse/components/drawer';
import {FuseConfig, FuseConfigService, Scheme, Theme, Themes,} from '@fuse/services/config';

import {TranslocoModule} from '@ngneat/transloco';

import {interval, Subject, takeUntil} from 'rxjs';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {take} from 'rxjs/operators';
import {InfluencerService} from 'app/feature/influencers/services/influencer.service';

import {AdvertisementPopUpService} from 'app/core/services/advertisement-pop-up/advertisement-pop-up.service';

import {Influencer} from 'app/feature/influencers/services/influencer.types';
import {MatDrawer} from '@angular/material/sidenav';
import {AuthService} from 'app/core/services/authentication/auth.service';

@Component({
    selector: 'advertisement-pop-up',
    templateUrl: './advertisement-pop-up.component.html',
    styles: [
        `
            pop-up {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }

            @media (screen and min-width: 1280px) {
                empty-layout + pop-up .pop-up-cog {
                    right: 0 !important;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        FuseDrawerComponent,
        MatButtonModule,
        NgClass,
        MatTooltipModule,
        MatCardModule,
        MatRadioModule,
        FormsModule,
        MatSliderModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        TranslocoModule,
    ],
    styleUrl: 'advertisement-pop-up.component.css',
})
export class AdvertisementPopUpComponent implements OnInit, OnDestroy {
    @ViewChild('popUpButton') popUpButton!: ElementRef<HTMLDivElement>;

    @ViewChild(MatDrawer) settingsDrawer!: MatDrawer;

    layout: string;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() config: FuseConfig;
    data: any;

    value = 20;
    progress = 0;

    isHighlight = false;
    isHighlight2 = false;
    isHighlight3 = false;

    progress1 = 0;
    value1 = 0;

    progress2 = 0;
    value2 = 0;

    progress3 = 0;
    value3 = 0;

    influencerUser: Influencer;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _influencerService: InfluencerService,
        private _popUpService: AdvertisementPopUpService,
        private _authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.updateSpinner1();
        this.updateSpinner2();
        this.updateSpinner3();

        this.loadUserEmailAndHandlePopup();

        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                this.config = config;
            });
    }

    private loadUserEmailAndHandlePopup(): void {
        const user = this._authService.getUserFromToken();

        if (user && user.email) {
            this._popUpService.setUserKey(user.email);
        } else {
            console.warn('Nie udało się załadować adresu e-mail z tokenu.');
        }
        this.loadUserDataAndHandlePopup();
    }

    private loadUserDataAndHandlePopup(): void {
        this._influencerService.getInfluencerUser().subscribe({
            next: (userData) => {
                const status = userData?.accountStatus;
                console.log(`Status konta użytkownika: ${status}`);
            },
            error: (error) => {
                console.error(
                    'Błąd podczas pobierania danych użytkownika:',
                    error
                );

                const isPopupHidden =
                    this._popUpService.getInitialLocalStorageValue();
                const isPopupOpen = this.settingsDrawer?.opened;
                if (!isPopupHidden && !isPopupOpen) {
                    this.openPopup();
                }
            },
        });
    }

    private openPopup(): void {
        this.popUpButton.nativeElement.click();
    }

    hidePermanently() {
        this._popUpService.setHidePopUpPermanently(true);
    }

    updateSpinner1(): void {
        interval(25)
            .pipe(take(101))
            .subscribe({
                next: (value) => {
                    this.progress1 = value;
                    this.value1 = value;
                },
                complete: () => {
                    this.progress1 = 3200;
                    this.value1 = 3200;
                    this.isHighlight = true;
                    setTimeout(() => {
                        this.isHighlight = false;
                    }, 300);
                },
            });
    }

    updateSpinner2(): void {
        interval(30)
            .pipe(take(101))
            .subscribe({
                next: (value) => {
                    this.progress2 = value;
                    this.value2 = value;
                },
                complete: () => {
                    this.progress2 = 4;
                    this.isHighlight2 = true;
                    setTimeout(() => {
                        this.isHighlight2 = false;
                    }, 300);
                },
            });
    }

    updateSpinner3(): void {
        interval(35)
            .pipe(take(101))
            .subscribe({
                next: (value) => {
                    this.progress3 = value;
                    this.value3 = value;
                },
                complete: () => {
                    this.progress3 = 162;
                    this.value3 = 162;

                    this.isHighlight3 = true;
                    setTimeout(() => {
                        this.isHighlight3 = false;
                    }, 300);
                },
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the layout on the config
     *
     * @param layout
     */

    /**
     * Set the scheme on the config
     *
     * @param scheme
     */
    setScheme(scheme: Scheme): void {
        this._fuseConfigService.config = {scheme};
    }

    /**
     * Set the theme on the config
     *
     * @param theme
     */
    setTheme(theme: Theme): void {
        this._fuseConfigService.config = {theme};
    }
}
