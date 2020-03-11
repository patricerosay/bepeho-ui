import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuardHublo implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        if (localStorage.getItem('isLoggedinHublo')) {
            return true;
        }

        this.router.navigate(['/login-hublo']);
        return false;
    }
}
