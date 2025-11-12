import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router";

export const authGuard = (route: any, state: any) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    } else {
        const returnUrl = state.url || '/home';
        console.log('🔍 Guard bloqueando, URL actual:', returnUrl );

        router.navigate(['/login'], {
            queryParams: { returnUrl: returnUrl }
        });
        return false;
    }
}
