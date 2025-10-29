import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard } from './shared/guards/auth.guard';
import { landingPage } from './landingPage/landingPage';
import { RouterModule } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
    { path: '', component: landingPage },
    { path: 'landing', component: landingPage}, 
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'login', component: Login }, 
    { path: 'register', component: Register }, 
    { path: '**', redirectTo: '' } // PENDING DE CREAR UNA BASE
];      