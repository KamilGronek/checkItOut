import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Influencer } from './Influencer';
import { Collaboration, CollaborationResponse } from './collaboration.types';
import { AuthService } from 'app/core/services/authentication/auth.service';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CollaborationService {
    private baseUrl: string = environment.apiUrl;
    private collabUrl: string = environment.apiUrl + '/partnership-opportunity';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    dataToken: any;

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    getCollaborationList(): Observable<Collaboration[]> {
        return this.http.get<Collaboration[]>(this.collabUrl + '/list');
    }

    getCollaborationPaged(
        pageIndex: number,
        pageSize: number,
        sortBy: string,
        direction: string,
        name: string,
        city: string,
        details: string,
        title: string
    ): Observable<CollaborationResponse> {
        const url = `${this.collabUrl}/paged?page=${pageIndex}&size=${pageSize}&sort=${sortBy},${direction}&name=${name}&city=${city}&details=${details}&title=${title}`;

        return this.http.get<CollaborationResponse>(url);
    }


    getInfluencersToRate(filterRateStatus?: string, page: number = 0, size: number = 12) {
        let params = new HttpParams();
        if (filterRateStatus) {
            params = params.set('filterRateStatus', filterRateStatus);
        }
        params = params.set('page', page.toString());
        params = params.set('size', size.toString());
        return this.http.get(this.baseUrl + '/activecoop/rate', { params });
    }

    getIfluencersToAccept(minFollowers: number, maxFollowers: number, minPositiveRates: number) {
        let params = new HttpParams()

        if (minFollowers != null) {
            params = params.set('minFollowers', minFollowers.toString());
        }
        if (maxFollowers != null) {
            params = params.set('maxFollowers', maxFollowers.toString());
        }

        if (minPositiveRates != null) {
            params = params.set('minPositiveRates', minPositiveRates.toString());
        }
        return this.http.get(this.baseUrl + '/activecoop/accept', { params });
    }

    getCollaborationsInProgress() {
        return this.http.get(this.baseUrl + '/activecoop/inprogress');
    }

    createCollaboration(collaboration: any) {
        console.log('server:', collaboration);

        return this.http.post<any>(
            this.collabUrl,
            collaboration,
            this.httpOptions
        );
    }

    deleteCollaboration(id: number) {
        return this.http.delete<Collaboration>(this.collabUrl + `/${id}`);
    }

    updateAppliedOpportunityStatus(id: number, updates: { opportunityStatus?: string; rateStatus?: string }) {
        return this.http.patch(
            `${this.baseUrl}/applied-opportunity/rate/update/${id}`,
            updates,
            { ...this.httpOptions, responseType: 'text' as 'json' }
        );
    }

    updateCollaboration(collaboration: Collaboration, id: number) {
        return this.http.put<Collaboration>(
            this.collabUrl + `/${id}`,
            collaboration,
            this.httpOptions
        );
    }
}
