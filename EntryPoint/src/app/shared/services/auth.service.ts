import { Injectable, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<any>(null);

    constructor(
        private auth: Auth,
        private router: Router
    ) {
        user(this.auth).subscribe(user => {
            this.currentUser.set(user);
        });
    }

    async register(email: string, password: string) {
        try {
            const credential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );
            return { success: true, user: credential.user };
            
        } catch (error: any) {
            return { success: false, error: error.message};
            
        }
    }

    async login(email:string, password:string) {
        try {
            const credential = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );
            return { success: true, user: credential.user };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    } 

    async logout() {
        await signOut(this.auth);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return this.currentUser() !== null;
    }
};