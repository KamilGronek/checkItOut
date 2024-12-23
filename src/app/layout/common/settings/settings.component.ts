import { MatDialogRef } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import {
    FuseConfig,
    FuseConfigService,
    Scheme,
    Theme,
    Themes,
} from '@fuse/services/config';

import { Subject, takeUntil } from 'rxjs';
import { Input } from '@angular/core';

import { DrawerService } from 'app/services/influencer/drawer.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { AnalyticsService } from 'app/modules/admin/profile/analytics.service';
import {
    ProgressSpinnerMode,
    MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { takeWhile } from 'rxjs/operators';

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
export class DialogExampleComponent implements OnInit, OnDestroy {
    // config: FuseConfig;
    layout: string;
    // scheme: 'dark' | 'light';
    // theme: string;
    // themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() config: FuseConfig;

    // settingsDrawer!: FuseDrawerComponent;

    // isOpen = false;
    data: any;

    // chartNewVsReturning: ApexOptions;

    // mode: ProgressSpinnerMode = 'determinate';

    maxValue = 3200;
    currentValue = 0;
    spinnerValue = 0;

    value = 20;
    progress = 0;

    progressMoney = 0;
    valueMoney = 0;
    isHighlight = false;
    isHighlight2 = false;
    isHighlight3 = false;

    progress1 = 0;
    value1 = 0;

    progress2 = 0;
    value2 = 0;

    progress3 = 0;
    value3 = 0;

    // toggleDrawer(): void {
    //     if (this.settingsDrawer) {
    //         this.settingsDrawer.toggle();
    //     }
    // }
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        // public dialogRef: MatDialogRef<DialogExampleComponent>,
        private drawerService: DrawerService,
        private _analyticsService: AnalyticsService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {
        this.updateSpinner1();
        this.updateSpinner2();
        this.updateSpinner3();

        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                // Store the config
                this.config = config;
            });

        // this.drawerService.drawerState$.subscribe((state) => {
        //     this.isOpen = state;
        //     console.log(this.isOpen);
        // });
    }

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
                    // this.value2 = 80;

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
    // setLayout(layout: string): void {
    //     // Clear the 'layout' query param to allow layout changes
    //     this._router
    //         .navigate([], {
    //             queryParams: {
    //                 layout: null,
    //             },
    //             queryParamsHandling: 'merge',
    //         })
    //         .then(() => {
    //             // Set the config
    //             this._fuseConfigService.config = { layout };
    //         });
    // }

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

    close(): void {
        // this.dialogRef.close();
    }
}
