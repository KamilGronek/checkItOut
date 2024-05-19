import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Influencer } from './Influencer';

@Injectable({
  providedIn: 'root'
})
export class InfluencerService {

  private apiUrl: string = "http://localhost:8080/influencer";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getInfluencerList(): Observable<Influencer[]> {
    return this.http.get<Influencer[]>(this.apiUrl + '/list');
  }

  getInfluencerById(id: number): Observable<Influencer> {
    console.log(this.apiUrl + '/' + id);
    return this.http.get<Influencer>(this.apiUrl + '/' + id);
  }

  deleteInfluencerById(id: number): Observable<Response> {
    return this.http.delete<Response>(this.apiUrl + '/' + id);
  }

  addInfluencer(influencer: Influencer) {
    return this.http.post<Influencer>(this.apiUrl + "/create", influencer, this.httpOptions);
  }

  updateInfluencer(influencer: Influencer) {
    return this.http.post<Influencer>(this.apiUrl + "/update", influencer, this.httpOptions);
  }
}
