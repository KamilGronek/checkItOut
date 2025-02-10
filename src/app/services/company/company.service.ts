import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { Influencer } from './Influencer';
import { Company } from './Company';
import { CompanyResponse } from './Company';
import { City } from '../influencer/Influencer';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    private apiUrl: string = environment.apiUrl + "/company";

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    dataToken: any;

    constructor(private http: HttpClient, private authService: AuthService) {}

    getCompanyList(): Observable<Company[]> {
        return this.http.get<Company[]>(this.apiUrl + '/list');
    }

    getCompanyPaged(
        pageIndex: number,
        pageSize: number,
        sortBy: string,
        direction: string,
        statusInflu: string,
        firstName: string,
        lastName: string
    ): Observable<CompanyResponse> {
        const url =
            `${this.apiUrl}/paged?page=${pageIndex}&size=${pageSize}&sort=${sortBy},${direction}&firstName=${firstName}&lastName=${lastName}` +
            (statusInflu ? `&accountStatus=${statusInflu}` : '');

        return this.http.get<CompanyResponse>(url);
    }

    updateCompanyPatch(company: Company, id: number): Observable<Company> {
        return this.http.patch<Company>(
            this.apiUrl + `/${id}`,
            company,
            this.httpOptions
        );
    }

    updateCompanyPut(company: Company, id: number) {
        return this.http.put<Company>(
            this.apiUrl + `/${id}`,
            company,
            this.httpOptions
        );
    }

    deleteCompany(id: number) {
        return this.http.delete<Company>(this.apiUrl + `/${id}`);
    }
}
