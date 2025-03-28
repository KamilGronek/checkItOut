import { Injectable } from '@angular/core';
import {environment} from "environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FormControl} from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class DictionaryService {
    private apiUrl = environment.apiUrl + "/dictionary";

    constructor(private http: HttpClient) {}

    getCategories(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/categories`);
    }

    getAllEntries(): Observable<DictionaryEntry[]> {
        return this.http.get<DictionaryEntry[]>(`${this.apiUrl}/all`);
    }

    createEntry(entry: NewDictionaryEntry): Observable<DictionaryEntry> {
        return this.http.post<DictionaryEntry>(`${this.apiUrl}/entry`, entry);
    }

    deleteEntry(id: string): Observable<string> {
        return this.http.delete<string>(`${this.apiUrl}/entry?id=${id}`);
    }
}

export interface DictionaryEntry {
    id?: string;
    key: string;
    value: string;
    languageCode: string;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type NewDictionaryEntry = Partial<{
    key: string;
    value: string;
    languageCode: string;
    category: string;
}>

export interface NewDictionaryEntryForm {
    key: FormControl<string | null>;
    value: FormControl<string | null>;
    languageCode: FormControl<string | null>;
    category: FormControl<string | null>;
}
