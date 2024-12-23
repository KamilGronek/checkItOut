import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawerService {
    // private drawerState = new BehaviorSubject<boolean>(false); // Domyślnie zamknięty
    // drawerState$ = this.drawerState.asObservable();
    // openDrawer(): void {
    //     this.drawerState.next(true); // Ustaw stan na otwarty
    // }
    // closeDrawer(): void {
    //     this.drawerState.next(false); // Ustaw stan na zamknięty
    // }
}
