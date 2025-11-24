import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth.guard';
import { landingPage } from './features/landingPage/landingPage';
import { Home } from './features/home/home';
import { EventForm } from './features/event-form/event-form';
import { CalendarView } from './features/calendar-view/calendar-view';
import { EventPreview } from './features/event-preview/event-preview';
import { ShareableUrlComponent } from './features/shareable-url/shareable-url';
import { UserArea } from './features/user-area/user-area';
import { Memento } from './features/memento/memento';
export const routes: Routes = [
    { path: '', component: landingPage },
    { path: 'landing', component: landingPage}, 
    { path: 'login', component: Login }, 
    { path: 'register', component: Register }, 
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'calendar-view', component: CalendarView, canActivate: [authGuard]},
    { path: 'create', component: EventForm, canActivate: [authGuard] }, 
    { path: 'event-preview', component: EventPreview, canActivate: [authGuard] },
    { path: 'event-preview/:id', component: EventPreview, canActivate: [authGuard] },
    { path: 'shareable-url/:id', component: ShareableUrlComponent, canActivate: [authGuard] },
    { path: 'user-area', component: UserArea, canActivate: [authGuard] },
    { path: 'memento', component: Memento, canActivate: [authGuard] },
    { path: '**', redirectTo: '' } 
]; 
