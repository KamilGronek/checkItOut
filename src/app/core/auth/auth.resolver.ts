import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthResolver implements Resolve<any> {
    constructor(private authService: AuthService) {}

    resolve() {
        const dataTokenRole = this.authService.getRole();
        return dataTokenRole;
    }
}
