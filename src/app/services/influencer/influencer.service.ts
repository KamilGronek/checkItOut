import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Influencer, InfluencerUserResponse } from './Influencer';
import { InfluencerResponse } from './Influencer';
import { City } from './Influencer';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { InfluencerUser } from 'app/core/influencerUser/InfluencerUser.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class InfluencerService {
    dataJson = [
        {
            id: 1,
            firstName: 'Salon Fryzjerksi',
            lastName: 'Wrocław',
            instagramId: '@fastCat',
            images: 'https://i.pinimg.com/736x/90/0d/4b/900d4b106c5484f0765396d0e69ab850.jpg',
        },
        {
            id: 2,
            firstName: 'Restauracja Galeon',
            lastName: 'Warszawa',
            instagramId: '@gessler',
            images: 'https://i.pinimg.com/736x/b8/3c/92/b83c92b2bfa0e34179de0954c2e1acf9.jpg',
        },
        {
            id: 3,
            firstName: 'Cukiernia u Jagody',
            lastName: 'Poznań',
            instagramId: '@jagodzianka',
            images: 'https://i.pinimg.com/736x/79/e8/16/79e81634cbd224b9feb85646384240ce.jpg',
        },
        {
            id: 4,
            firstName: 'Smart Kids Planet',
            lastName: 'Warszawa',
            instagramId: '@fso',
            images: 'https://i.pinimg.com/736x/0c/8e/f1/0c8ef1e0828fe50c2bf0d4459c516c46.jpg',
        },
        {
            id: 5,
            firstName: 'Escape Room',
            lastName: 'Wrocław',
            instagramId: '@escapeRoom',
            images: 'https://i.pinimg.com/736x/9d/c1/2f/9dc12fec4a03efe8217763c8919ba997.jpg',
        },
        {
            id: 6,
            firstName: 'Kwiaciarnia u Gabrieli',
            lastName: 'Łeba',
            instagramId: '@gabriela_kwiaty',
            images: 'https://i.pinimg.com/236x/3c/4f/b9/3c4fb9fe635381f36fe18f9fbb49ee2d.jpg',
        },
        {
            id: 7,
            firstName: 'Sexblowsion',
            lastName: 'Warszawa',
            instagramId: '@sexblowsion',
            images: 'https://i.pinimg.com/236x/54/a1/8e/54a18e4d96c3a867b9bf0cd23991f1b8.jpg',
        },
        {
            id: 8,
            firstName: 'Coffee shop Amnezja',
            lastName: 'Radom',
            instagramId: '@amnezja',
            images: 'https://i.pinimg.com/736x/77/28/67/772867c683ee3e149edb327297b86e61.jpg',
        },
        {
            id: 9,
            firstName: 'Przedszkole "Mały Diabełek"',
            lastName: 'Łysa Góra',
            instagramId: '@spij_kochanie_spij',
            images: 'https://i.pinimg.com/736x/da/bf/c8/dabfc884b236cd9703590c54a5faef79.jpg',
        },
    ];

    //=====================================================================

    private apiUrl: string = environment.apiUrl;

    private isDisabled = new BehaviorSubject<boolean>(false);

    private isPopUpVisible = new BehaviorSubject<boolean>(false);

    private hidePopUpPermanently = new BehaviorSubject<boolean>(true);

    isDisabled$ = this.isDisabled.asObservable();
    isPopUpVisible$ = this.isPopUpVisible.asObservable();

    hidePopUpPermanently$ = this.hidePopUpPermanently.asObservable();

    setDisabledState(state: boolean) {
        this.isDisabled.next(state);
    }

    getPopUpState() {
        return this.isPopUpVisible$;
    }

    setPopUpState(status: boolean): void {
        this.isPopUpVisible.next(status);
    }

    getHidePopUpPermanently(): boolean {
        try {
            const storedValue = localStorage.getItem('hidePopUpPermanently');
            return storedValue === 'true';
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            return false;
        }
    }

    setHidePopUpPermanently(status: boolean): void {
        this.hidePopUpPermanently.next(status);
        try {
            localStorage.setItem('hidePopUpPermanently', String(status));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    dataToken: any;

    constructor(private http: HttpClient, private authService: AuthService) {}

    getdataJson(): Observable<any[]> {
        return of(this.dataJson);
    }

    getInfluencerList(): Observable<Influencer[]> {
        return this.http.get<Influencer[]>(this.apiUrl + '/user' + '/list');
    }

    getInfluencerCityList(): Observable<City[]> {
        return this.http.get<City[]>(this.apiUrl + '/city/list');
    }

    getInfluencerTypeAccount() {
        return this.http.get(this.apiUrl + '/accounts/type');
    }

    getInfluencerStatus() {
        return this.http.get(this.apiUrl + '/accounts/status');
    }

    getInfluencerById(id: number): Observable<Influencer> {
        return this.http.get<Influencer>(this.apiUrl + '/' + id);
    }

    deleteInfluencerById(id: number): Observable<Response> {
        return this.http.delete<Response>(this.apiUrl + '/' + id);
    }

    addInfluencer(influencer: Influencer) {
        return this.http.post<Influencer>(
            this.apiUrl + '/create',
            influencer,
            this.httpOptions
        );
    }

    getCollaborations() {
        return this.http.get(this.apiUrl + '/collaborations');
    }

    getCollaborationId(id: number): Observable<Influencer> {
        return this.http.get<Influencer>(
            this.apiUrl + `/collaborations/${id}`
        );
    }

    createInfluencerUser(user: any) {
        return this.http.post<InfluencerUser>(
            `${this.apiUrl}/user`,
            user,
            this.httpOptions
        );
    }

    updateInfluencer(
        influencer: Influencer,
        influencerId: number
    ): Observable<Influencer> {
        const url = `${this.apiUrl}/${influencerId}`;
        return this.http.patch<Influencer>(url, influencer, this.httpOptions);
    }

    updateInfluencerUser(influencerUser: InfluencerUser, id: number) {
        return this.http.put<InfluencerUser>(
            `${this.apiUrl}/user/${id}`,
            influencerUser,
            this.httpOptions
        );
    }

    getInfluencerPaged(
        pageIndex: number,
        pageSize: number,
        sortBy: string,
        direction: string,
        statusInflu: string,
        instagramAccountType: string,
        firstName: string,
        lastName: string
    ): Observable<InfluencerUserResponse> {
        const url =
            `${this.apiUrl}/user/paged?page=${pageIndex}&size=${pageSize}&sort=${sortBy},${direction}&firstName=${firstName}&lastName=${lastName}` +
            (statusInflu ? `&accountStatus=${statusInflu}` : '') +
            (instagramAccountType
                ? `&instagramAccountType=${instagramAccountType}`
                : '');

        return this.http.get<InfluencerUserResponse>(url);
    }

    getInfluencerUser() {
        this.dataToken = this.authService.getDecodedToken();
        return this.http.get<InfluencerUser>(
            this.apiUrl + `/user/user/${this.dataToken.sub}`
        );
    }
}
