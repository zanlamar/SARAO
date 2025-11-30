import { Injectable, signal } from "@angular/core";
import { Auth, user } from "@angular/fire/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Router } from "@angular/router";
import { SupabaseService } from "./supabase.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    currentUser = signal<any>(null);
    private user$: ReturnType<typeof user>;

    constructor(
        private auth: Auth,
        private router: Router,
        private supabaseService: SupabaseService,
    ) {
        this.user$ = user(this.auth);
        this.user$.subscribe(user => {
            this.currentUser.set(user);
        });
    }

    waitForAuthentication(): Promise<void> {
    return new Promise((resolve) => {
        if (this.currentUser() !== null) {
            resolve();
            return;
        }
        const subscription = this.user$.subscribe(usr => {
            if (usr !== null) {
                subscription.unsubscribe();
                resolve();
            }
        });
    });
    }

    async register(email: string, password: string) {
        try {
            const credential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );
            const firebaseUid = credential.user.uid;
            try {
                await this.supabaseService.getClient()
                    .from('users')           
                    .insert({ 
                        firebase_uid: firebaseUid,
                        email: email
                    });
            } catch (supabaseError: any) {
                console.error('Error al guardar en Supabase:', supabaseError.message);
            }
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


}
