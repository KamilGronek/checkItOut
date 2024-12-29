import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import {
    FuseConfig,
    FuseConfigService,
    Scheme,
    Theme,
    Themes,
} from '@fuse/services/config';

import { Subject, takeUntil } from 'rxjs';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { takeWhile } from 'rxjs/operators';
import { Input, ElementRef, ViewChild } from '@angular/core';
import { InfluencerService } from 'app/services/influencer/influencer.service';
import { Influencer } from 'app/services/influencer/Influencer';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styles: [
        `
            settings {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }

            @media (screen and min-width: 1280px) {
                empty-layout + settings .settings-cog {
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
    ],
    styleUrl: 'settingsComponent.css',
})
export class SettingsComponent implements OnInit, OnDestroy {
    @ViewChild('settingsButton') settingsButton!: ElementRef<HTMLDivElement>; // Odniesienie do przycisku

    // config: FuseConfig;
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
    /**
     * Constructor
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _influencerService: InfluencerService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    dontShowPopUpAgain: boolean = true;

    ngOnInit(): void {
        this.updateSpinner1();
        this.updateSpinner2();
        this.updateSpinner3();

        this.dontShowPopUpAgain =
            this._influencerService.getdontshowPopUpAgain();

        this._influencerService.isdontshowPopUpAgain$.subscribe((dontShow) => {
            this.dontShowPopUpAgain = dontShow;
        });

        this._influencerService.getInfluencerUser().subscribe({
            next: (userData) => {
                if (!userData || !userData.accountStatus) {
                    this.openPopup();
                    return;
                }
                const status = userData.accountStatus;

                if (
                    status === 'Aktywny' ||
                    status === 'Walidowany' ||
                    status === 'Nieaktywny'
                ) {
                    return;
                }

                if (this.dontShowPopUpAgain) {
                    this.openPopup();
                }
            },
            error: (error) => {
                console.error(
                    'Błąd podczas pobierania danych użytkownika:',
                    error
                );
                this.openPopup();
            },
        });

        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                this.config = config;
            });
    }

    private openPopup(): void {
        if (this.dontShowPopUpAgain) {
            setTimeout(() => {
                this.settingsButton.nativeElement.click();
            }, 0);
        }
    }

    // if (this.dontShowPopUpAgain) {
    //         setTimeout(() => {
    //             this.settingsButton.nativeElement.click();
    //         }, 0);
    //     }

    updateSpinner1(): void {
        interval(25)
            .pipe(
                take(101)
                // takeWhile((value) => value <= 80)
            )
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

    resetPopUp() {
        this._influencerService.setdontshowPopUpAgain(false);
        this._influencerService.setPopUpState(false);
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
        this._fuseConfigService.config = { scheme };
    }

    /**
     * Set the theme on the config
     *
     * @param theme
     */
    setTheme(theme: Theme): void {
        this._fuseConfigService.config = { theme };
    }
}
