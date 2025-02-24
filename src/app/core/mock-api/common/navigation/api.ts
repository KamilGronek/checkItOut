import {Injectable} from '@angular/core';
import {FuseNavigationItem} from '@fuse/components/navigation';
import {FuseMockApiService} from '@fuse/lib/mock-api';
import {
    adminNavigation,
    defaultNavigation,
    influenserNavigation,
    unauthorizedUserNavigation,
} from 'app/core/mock-api/common/navigation/data';
import {cloneDeep} from 'lodash-es';

import {AuthService} from 'app/core/services/authentication/auth.service';

@Injectable({providedIn: 'root'})
export class NavigationMockApi {
    private readonly _defaultNavigation: FuseNavigationItem[] =
        defaultNavigation;

    private readonly _unauthorizedUserNavigation: FuseNavigationItem[] =
        unauthorizedUserNavigation;

    private readonly _influenserNavigation: FuseNavigationItem[] =
        influenserNavigation;

    private readonly _adminNavigation: FuseNavigationItem[] = adminNavigation;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private authService: AuthService
    ) {
        // Register Mock API handlers
        this.registerHandlers();
        // this.influenserHandlers();
    }

    dataTokenRole: any;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onGet('mock-api/common/navigation').reply(() => {
            this.dataTokenRole = this.authService.getRole();

            let resultNavigation = [];

            switch (this.dataTokenRole) {
                case 'INFLUENCER':
                    resultNavigation = this._influenserNavigation;
                    break;
                case 'ADMIN':
                    resultNavigation = this._adminNavigation;
                    break;
                case 'unauthorized':
                    resultNavigation = this._unauthorizedUserNavigation;
                    break;
                default:
                    console.log('Invalid arry.');
            }

            // Return the response
            return [
                200,
                {
                    default: cloneDeep(resultNavigation),
                },
            ];
        });
    }
}
