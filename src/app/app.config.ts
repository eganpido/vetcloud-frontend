import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Gi-usab ni
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';

// I-import ang imong gihimo nga interceptor
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. PrimeNG Services
    ConfirmationService,
    MessageService,

    // 2. Core Angular Providers
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 3. Router with Smooth Transitions
    provideRouter(routes, withViewTransitions()),

    // 4. HTTP Client with Auth Interceptor
    // Gi-update nato ni para awtomatiko nga i-attach ang Token sa matag request
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // 5. Animations
    provideAnimationsAsync(),

    // 6. PrimeNG v18 Configuration
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.app-dark',
          cssLayer: false
        }
      },
      ripple: true
    })
  ]
};