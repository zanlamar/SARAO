import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router";

export const authGuard = (route: any, state: any) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    const returnUrl = state.url;
    router.navigate(['/login'], {
        queryParams: { returnUrl: returnUrl }
    });
    
    return false;
}

