import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth.guard';
import { landingPage } from './features/landing-page/landingPage';
import { Home } from './features/home/home';
import { EventForm } from './features/event-form/event-form';
import { CalendarView } from './features/calendar-view/calendar-view';
import { EventPreview } from './features/event-preview/event-preview';
import { ShareableUrlComponent } from './features/shareable-url/shareable-url';
import { UserArea } from './features/user-area/user-area';
import { Memento } from './features/memento/memento';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'landing' },

    { path: 'landing', component: landingPage, 
    data: { headerVariant: 'landing', headerMode: 'landing', footerVariant: 'minimal' }}, 
    { path: 'login', component: Login,  
    data: { headerVariant: 'compact', headerMode: 'auth', footerVariant: 'minimal' } }, 
    { path: 'register', component: Register, 
    data: { headerVariant: 'compact', headerMode: 'auth', footerVariant: 'minimal' } }, 
    { path: 'home', component: Home, canActivate: [authGuard], 
    data: { headerVariant: 'compact', headerMode: 'main' } },
    { path: 'calendar-view', component: CalendarView, canActivate: [authGuard], 
    data: { headerVariant: 'compact', headerMode: 'main', footerVariant: 'full' } },
    { path: 'create', component: EventForm, canActivate: [authGuard], 
    data: { headerVariant: 'compact', headerMode: 'main', footerVariant: 'minimal' } }, 
    { path: 'event-preview', component: EventPreview, canActivate: [authGuard],
    data: { headerVariant: 'compact', headerMode: 'main', footerVariant: 'minimal' } },
    { path: 'event-preview/:id', component: EventPreview, canActivate: [authGuard],
    data: { headerVariant: 'compact', headerMode: 'main', footerVariant: 'minimal' } },
    { path: 'shareable-url/:id', component: ShareableUrlComponent, canActivate: [authGuard],
    data: { headerVariant: 'compact', headerMode: 'main', footerVariant: 'full' } },
    { path: 'user-area', component: UserArea, canActivate: [authGuard],
    data: { headerVariant: 'compact', headerMode: 'main', footerVariant: 'minimal' } },
    { path: 'memento', component: Memento, canActivate: [authGuard],
    data: { headerVariant: 'compact', headerMode: 'main', footerVariant: 'minimal' } },
    { path: '**', redirectTo: '' } 
]; 
