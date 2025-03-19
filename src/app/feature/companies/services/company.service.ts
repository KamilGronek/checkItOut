import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
// import { Influencer } from './Influencer';
import {Company, CompanyResponse} from './company.types';
import {AuthService} from 'app/core/services/authentication/auth.service';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    private apiUrl: string = environment.apiUrl + '/company';

    private http: HttpClient = inject(HttpClient);
    private authService: AuthService = inject(AuthService);


    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
    };

    create(company: any){
        let companyData = company.business;
        let representative = company.representative;
        let credentials = company.credentials;

        // Example payload
        // {
        //     "email": "emailJaa1kubaaa1@em.ai",
        //     "userType": "FIRMA",
        //     "firstName": "Jak1ub",
        //     "lastName": "te1st",
        //     "accountStatus": "Nieaktywny",
        //     "company":
        //     {
        //         "name": "Green Earth Initiative",
        //         "phoneNumber": "917-654-321",
        //         "city": "Kraków",
        //         "address": "456 Eco Avenue",
        //         "imageUrl": "https://example.com/image2.jpg",
        //         "note": "Sustainability and eco-friendly products.",
        //         "serviceType": 1
        //     }
        // }
        let address = `${companyData.address.street} ${companyData.address.state} ${companyData.address.zip}`;
        let payload = {
            email: credentials.email,
            userType: "FIRMA",
            firstName: representative.firstName,
            lastName: representative.lastName,
            accountStatus: "Nieaktywny",
            company: {
                name: companyData.name,
                phoneNumber: companyData.address.phone,
                // city: companyData.address.city,
                city: "Kraków",
                address: address,
                // imageUrl: companyData.logo,
                note: companyData.description,
                serviceType: 1
                // serviceType: companyData.category
            }
        }
        // Create user on backend
        return this.http.post(environment.apiUrl + '/user', payload, this.httpOptions);
    }

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
