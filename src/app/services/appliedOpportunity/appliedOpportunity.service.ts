import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { Influencer } from './Influencer';
import { AppliedOpportunity } from './AppliedOpportunity';
import { CollaborationResponse } from '../collaboration/Collaboration';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AppliedOpportunityService {
    private apiUrl: string = environment.apiUrl + '/applied-opportunity';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    dataToken: any;

    constructor(private http: HttpClient, private authService: AuthService) {}

    getServiceTypeList(): Observable<AppliedOpportunity[]> {
        return this.http.get<AppliedOpportunity[]>(this.apiUrl + '/list');
    }

    // getCollaborationPaged(
    //     pageIndex: number,
    //     pageSize: number,
    //     sortBy: string,
    //     direction: string,
    //     // statusInflu: string,
    //     name: string,
    //     city: string,
    //     details: string,
    //     title: string
    // ): Observable<CollaborationResponse> {
    //     const url = `${this.apiUrl}/paged?page=${pageIndex}&size=${pageSize}&sort=${sortBy},${direction}&name=${name}&city=${city}&details=${details}&title=${title}`;
    //     // + (statusInflu ? `&accountStatus=${statusInflu}` : '');

    //     return this.http.get<CollaborationResponse>(url);
    // }

    // createCollaboration(collaboration: any) {
    //     console.log('server:', collaboration);

    //     return this.http.post<any>(
    //         this.apiUrl,
    //         collaboration,
    //         this.httpOptions
    //     );
    // }

    // deleteCollaboration(id: number) {
    //     return this.http.delete<Collaboration>(this.apiUrl + `/${id}`);
    // }

    // updateCompanyPatch(company: Company, id: number): Observable<Company> {
    //     return this.http.patch<Company>(
    //         this.apiUrl + `/${id}`,
    //         company,
    //         this.httpOptions
    //     );
    // }

    // updateCompanyPut(company: Company, id: number) {
    //     return this.http.put<Company>(
    //         this.apiUrl + `/${id}`,
    //         company,
    //         this.httpOptions
    //     );
    // }

    // deleteCompany(id: number) {
    //     return this.http.delete<Company>(this.apiUrl + `/${id}`);
    // }
}
