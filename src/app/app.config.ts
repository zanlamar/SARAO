import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { firebaseConfig } from '../environments/environment'; 
import { initializeApp } from 'firebase/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth } from 'firebase/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
  ]
};

