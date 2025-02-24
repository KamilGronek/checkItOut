import {NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {FuseFullscreenComponent} from '@fuse/components/fullscreen';
import {FuseLoadingBarComponent} from '@fuse/components/loading-bar';
import {FuseNavigationService, FuseVerticalNavigationComponent,} from '@fuse/components/navigation';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {TranslocoModule} from '@ngneat/transloco';
import {Navigation, NavigationService} from 'app/core/services/navigation.service';
import {UserService} from 'app/feature/users/services/user.service';
import {User} from 'app/feature/users/services/user.types';
import {LanguagesComponent} from 'app/shared/components/layout/languages/languages.component';
import {NotificationsComponent} from 'app/shared/components/layout/notifications/notifications.component';
import {SearchComponent} from 'app/shared/components/layout/search/search.component';
import {Subject, takeUntil} from 'rxjs';
import {
    UserProfileDialogComponent
} from "../../../../../feature/users/components/user-profile-dialog/user-profile-dialog.component";
import {AuthService} from "../../../../../core/services/authentication/auth.service";
import {
    adminNavigation,
    influenserNavigation,
    unauthorizedUserNavigation
} from "../../../../../core/mock-api/common/navigation/data";

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseLoadingBarComponent,
        FuseVerticalNavigationComponent,
        NotificationsComponent,
        NgIf,
        MatIconModule,
        MatButtonModule,
        LanguagesComponent,
        FuseFullscreenComponent,
        SearchComponent,
        RouterOutlet,
        TranslocoModule,
        UserProfileDialogComponent,
    ],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _authService: AuthService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this.navigation = {
            compact: [],
            default: [],
            futuristic: [],
            horizontal: [],
        }

        let dataTokenRole = this._authService.getRole();

        let resultNavigation = [];

        switch (dataTokenRole) {
            case 'INFLUENCER':
                resultNavigation = influenserNavigation;
                break;
            case 'ADMIN':
                resultNavigation = adminNavigation;
                break;
            case 'unauthorized':
                resultNavigation = unauthorizedUserNavigation;
                break;
            default:
                console.log('Invalid arry.');
        }

        this.navigation.default = resultNavigation;

        console.log(this.navigation);

        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                console.log(navigation);

                this.navigation = navigation;
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
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
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
