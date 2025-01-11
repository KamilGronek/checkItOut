import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { Influencer } from './Influencer';
import { Collaboration } from './Collaboration';
import { CollaborationResponse } from './Collaboration';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CollaborationService {
    private apiUrl: string = 'http://localhost:8080/partnership-opportunity';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    dataToken: any;

    constructor(private http: HttpClient, private authService: AuthService) {}

    getCollaborationList(): Observable<Collaboration[]> {
        return this.http.get<Collaboration[]>(this.apiUrl + '/list');
    }

    getCollaborationPaged(
        pageIndex: number,
        pageSize: number,
        sortBy: string,
        direction: string,
        // statusInflu: string,
        name: string,
        city: string,
        details: string,
        title: string
    ): Observable<CollaborationResponse> {
        const url = `${this.apiUrl}/paged?page=${pageIndex}&size=${pageSize}&sort=${sortBy},${direction}&name=${name}&city=${city}&details=${details}&title=${title}`;
        // + (statusInflu ? `&accountStatus=${statusInflu}` : '');

        return this.http.get<CollaborationResponse>(url);
    }

    createCollaboration(collaboration: any) {
        console.log('server:', collaboration);

        return this.http.post<any>(
            this.apiUrl,
            collaboration,
            this.httpOptions
        );
    }

    deleteCollaboration(id: number) {
        return this.http.delete<Collaboration>(this.apiUrl + `/${id}`);
    }

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
