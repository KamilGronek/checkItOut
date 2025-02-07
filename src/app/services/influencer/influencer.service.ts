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
    //=====================================================================

    private apiUrl: string = environment.apiUrl;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    dataToken: any;

    constructor(private http: HttpClient, private authService: AuthService) {}

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
        return this.http.get<Influencer>(this.apiUrl + `/collaborations/${id}`);
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
