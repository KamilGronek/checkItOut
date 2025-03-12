import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Influencer } from './Influencer';
import {
  Collaboration,
  CollaborationResponse,
  ContentTypeResponse,
  User
} from './collaboration.types';
import { AuthService } from 'app/core/services/authentication/auth.service';
import { environment } from 'environments/environment';

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

  getCollaborationList(): Observable<Collaboration[]> {
    return this.http.get<Collaboration[]>(this.apiUrl + '/list');
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

  getUser(): Observable<User> {
    return this.http.get<User>(this.mainApiUrl + '/user/paged');
  }
}
