import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PopUpService {
    private isPopUpVisible = new BehaviorSubject<boolean>(false);

    constructor() {}

    isPopUpVisible$ = this.isPopUpVisible.asObservable();

    private userKey = '';

    setUserKey(userEmail: string) {
        this.userKey = `hidePopUpPermanently_${userEmail}`;
    }

    getInitialLocalStorageValue(): boolean {
        const storedValue = localStorage.getItem(this.userKey);
        return storedValue === 'true';
    }

    setHidePopUpPermanently(status: boolean): void {
        localStorage.setItem(this.userKey, String(status));
    }

    setPopUpState(status: boolean): void {
        this.isPopUpVisible.next(status);
    }
}
