import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'app/core/services/authentication/auth.service';
import {
  City,
  CityResponse,
  Influencer,
  InfluencerUser,
  InfluencerUserResponse
} from './influencer.types';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfluencerService {
  //=====================================================================

  private apiUrl: string = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  dataToken: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getInfluencerList(): Observable<Influencer[]> {
    return this.http.get<Influencer[]>(this.apiUrl + '/user' + '/list');
  }

  getInfluencerCityList(): Observable<CityResponse> {
    return this.http.get<CityResponse>(this.apiUrl + '/city/paged');
  }

  getInfluencerTypeAccount() {
    return this.http.get(this.apiUrl + '/influencer/accounts/type');
  }

  getInfluencerStatus() {
    return this.http.get(this.apiUrl + '/influencer/accounts/status');
  }

  getInfluencerById(id: number): Observable<Influencer> {
    return this.http.get<Influencer>(this.apiUrl + '/' + id);
  }

  deleteInfluencerById(id: number): Observable<Response> {
    return this.http.delete<Response>(this.apiUrl + '/' + id);
  }

  addInfluencer(influencer: Influencer) {
    return this.http.post<Influencer>(this.apiUrl + '/create', influencer, this.httpOptions);
  }

  getInfluencersToRate(
    filterRateStatus?: string,
    opportunityStatus?: string,
    fromDate?: string,
    toDate?: string,
    page: number = 0,
    size: number = 12
  ) {
    let params = new HttpParams();
    if (filterRateStatus) {
      params = params.set('filterRateStatus', filterRateStatus);
    }

    if (opportunityStatus) {
      params = params.set('opportunityStatus', opportunityStatus);
    }

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    params = params.set('page', page.toString());
    params = params.set('size', size.toString());
    return this.http.get(this.apiUrl + '/activecoop/influencers/rate', { params });
  }

  getIfluencersToAccept(minFollowers: number, maxFollowers: number, minPositiveRates: number) {
    let params = new HttpParams();

    if (minFollowers != null) {
      params = params.set('minFollowers', minFollowers.toString());
    }
    if (maxFollowers != null) {
      params = params.set('maxFollowers', maxFollowers.toString());
    }

    if (minPositiveRates != null) {
      params = params.set('minPositiveRates', minPositiveRates.toString());
    }
    return this.http.get(this.apiUrl + '/activecoop/influencers/accept', { params });
  }

  getCollaborations() {
    return this.http.get(this.apiUrl + '/collaborations');
  }

  getCollaborationId(id: number): Observable<Influencer> {
    return this.http.get<Influencer>(this.apiUrl + `/collaborations/${id}`);
  }

  createInfluencerUser(user: any) {
    return this.http.post<InfluencerUser>(`${this.apiUrl}/user`, user, this.httpOptions);
  }

  updateInfluencer(influencer: Influencer, influencerId: number): Observable<Influencer> {
    const url = `${this.apiUrl}/${influencerId}`;
    return this.http.patch<Influencer>(url, influencer, this.httpOptions);
  }

  updateInfluencerUser(influencerUser: InfluencerUser, id: number) {
    console.log(influencerUser);
    return this.http.put<InfluencerUser>(
      `${this.apiUrl}/user/${id}`,
      influencerUser,
      this.httpOptions
    );
  }

  updateAppliedOpportunityStatus(
    id: number,
    updates: { opportunityStatus?: string; rateStatus?: string }
  ) {
    return this.http.patch(`${this.apiUrl}/applied-opportunity/rate/update/${id}`, updates, {
      ...this.httpOptions,
      responseType: 'text' as 'json'
    });
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
      (instagramAccountType ? `&instagramAccountType=${instagramAccountType}` : '');

    return this.http.get<InfluencerUserResponse>(url);
  }

  getInfluencerUser() {
    this.dataToken = this.authService.getDecodedToken();
    return this.http.get<InfluencerUser>(this.apiUrl + `/user/user/${this.dataToken.sub}`);
  }
}
