import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth.guard';
import { landingPage } from './features/landingPage/landingPage';
import { Home } from './features/home/home';
import { EventForm } from './features/event-form/event-form';
import { CalendarView } from './features/calendar-view/calendar-view';

export const routes: Routes = [
    { path: '', component: landingPage },
    { path: 'landing', component: landingPage}, 
    { path: 'login', component: Login }, 
    { path: 'register', component: Register }, 
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'calendar-view', component: CalendarView, canActivate: [authGuard]},
    { path: 'create', component: EventForm, canActivate: [authGuard] }, 
    { path: '**', redirectTo: '' } 
];      