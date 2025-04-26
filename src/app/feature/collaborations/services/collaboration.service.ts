import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Collaboration,
  CollaborationResponse,
  ContentTypeResponse,
  User,
  ServiceTypeCollaboration
} from './collaboration.types';
import { AuthService } from 'app/core/services/authentication/auth.service';
import { environment } from 'environments/environment';
import { ViewType } from '@fuse/components/stepper/stepper';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private apiUrl: string = environment.apiUrl + '/partnership-opportunity';

  private mainApiUrl: string = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  dataToken: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCollaborationList(): Observable<CollaborationResponse> {
    return this.http.get<CollaborationResponse>(this.apiUrl + '/paged');
  }

  getCollaborationId(id: number): Observable<Collaboration> {
    return this.http.get<Collaboration>(this.apiUrl + `/${id}`);
  }

  getCollaborationContentType(): Observable<ContentTypeResponse> {
    return this.http.get<ContentTypeResponse>(this.mainApiUrl + '/content-type/paged');
  }

  getCollaborationPlatform(): Observable<ContentTypeResponse> {
    return this.http.get<ContentTypeResponse>(this.mainApiUrl + '/platform/paged');
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
    const url = `${this.apiUrl}/paged?page=${pageIndex}&size=${pageSize}&sort=${sortBy},${direction}&name=${name}&city=${city}&details=${details}&title=${title}`;

    return this.http.get<CollaborationResponse>(url);
  }

  createCollaboration(collaboration: any) {
    console.log('server:', collaboration);

    return this.http.post<any>(this.apiUrl, collaboration, this.httpOptions);
  }

  deleteCollaboration(id: number) {
    return this.http.delete<Collaboration>(this.apiUrl + `/${id}`);
  }

  updateCollaboration(collaboration: Collaboration, id: number) {
    return this.http.put<Collaboration>(this.apiUrl + `/${id}`, collaboration, this.httpOptions);
  }

  getCompensationType(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/compensation/type`);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(this.mainApiUrl + '/user/paged');
  }

  getServiceTypeList(): Observable<ServiceTypeCollaboration> {
    return this.http.get<ServiceTypeCollaboration>(this.mainApiUrl + '/service-type/paged');
  }

  getInfluencersToRate(filterRateStatus?: string, page: number = 0, size: number = 12) {
    let params = new HttpParams();
    if (filterRateStatus) {
      params = params.set('filterRateStatus', filterRateStatus);
    }
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());
    return this.http.get(this.mainApiUrl + '/activecoop/rate', { params });
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
    return this.http.get(this.mainApiUrl + '/activecoop/accept', { params });
  }

  getCollaborationsInProgress(filter?: any) {
    let params = new HttpParams();

    if (filter && filter.opportunityStatusFilter.length > 0) {
      params = params.set('statuses', filter.opportunityStatusFilter.join(','));
    }
    return this.http.get(this.mainApiUrl + '/activecoop/inprogress', { params });
  }

  updateAppliedOpportunityRate(
    id: number,
    updates: { opportunityStatus?: string; rateStatus?: string }
  ) {
    return this.http.patch(`${this.mainApiUrl}/applied-opportunity/rate/update/${id}`, updates, {
      ...this.httpOptions,
      responseType: 'text' as 'json'
    });
  }

  updateAppliedOpportunityStatus(id: number, accept: boolean) {
    let params = new HttpParams();
    params = params.set('accept', accept.toString());
    return this.http.patch(this.mainApiUrl + `/applied-opportunity/status/update/${id}`, null, {
      params
    });
  }

  parseCollaborationInProgressData(data: any, viewType: ViewType) {
    return data.map((collab: any) => {
      const commonData = {
        id: collab.id,
        appliedOpportunityId: collab.appliedOpportunityId,
        appliedOpportunityStatus: collab.appliedOpportunityStatus,
        partnershipOpportunityTitle: collab.partnershipOpportunityTitle
      };

      if (viewType === ViewType.INFLUENCER) {
        return {
          ...commonData,
          name: collab.companyName,
          avatarUrl: collab.companyAvatarUrl
        };
      } else if (viewType === ViewType.COMPANY) {
        return {
          ...commonData,
          name: `${collab.influencerFirstName} ${collab.influencerLastName}`,
          avatarUrl: collab.influencerAvatarUrl
        };
      } else {
        return collab;
      }
    });
  }
}
